import { recentActivity } from '@/portal/store'
import { json, requireUser } from '@/portal/api'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const auth = await requireUser()
  if ('response' in auth) return auth.response
  const url = new URL(req.url)
  const limit = Math.min(Number(url.searchParams.get('limit')) || 30, 200)
  const module = url.searchParams.get('module')
  const recordId = url.searchParams.get('recordId')
  let rows = await recentActivity(500)
  if (module) rows = rows.filter(a => a.module === module)
  if (recordId) rows = rows.filter(a => a.recordId === recordId)
  return json({ activity: rows.slice(0, limit) })
}
