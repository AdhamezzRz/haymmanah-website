import { json } from '@/portal/api'
import { SESSION_COOKIE, sessionCookieOptions } from '@/portal/auth'

export const dynamic = 'force-dynamic'

export async function POST() {
  const res = json({ ok: true })
  res.cookies.set(SESSION_COOKIE, '', sessionCookieOptions(0))
  return res
}
