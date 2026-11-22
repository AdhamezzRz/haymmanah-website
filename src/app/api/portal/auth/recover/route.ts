import { store, logActivity } from '@/portal/store'
import { hashPassword, passwordProblem, startSession, publicUser } from '@/portal/auth'
import { issueRecoveryCode, checkRecoveryCode, consumeRecoveryCode, isOwnerKey } from '@/portal/tokens'
import { json, fail, readBody, clientIp } from '@/portal/api'
import { limitWait, limitHit, waitMessage } from '@/portal/ratelimit'

export const dynamic = 'force-dynamic'

const W = 15 * 60_000

/**
 * Owner recovery (no email needed). Proves ownership by reading a code from a
 * file only someone with Hostinger file access can open — or with the owner key,
 * which works in place of the code and is never used up.
 *   { step: 'issue' }                          → writes RECOVERY-CODE.txt in the data folder
 *   { step: 'verify', code }                   → lists admin accounts to choose from
 *   { step: 'reset', code, userId, password }  → new password, signs in
 */
export async function POST(req: Request) {
  const ip = clientIp(req)
  const body = await readBody(req)

  if (body.step === 'issue') {
    const key = `recover-issue:${ip}`
    const wait = limitWait(key, 3, W)
    if (wait) return fail(waitMessage(wait), 429)
    limitHit(key, W)
    const r = await issueRecoveryCode()
    return json({ ok: true, file: r.file, expiresAt: r.expiresAt })
  }

  const key = `recover-try:${ip}`
  const wait = limitWait(key, 10, W)
  if (wait) return fail(waitMessage(wait), 429)
  const owner = isOwnerKey(body.code)
  if (!owner && !(await checkRecoveryCode(body.code))) {
    limitHit(key, W)
    return fail('الرمز غير صحيح أو منتهي — أنشئ رمزاً جديداً', 403, { errors: { code: 'رمز غير صحيح' } })
  }

  const team = await store.list('team')
  const admins = team.filter(u => u.role === 'admin')
  const candidates = (admins.length ? admins : team).map(u => ({ id: u.id, name: String(u.name), email: String(u.email), role: String(u.role) }))

  if (body.step === 'verify') return json({ ok: true, accounts: candidates })

  if (body.step === 'reset') {
    const target = candidates.find(c => c.id === body.userId)
    if (!target) return fail('اختر حساباً من القائمة', 422)
    const pwErr = passwordProblem(body.password, target.email)
    if (pwErr) return fail(pwErr, 422, { errors: { password: pwErr } })
    if (!owner && !(await consumeRecoveryCode(body.code))) return fail('الرمز استُخدم للتو — أنشئ رمزاً جديداً', 410)
    const existing = await store.get('team', target.id)
    const updated = await store.update('team', target.id, {
      passwordHash: await hashPassword(String(body.password)),
      sessionVersion: (Number(existing?.sessionVersion) || 0) + 1,
      role: 'admin', active: true, joinStatus: '',
    })
    if (!updated) return fail('الحساب غير موجود', 404)
    await logActivity({ userId: updated.id, userName: String(updated.name), module: 'team', recordId: updated.id, recordTitle: String(updated.name), action: 'update', summary: owner ? 'استعاد الدخول بمفتاح المالك' : 'استعاد الدخول برمز الاستعادة' })
    const res = json({ ok: true, user: publicUser(updated) })
    await startSession(res, updated)
    return res
  }

  return fail('طلب غير معروف')
}
