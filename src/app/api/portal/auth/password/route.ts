import { store, logActivity } from '@/portal/store'
import { verifyPassword, hashPassword, passwordProblem, startSession } from '@/portal/auth'
import { json, fail, requireUser, readBody, clientIp } from '@/portal/api'
import { limitWait, limitHit, limitReset, waitMessage } from '@/portal/ratelimit'

export const dynamic = 'force-dynamic'

/** Change your own password. Keeps this device signed in, signs out all others. */
export async function POST(req: Request) {
  const auth = await requireUser()
  if ('response' in auth) return auth.response
  const key = `pwchange:${clientIp(req)}:${auth.user.id}`
  const wait = limitWait(key, 6, 15 * 60_000)
  if (wait) return fail(waitMessage(wait), 429)

  const { current, next } = await readBody(req)
  const me = await store.get('team', auth.user.id)
  if (!me) return fail('الحساب غير موجود', 404)
  if (!(await verifyPassword(String(current ?? ''), me.passwordHash as string | undefined))) {
    limitHit(key, 15 * 60_000)
    return fail('كلمة المرور الحالية غير صحيحة', 403, { errors: { current: 'غير صحيحة' } })
  }
  limitReset(key)
  const pwErr = passwordProblem(next, String(me.email))
  if (pwErr) return fail(pwErr, 422, { errors: { next: pwErr } })
  if (next === current) return fail('اختر كلمة مرور مختلفة عن الحالية', 422, { errors: { next: 'نفس الحالية' } })

  const updated = await store.update('team', me.id, {
    passwordHash: await hashPassword(String(next)),
    sessionVersion: (Number(me.sessionVersion) || 0) + 1,
  })
  await logActivity({ userId: me.id, userName: String(me.name), module: 'team', recordId: me.id, recordTitle: String(me.name), action: 'update', summary: 'غيّر كلمة المرور' })
  const res = json({ ok: true })
  if (updated) await startSession(res, updated)
  return res
}
