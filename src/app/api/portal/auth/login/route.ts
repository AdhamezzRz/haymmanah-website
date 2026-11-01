import { store, logActivity } from '@/portal/store'
import { verifyPassword, createSessionToken, sessionCookieOptions, SESSION_COOKIE, publicUser } from '@/portal/auth'
import { json, fail, readBody } from '@/portal/api'
import type { Role } from '@/portal/schema'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const { email, password } = await readBody(req)
  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return fail('أدخل البريد الإلكتروني وكلمة المرور')
  }
  const users = await store.list('team')
  const user = users.find(u => String(u.email).toLowerCase() === email.trim().toLowerCase())
  // Always run the hash check so timing doesn't reveal whether the email exists.
  const ok = await verifyPassword(password, user ? (user.passwordHash as string | undefined) : 'scrypt$00$00')
  if (!user || !ok) return fail('بيانات الدخول غير صحيحة', 401)
  if (user.active === false) return fail('هذا الحساب موقوف — تواصل مع مدير النظام', 403)

  const token = await createSessionToken(String(user.id), (user.role as Role) || 'member')
  const res = json({ user: publicUser(user) })
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions())
  await logActivity({ userId: String(user.id), userName: String(user.name), module: 'team', recordId: String(user.id), recordTitle: String(user.name), action: 'login' })
  return res
}
