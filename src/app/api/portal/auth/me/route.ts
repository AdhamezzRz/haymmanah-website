import { getCurrentUser } from '@/portal/auth'
import { json } from '@/portal/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  const user = await getCurrentUser()
  return json({ user })
}
