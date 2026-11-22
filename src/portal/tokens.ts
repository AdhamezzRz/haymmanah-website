/**
 * One-time tokens and owner codes — server only.
 *
 * - `reset` / `invite`: random 256-bit tokens sent as links. Only the SHA-256 of
 *   a token is stored (as the record id), so a leaked data folder can't be used
 *   to reset anyone's password. Single use; issuing a new one revokes the old.
 * - `recovery`: a short human code written to a file on the server. Reading it
 *   requires Hostinger file access, which is what proves ownership when the only
 *   admin is locked out and email isn't set up.
 * - setup code: same idea for the very first admin account, so nobody who just
 *   finds /portal/setup can claim a fresh install.
 */
import { createHash, randomBytes, randomInt, timingSafeEqual } from 'crypto'
import { promises as fs } from 'fs'
import os from 'os'
import path from 'path'
import { store, DATA_DIR } from './store'

export type TokenPurpose = 'reset' | 'invite' | 'recovery'

const HOUR = 3600_000
const TTL: Record<TokenPurpose, number> = { reset: 2 * HOUR, invite: 72 * HOUR, recovery: 0.5 * HOUR }

const sha = (s: string) => createHash('sha256').update(s).digest('hex')
const TOKEN_RE = /^[A-Za-z0-9_-]{30,100}$/

export const RECOVERY_FILE = path.join(DATA_DIR, 'RECOVERY-CODE.txt')
export const SETUP_FILE = path.join(DATA_DIR, 'SETUP-CODE.txt')

/** Where a file is, as the owner would find it in File Manager. */
export function displayPath(file: string): string {
  const home = os.homedir()
  if (home && file.startsWith(home + path.sep)) return `~/${path.relative(home, file)}`
  const rel = path.relative(process.cwd(), file)
  return rel.startsWith('..') ? file : rel
}

export interface TokenInfo { userId: string | null; purpose: TokenPurpose; expiresAt: string }

async function purge(match: (r: Record<string, unknown>) => boolean) {
  const now = Date.now()
  for (const r of await store.list('_tokens')) {
    if (match(r) || new Date(String(r.expiresAt)).getTime() < now) await store.remove('_tokens', r.id)
  }
}

export async function issueToken(purpose: 'reset' | 'invite', userId: string): Promise<{ token: string; expiresAt: string }> {
  await purge(r => r.userId === userId && (r.purpose === 'reset' || r.purpose === 'invite'))
  const token = randomBytes(32).toString('base64url')
  const expiresAt = new Date(Date.now() + TTL[purpose]).toISOString()
  await store.upsert('_tokens', sha(token), { purpose, userId, expiresAt })
  return { token, expiresAt }
}

export async function peekToken(token: unknown, purposes: TokenPurpose[]): Promise<TokenInfo | null> {
  if (typeof token !== 'string' || !TOKEN_RE.test(token)) return null
  const rec = await store.get('_tokens', sha(token))
  if (!rec || !purposes.includes(rec.purpose as TokenPurpose)) return null
  if (new Date(String(rec.expiresAt)).getTime() < Date.now()) { await store.remove('_tokens', rec.id); return null }
  return { userId: rec.userId ? String(rec.userId) : null, purpose: rec.purpose as TokenPurpose, expiresAt: String(rec.expiresAt) }
}

export async function consumeToken(token: unknown, purposes: TokenPurpose[]): Promise<TokenInfo | null> {
  const info = await peekToken(token, purposes)
  if (!info) return null
  await store.remove('_tokens', sha(String(token)))
  if (info.userId) await purge(r => r.userId === info.userId && (r.purpose === 'reset' || r.purpose === 'invite'))
  return info
}

/* ── Human-readable codes (no 0/O/1/I to avoid misreading) ─────────── */

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
function humanCode(): string {
  let s = ''
  for (let i = 0; i < 8; i++) s += ALPHABET[randomInt(ALPHABET.length)]
  return `${s.slice(0, 4)}-${s.slice(4)}`
}
const normalizeCode = (c: unknown) => String(c ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '')

const riyadh = (iso: string) =>
  new Intl.DateTimeFormat('ar-SA-u-nu-latn', { timeZone: 'Asia/Riyadh', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))

