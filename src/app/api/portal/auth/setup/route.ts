import { store, logActivity, storageHealth } from '@/portal/store'
import { hashPassword, hasAnyUser, publicUser, passwordProblem, isEmail, startSession } from '@/portal/auth'
import { checkSetupCode, clearSetupCode } from '@/portal/tokens'
import { json, fail, readBody, clientIp } from '@/portal/api'
import { limitWait, limitHit, waitMessage } from '@/portal/ratelimit'

export const dynamic = 'force-dynamic'

/** First-run: creates the first admin account. Needs the owner key or the code in SETUP-CODE.txt. */
export async function POST(req: Request) {
  if (await hasAnyUser()) return fail('تم إعداد النظام مسبقاً — سجّل الدخول', 409)
  const health = await storageHealth()
  if (!health.ok) return fail(`لا يمكن الكتابة على مجلد البيانات (${health.dir}): ${health.error}`, 500)

  const key = `setup:${clientIp(req)}`
  const wait = limitWait(key, 10, 15 * 60_000)
  if (wait) return fail(waitMessage(wait), 429)

  const { name, email, password, setupCode } = await readBody(req)
  if (!(await checkSetupCode(setupCode))) {
    limitHit(key, 15 * 60_000)
    return fail('الرمز غير صحيح — اكتب مفتاح المالك أو رمز ملف SETUP-CODE.txt', 403, { errors: { setupCode: 'رمز غير صحيح' } })
  }
  if (typeof name !== 'string' || name.trim().length < 2) return fail('أدخل اسمك', 422, { errors: { name: 'أدخل اسمك' } })
  if (!isEmail(email)) return fail('بريد إلكتروني غير صالح', 422, { errors: { email: 'بريد إلكتروني غير صالح' } })
  const pwErr = passwordProblem(password, email)
  if (pwErr) return fail(pwErr, 422, { errors: { password: pwErr } })

  const user = await store.insert('team', {
    name: name.trim().slice(0, 120),
    email: email.trim().toLowerCase(),
    role: 'admin',
    title: 'مدير النظام',
    active: true,
    color: '#4C63C7',
    passwordHash: await hashPassword(String(password)),
    sessionVersion: 0,
  })
  await clearSetupCode()
  const res = json({ user: publicUser(user) })
  await startSession(res, user)
  await logActivity({ userId: user.id, userName: String(user.name), module: 'team', recordId: user.id, recordTitle: String(user.name), action: 'setup', summary: 'إنشاء حساب المدير الأول' })
  return res
}
