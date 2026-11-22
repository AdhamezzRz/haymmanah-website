import { store, logActivity } from '@/portal/store'
import { isEmail, accountBlock } from '@/portal/auth'
import { issueToken } from '@/portal/tokens'
import { mailEnabled, sendMail, resetEmailHtml } from '@/portal/mail'
import { json, fail, readBody, clientIp, publicOrigin } from '@/portal/api'
import { limitWait, limitHit, waitMessage } from '@/portal/ratelimit'

export const dynamic = 'force-dynamic'

/**
 * Request a reset link by email. The answer is identical whether or not the
 * email exists, so this can't be used to discover who has an account.
 */
export async function POST(req: Request) {
  const key = `forgot:${clientIp(req)}`
  const wait = limitWait(key, 5, 15 * 60_000)
  if (wait) return fail(waitMessage(wait), 429)
  limitHit(key, 15 * 60_000)

  const { email } = await readBody(req)
  if (!isEmail(email)) return fail('أدخل بريداً إلكترونياً صحيحاً')
  const enabled = mailEnabled()

  if (enabled) {
    const user = (await store.list('team')).find(u => String(u.email).toLowerCase() === email.trim().toLowerCase())
    const block = user ? accountBlock({ ...user, passwordHash: user.passwordHash ?? 'x' }) : 'none'
    if (user && !block) {
      const { token } = await issueToken('reset', user.id)
      const url = `${publicOrigin(req)}/portal/reset?token=${token}`
      const sent = await sendMail(String(user.email), 'إعادة تعيين كلمة المرور — نظام هيمنة', resetEmailHtml(String(user.name), url, 2))
      if (sent) await logActivity({ userId: user.id, userName: String(user.name), module: 'team', recordId: user.id, recordTitle: String(user.name), action: 'update', summary: 'طلب رابط إعادة تعيين كلمة المرور' })
    }
  }
  return json({ ok: true, mailEnabled: enabled })
}
