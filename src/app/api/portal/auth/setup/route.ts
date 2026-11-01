import { store, logActivity, storageHealth } from '@/portal/store'
import { hashPassword, createSessionToken, sessionCookieOptions, SESSION_COOKIE, hasAnyUser, publicUser } from '@/portal/auth'
import { json, fail, readBody } from '@/portal/api'

export const dynamic = 'force-dynamic'

/** First-run: creates the first admin account. Refuses once any user exists. */
export async function POST(req: Request) {
  if (await hasAnyUser()) return fail('تم إعداد النظام مسبقاً — سجّل الدخول', 409)
  const health = await storageHealth()
  if (!health.ok) return fail(`لا يمكن الكتابة على مجلد البيانات (${health.dir}): ${health.error}`, 500)

  const { name, email, password } = await readBody(req)
  if (typeof name !== 'string' || name.trim().length < 2) return fail('أدخل اسمك')
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('بريد إلكتروني غير صالح')
  if (typeof password !== 'string' || password.length < 8) return fail('كلمة المرور ٨ أحرف على الأقل')

  const user = await store.insert('team', {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role: 'admin',
    title: 'مدير النظام',
    active: true,
    color: '#4C63C7',
    passwordHash: await hashPassword(password),
  })
  const token = await createSessionToken(user.id, 'admin')
  const res = json({ user: publicUser(user) })
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions())
  await logActivity({ userId: user.id, userName: String(user.name), module: 'team', recordId: user.id, recordTitle: String(user.name), action: 'setup', summary: 'إنشاء حساب المدير الأول' })
  return res
}