/** Owner recovery: write a fresh code to RECOVERY-CODE.txt (replacing any previous one). */
export async function issueRecoveryCode(): Promise<{ expiresAt: string; file: string }> {
  await purge(r => r.purpose === 'recovery')
  const code = humanCode()
  const expiresAt = new Date(Date.now() + TTL.recovery).toISOString()
  await store.upsert('_tokens', sha(`recovery:${normalizeCode(code)}`), { purpose: 'recovery', userId: null, expiresAt })
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(RECOVERY_FILE, [
    'رمز استعادة الدخول — نظام هيمنة',
    'Haymanah portal — owner recovery code',
    '',
    `الرمز / Code:  ${code}`,
    `صالح حتى / Valid until:  ${riyadh(expiresAt)} (الرياض)`,
    '',
    'اكتب هذا الرمز في صفحة «استعادة دخول المدير» ثم اختر كلمة مرور جديدة.',
    'هذا الملف يُحذف تلقائياً بعد الاستخدام. إذا لم تطلب هذا الرمز فتجاهله واحذفه.',
    '',
  ].join('\n'), { mode: 0o600 })
  return { expiresAt, file: displayPath(RECOVERY_FILE) }
}

export async function checkRecoveryCode(code: unknown): Promise<boolean> {
  const n = normalizeCode(code)
  if (n.length !== 8) return false
  const rec = await store.get('_tokens', sha(`recovery:${n}`))
  if (!rec || rec.purpose !== 'recovery') return false
  if (new Date(String(rec.expiresAt)).getTime() < Date.now()) { await store.remove('_tokens', rec.id); return false }
  return true
}

export async function consumeRecoveryCode(code: unknown): Promise<boolean> {
  if (!(await checkRecoveryCode(code))) return false
  await purge(r => r.purpose === 'recovery')
  await fs.unlink(RECOVERY_FILE).catch(() => undefined)
  return true
}

/* ── First-run setup code ──────────────────────────────────────────── */

/** Make sure SETUP-CODE.txt exists (created once, reused until setup completes). */
export async function ensureSetupCode(): Promise<void> {
  try {
    await fs.access(SETUP_FILE)
  } catch {
    const code = humanCode()
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.writeFile(SETUP_FILE, [
      'رمز الإعداد الأول — نظام هيمنة',
      'Haymanah portal — first-time setup code',
      '',
      `الرمز / Code:  ${code}`,
      '',
      'اكتب هذا الرمز في صفحة الإعداد الأول لإنشاء حساب المدير. يُحذف الملف تلقائياً بعد الإعداد.',
      '',
    ].join('\n'), { mode: 0o600 })
  }
}

/* ── Owner key ─────────────────────────────────────────────────────── */

/**
 * A permanent 16-character key held by the owner (given to them privately).
 * It works in place of the setup code and the recovery code, so the owner never
 * needs Hostinger File Manager. Only its salted SHA-256 lives in the source —
 * 80 bits of randomness, so the hash can't be reversed. Set PORTAL_OWNER_KEY in
 * the host's environment to replace it with a key of your own.
 */
const OWNER_KEY_SHA256 = 'eb63bf221fe3016c13a7971451307f8433be791c53c22cc7d8b0718303a49081'

export function isOwnerKey(code: unknown): boolean {
  const n = normalizeCode(code)
  const custom = normalizeCode(process.env.PORTAL_OWNER_KEY)
  if (custom.length >= 12) {
    const a = Buffer.from(sha(n)), b = Buffer.from(sha(custom))
    return timingSafeEqual(a, b)
  }
  if (n.length !== 16) return false
  return timingSafeEqual(Buffer.from(sha(`haymanah-owner:${n}`)), Buffer.from(OWNER_KEY_SHA256))
}

export async function checkSetupCode(code: unknown): Promise<boolean> {
  if (isOwnerKey(code)) return true
  try {
    const raw = await fs.readFile(SETUP_FILE, 'utf8')
    const m = raw.match(/([A-Z2-9]{4}-[A-Z2-9]{4})/)
    return !!m && normalizeCode(m[1]) === normalizeCode(code) && normalizeCode(code).length === 8
  } catch {
    return false
  }
}

export async function clearSetupCode(): Promise<void> {
  await fs.unlink(SETUP_FILE).catch(() => undefined)
}
