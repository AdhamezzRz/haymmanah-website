import { store, logActivity } from '@/portal/store'
import { verifyPassword, publicUser, accountBlock, startSession } from '@/portal/auth'
import { json, fail, readBody, clientIp } from '@/portal/api'
import { limitWait, limitHit, limitReset, waitMessage } from '@/portal/ratelimit'

export const dynamic = 'force-dynamic'

const WINDOW = 15 * 60_000
const MAX_FAILS = 8

export async function POST(req: Request) {
  const { email, password } = await readBody(req)
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    return fail('أدخل البريد الإلكتروني وكلمة المرور')
  }
  const mail = email.trim().toLowerCase()
  const key = `login:${clientIp(req)}:${mail}`
  const wait = limitWait(key, MAX_FAILS, WINDOW)
  if (wait) return fail(waitMessage(wait), 429)

  const user = (await store.list('team')).find(u => String(u.email).toLowerCase() === mail)
  // Always run the hash check so timing doesn't reveal whether the email exists.
  const ok = await verifyPassword(password, user ? (user.passwordHash as string | undefined) : 'scrypt$00$00')
  if (!user || !ok) {
    limitHit(key, WINDOW)
    return fail('البريد الإلكتروني أو كلمة المرور غير صحيحة', 401)
  }
  limitReset(key)
  const blocked = accountBlock(user)
  if (blocked) return fail(blocked, 403)

  const res = json({ user: publicUser(user) })
  await startSession(res, user)
  await logActivity({ userId: String(user.id), userName: String(user.name), module: 'team', recordId: String(user.id), recordTitle: String(user.name), action: 'login' })
  return res
}
