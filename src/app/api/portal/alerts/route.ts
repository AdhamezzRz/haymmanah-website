import { computeAlerts, dismissAlerts } from '@/portal/alerts'
import { json, fail, requireUser, readBody } from '@/portal/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  const auth = await requireUser()
  if ('response' in auth) return auth.response
  const alerts = await computeAlerts(auth.user)
  return json({ alerts, count: alerts.length })
}

/** Dismiss alerts: { keys: string[] } or { all: true }. */
export async function POST(req: Request) {
  const auth = await requireUser()
  if ('response' in auth) return auth.response
  const body = await readBody(req)
  let keys: string[] = []
  if (body.all === true) keys = (await computeAlerts(auth.user)).map(a => a.key)
  else if (Array.isArray(body.keys)) keys = body.keys.map(String)
  else return fail('حدّد التنبيهات المراد تجاهلها')
  await dismissAlerts(auth.user.id, keys)
  const alerts = await computeAlerts(auth.user)
  return json({ alerts, count: alerts.length })
}
