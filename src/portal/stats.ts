/**
 * Dashboard numbers — computed server-side from the store.
 */
import { store, recentActivity, type Activity } from './store'
import { invoiceTotals } from './zatca'
import { dayKey } from './format'
import type { LineItem, BaseRecord } from './schema'
import type { PortalUser } from './auth'

export interface DashboardStats {
  clientsActive: number
  clientsLeads: number
  projectsActive: number
  tasksOpen: number
  tasksOverdue: number
  tasksDueThisWeek: number
  invoicesUnpaidTotal: number
  invoicesUnpaidCount: number
  invoicesOverdueCount: number
  revenueThisMonth: number
  expensesThisMonth: number
  contentThisWeek: number
  revenueByMonth: { key: string; label: string; revenue: number; expenses: number }[]
  myTasks: BaseRecord[]
  upcomingContent: BaseRecord[]
  overdueInvoices: BaseRecord[]
  workload: { userId: string; name: string; color?: string; open: number; overdue: number }[]
  activity: Activity[]
  clientsById: Record<string, string>
  projectsById: Record<string, string>
}

const ARABIC_MONTHS_SHORT = ['ينا', 'فبر', 'مار', 'أبر', 'ماي', 'يون', 'يول', 'أغس', 'سبت', 'أكت', 'نوف', 'ديس']

export async function computeStats(user: PortalUser): Promise<DashboardStats> {
  const [clients, projects, tasks, content, invoices, expenses, team, activity] = await Promise.all([
    store.list('clients'), store.list('projects'), store.list('tasks'), store.list('content'),
    store.list('invoices'), store.list('expenses'), store.list('team'), recentActivity(12),
  ])

  const today = dayKey()
  const in7 = dayKey(new Date(Date.now() + 7 * 86400000))
  const monthKey = today.slice(0, 7)

  const openTasks = tasks.filter(t => t.status !== 'done')
  const overdue = openTasks.filter(t => t.dueDate && String(t.dueDate) < today)

  const unpaid = invoices.filter(i => i.status === 'sent' || i.status === 'overdue')
  const totals = (i: BaseRecord) => invoiceTotals(i.items as LineItem[], i.discount, i.vatRate)
  const unpaidTotal = unpaid.reduce((s, i) => s + totals(i).total, 0)
  const overdueInvoices = unpaid.filter(i => i.status === 'overdue' || (i.dueDate && String(i.dueDate) < today))

  const paidThisMonth = invoices.filter(i => i.status === 'paid' && String(i.paidAt || i.issueDate || '').slice(0, 7) === monthKey)
  const revenueThisMonth = paidThisMonth.reduce((s, i) => s + totals(i).total, 0)
  const expensesThisMonth = expenses.filter(e => String(e.date || '').slice(0, 7) === monthKey).reduce((s, e) => s + (Number(e.amount) || 0), 0)

  // last 6 months, oldest → newest
  const revenueByMonth: DashboardStats['revenueByMonth'] = []
  const now = new Date()
  for (let k = 5; k >= 0; k--) {
    const d = new Date(now.getFullYear(), now.getMonth() - k, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const revenue = invoices.filter(i => i.status === 'paid' && String(i.paidAt || i.issueDate || '').slice(0, 7) === key).reduce((s, i) => s + totals(i).total, 0)
    const exp = expenses.filter(e => String(e.date || '').slice(0, 7) === key).reduce((s, e) => s + (Number(e.amount) || 0), 0)
    revenueByMonth.push({ key, label: ARABIC_MONTHS_SHORT[d.getMonth()], revenue, expenses: exp })
  }

  const contentThisWeek = content.filter(c => {
    const k = c.publishAt ? dayKey(c.publishAt) : ''
    return k >= today && k <= in7
  })

  const workload = team.filter(u => u.active !== false).map(u => {
    const mine = openTasks.filter(t => t.assignee === u.id)
    return { userId: u.id, name: String(u.name), color: u.color ? String(u.color) : undefined, open: mine.length, overdue: mine.filter(t => t.dueDate && String(t.dueDate) < today).length }
  }).sort((a, b) => b.open - a.open)

  const byDue = (a: BaseRecord, b: BaseRecord) => String(a.dueDate ?? '9') .localeCompare(String(b.dueDate ?? '9'))

  return {
    clientsActive: clients.filter(c => c.status === 'active').length,
    clientsLeads: clients.filter(c => c.status === 'lead' || c.status === 'proposal').length,
    projectsActive: projects.filter(p => p.status === 'active' || p.status === 'review').length,
    tasksOpen: openTasks.length,
    tasksOverdue: overdue.length,
    tasksDueThisWeek: openTasks.filter(t => t.dueDate && String(t.dueDate) >= today && String(t.dueDate) <= in7).length,
    invoicesUnpaidTotal: unpaidTotal,
    invoicesUnpaidCount: unpaid.length,
    invoicesOverdueCount: overdueInvoices.length,
    revenueThisMonth,
    expensesThisMonth,
    contentThisWeek: contentThisWeek.length,
    revenueByMonth,
    myTasks: openTasks.filter(t => t.assignee === user.id).sort(byDue).slice(0, 8),
    upcomingContent: contentThisWeek.sort((a, b) => String(a.publishAt).localeCompare(String(b.publishAt))).slice(0, 8),
    overdueInvoices: overdueInvoices.slice(0, 6),
    workload,
    activity,
    clientsById: Object.fromEntries(clients.map(c => [c.id, String(c.name)])),
    projectsById: Object.fromEntries(projects.map(p => [p.id, String(p.title)])),
  }
}
