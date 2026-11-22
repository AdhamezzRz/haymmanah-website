import { store, logActivity } from '@/portal/store'
import { hashPassword, hasAnyUser, passwordProblem, isEmail, signupOpen } from '@/portal/auth'
import { json, fail, readBody, clientIp } from '@/portal/api'
import { limitWait, limitHit, waitMessage } from '@/portal/ratelimit'

export const dynamic = 'force-dynamic'

const COLORS = ['#4C63C7', '#B0589E', '#2E9E6B', '#D98E04', '#1F8FB8', '#C47A4A', '#9085e9']

/**
 * Join request. Creates a *pending*, inactive member account; nobody can sign in
 * with it until an admin approves it (they get an alert).
 */
export async function POST(req: Request) {
  if (!signupOpen()) return fail('طلبات الانضمام مغلقة — تواصل مع مدير النظام', 403)
  if (!(await hasAnyUser())) return fail('النظام لم يُعدّ بعد', 409)
  const key = `signup:${clientIp(req)}`
  const wait = limitWait(key, 5, 60 * 60_000)
  if (wait) return fail(waitMessage(wait), 429)

  const { name, email, password, title, phone, note } = await readBody(req)
  const errors: Record<string, string> = {}
  if (typeof name !== 'string' || name.trim().length < 2) errors.name = 'أدخل اسمك الكامل'
  if (!isEmail(email)) errors.email = 'بريد إلكتروني غير صالح'
  const pwErr = passwordProblem(password, typeof email === 'string' ? email : undefined)
  if (pwErr) errors.password = pwErr
  if (Object.keys(errors).length) return fail('تحقق من الحقول', 422, { errors })

  const mail = String(email).trim().toLowerCase()
  const team = await store.list('team')
  if (team.some(u => String(u.email).toLowerCase() === mail)) {
    return fail('هذا البريد مسجّل مسبقاً أو لديه طلب قيد المراجعة — جرّب «نسيت كلمة المرور»', 409, { errors: { email: 'مسجّل مسبقاً' } })
  }
  limitHit(key, 60 * 60_000)

  const rec = await store.insert('team', {
    name: String(name).trim().slice(0, 120),
    email: mail,
    title: typeof title === 'string' ? title.trim().slice(0, 80) : '',
    phone: typeof phone === 'string' ? phone.trim().slice(0, 30) : '',
    joinNote: typeof note === 'string' ? note.trim().slice(0, 500) : '',
    role: 'member',
    active: false,
    joinStatus: 'pending',
    color: COLORS[team.length % COLORS.length],
    passwordHash: await hashPassword(String(password)),
    sessionVersion: 0,
  })
  await logActivity({ userId: rec.id, userName: String(rec.name), module: 'team', recordId: rec.id, recordTitle: String(rec.name), action: 'create', summary: 'طلب انضمام للفريق' })
  return json({ ok: true }, { status: 201 })
}
