import { store, logActivity } from '@/portal/store'
import { hashPassword, passwordProblem, accountBlock, startSession, publicUser } from '@/portal/auth'
import { consumeToken, peekToken } from '@/portal/tokens'
import { json, fail, readBody, clientIp } from '@/portal/api'
import { limitWait, limitHit, waitMessage } from '@/portal/ratelimit'

export const dynamic = 'force-dynamic'

/** Choose a new password with a reset or invite link. Signs the person in when the account is active. */
export async function POST(req: Request) {
  const key = `reset:${clientIp(req)}`
  const wait = limitWait(key, 10, 15 * 60_000)
  if (wait) return fail(waitMessage(wait), 429)

  const { token, password } = await readBody(req)
  const info = await peekToken(token, ['reset', 'invite'])
  if (!info?.userId) { limitHit(key, 15 * 60_000); return fail('الرابط غير صالح أو منتهي — اطلب رابطاً جديداً', 410) }
  const user = await store.get('team', info.userId)
  if (!user) return fail('الحساب لم يعد موجوداً', 410)
  const pwErr = passwordProblem(password, String(user.email))
  if (pwErr) return fail(pwErr, 422, { errors: { password: pwErr } })
  if (!(await consumeToken(token, ['reset', 'invite']))) return fail('الرابط استُخدم للتو — اطلب رابطاً جديداً', 410)

  const updated = await store.update('team', user.id, {
    passwordHash: await hashPassword(String(password)),
    sessionVersion: (Number(user.sessionVersion) || 0) + 1,   // signs out every other device
  })
  await logActivity({ userId: user.id, userName: String(user.name), module: 'team', recordId: user.id, recordTitle: String(user.name), action: 'update', summary: info.purpose === 'invite' ? 'فعّل حسابه واختار كلمة مرور' : 'أعاد تعيين كلمة المرور' })

  const blocked = updated ? accountBlock(updated) : 'خطأ'
  const res = json({ ok: true, loggedIn: !blocked, message: blocked, user: updated ? publicUser(updated) : null })
  if (updated && !blocked) await startSession(res, updated)
  return res
}
