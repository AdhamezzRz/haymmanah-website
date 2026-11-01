/**
 * Portal authentication — server only.
 *
 * Passwords: scrypt (Node crypto) with a per-user salt.
 * Sessions: HMAC-signed, HttpOnly cookie carrying { uid, role, exp }.
 * Secret: PORTAL_SECRET env var, or an auto-generated `data/portal/.secret`
 * so the portal works out of the box on a single host (Hostinger) with no setup.
 */
import { scrypt as scryptCb, randomBytes, timingSafeEqual, createHmac } from 'crypto'
import { promisify } from 'util'
import { promises as fs } from 'fs'
import path from 'path'
import { cookies } from 'next/headers'
import type { Role, ModuleDef } from './schema'
import { store, DATA_DIR } from './store'

const scrypt = promisify(scryptCb) as (pw: string, salt: string, len: number) => Promise<Buffer>

export const SESSION_COOKIE = 'hm_portal'
const SESSION_DAYS = 7

/* ── Passwords ─────────────────────────────────────────────────────── */

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const hash = await scrypt(password, salt, 64)
  return `scrypt$${salt}$${hash.toString('hex')}`
}

export async function verifyPassword(password: string, stored: string | undefined): Promise<boolean> {
  if (!stored || typeof stored !== 'string') return false
  const [algo, salt, hex] = stored.split('$')
  if (algo !== 'scrypt' || !salt || !hex) return false
  const hash = await scrypt(password, salt, 64)
  const expected = Buffer.from(hex, 'hex')
  return expected.length === hash.length && timingSafeEqual(hash, expected)
}

/* ── Secret ────────────────────────────────────────────────────────── */

let secretCache: string | null = null
async function getSecret(): Promise<string> {
  if (secretCache) return secretCache
  if (process.env.PORTAL_SECRET) return (secretCache = process.env.PORTAL_SECRET)
  const file = path.join(DATA_DIR, '.secret')
  try {
    secretCache = (await fs.readFile(file, 'utf8')).trim()
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
    secretCache = randomBytes(32).toString('hex')
    await fs.writeFile(file, secretCache, { mode: 0o600 })
  }
  return secretCache!
}

/* ── Sessions ──────────────────────────────────────────────────────── */

export interface Session { uid: string; role: Role; exp: number }

const b64u = (s: string | Buffer) => Buffer.from(s).toString('base64url')

export async function signSession(s: Session): Promise<string> {
  const body = b64u(JSON.stringify(s))
  const sig = createHmac('sha256', await getSecret()).update(body).digest('base64url')
  return `${body}.${sig}`
}

export async function verifySession(token: string | undefined): Promise<Session | null> {
  if (!token) return null
  const [body, sig] = token.split('.')
  if (!body || !sig) return null
  const expected = createHmac('sha256', await getSecret()).update(body).digest('base64url')
  const a = Buffer.from(sig), b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    const s = JSON.parse(Buffer.from(body, 'base64url').toString()) as Session
    if (!s.uid || !s.exp || s.exp < Date.now()) return null
    return s
  } catch {
    return null
  }
}

export function sessionCookieOptions(maxAgeSeconds = SESSION_DAYS * 86400) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: maxAgeSeconds,
  }
}

export async function createSessionToken(uid: string, role: Role) {
  return signSession({ uid, role, exp: Date.now() + SESSION_DAYS * 86400 * 1000 })
}

/* ── Current user ──────────────────────────────────────────────────── */

export interface PortalUser {
  id: string
  name: string
  email: string
  role: Role
  title?: string
  color?: string
  active?: boolean
}

export function publicUser(rec: Record<string, unknown>): PortalUser {
  return {
    id: String(rec.id),
    name: String(rec.name ?? ''),
    email: String(rec.email ?? ''),
    role: (rec.role as Role) || 'member',
    title: rec.title ? String(rec.title) : undefined,
    color: rec.color ? String(rec.color) : undefined,
    active: rec.active !== false,
  }
}

export async function getCurrentUser(): Promise<PortalUser | null> {
  const jar = await cookies()
  const session = await verifySession(jar.get(SESSION_COOKIE)?.value)
  if (!session) return null
  const rec = await store.get('team', session.uid)
  if (!rec || rec.active === false) return null
  return publicUser(rec)
}

export async function hasAnyUser(): Promise<boolean> {
  return (await store.list('team')).length > 0
}

/* ── Permissions ───────────────────────────────────────────────────── */

export function canRead(role: Role, def: ModuleDef) {
  return def.permissions.read.includes(role)
}
export function canWrite(role: Role, def: ModuleDef) {
  return def.permissions.write.includes(role)
}
