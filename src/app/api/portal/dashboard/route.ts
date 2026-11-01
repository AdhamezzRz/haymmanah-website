import { json, requireUser } from '@/portal/api'
import { computeStats } from '@/portal/stats'

export const dynamic = 'force-dynamic'

export async function GET() {
  const auth = await requireUser()
  if ('response' in auth) return auth.response
  return json(await computeStats(auth.user))
}
