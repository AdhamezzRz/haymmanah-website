import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/portal/auth'
import { computeStats } from '@/portal/stats'
import { computeAlerts } from '@/portal/alerts'
import { fmtDate, fmtHijri } from '@/portal/format'
import { DashboardView } from '@/components/portal/DashboardView'

export const dynamic = 'force-dynamic'

function greeting() {
  const h = Number(new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Riyadh', hour: 'numeric', hourCycle: 'h23' }).format(new Date()))
  return h < 12 ? 'صباح الخير' : h < 17 ? 'مساء الخير' : 'مساء النور'
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/portal/login')
  const [stats, alerts] = await Promise.all([computeStats(user), computeAlerts(user)])
  const now = new Date()
  return <DashboardView stats={stats} alerts={alerts} user={user} greeting={greeting()} dateLine={`${fmtHijri(now)} · ${fmtDate(now, 'long')}`} />
}
