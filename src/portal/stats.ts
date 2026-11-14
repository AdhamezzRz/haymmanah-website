/**
 * Dashboard + CRM numbers — computed server-side from the store.
 * Everything here is plain data (no formatting) so the charts stay dumb.
 */
import { store, recentActivity, type Activity } from './store'
import { invoiceTotals } from './zatca'
import { dayKey } from './format'
import { DEAL_STAGES, DEAL_CLOSED, LEAD_SOURCES, dealProbability, tasks as tasksDef, expenses as expensesDef, deals as dealsDef, clients as clientsDef, PLATFORMS } from './modules'
import { fieldByKey, optionLabel, type LineItem, type BaseRecord } from './schema'
import type { PortalUser } from './auth'

export interface Slice { key: string; label: string; value: number }
export interface MemberScore {
  userId: string; name: string; color?: string
  open: number; overdue: number; done: number
  rated: number; avgRating: number | null
  onTimeRate: number | null
}
export interface FollowUp { module: 'deals' | 'clients'; id: string; title: string; sub: string; date: string; overdue: boolean }

export interface TaskStats {
  open: number
  overdue: number
  dueThisWeek: number
  byStatus: Slice[]
  completedWeekly: { key: string; label: string; value: number }[]
  onTime: { onTime: number; late: number; rate: number | null }
  avgRating: number | null
  ratedCount: number
  unratedDone: BaseRecord[]
  ratingDist: Slice[]
  members: MemberScore[]
  myAvgRating: number | null
  myOpen: number
}

export interface CrmStats {
  pipelineValue: number
  pipelineCount: number
  forecast: number
  wonCount: number
  lostCount: number
  wonValue: number
  wonThisMonth: number
  winRate: number | null
  avgDeal: number | null
  funnel: { key: string; label: string; count: number; value: number }[]
  bySource: Slice[]
  lostReasons: Slice[]
  followUps: FollowUp[]
  staleClients: { id: string; name: string; days: number | null }[]
  clientsByStatus: Slice[]
}

export interface FinanceStats {
  unpaidTotal: number
  unpaidCount: number
  overdueCount: number
  revenueThisMonth: number
  expensesThisMonth: number
  byMonth: { key: string; label: string; revenue: number; expenses: number }[]
  expensesByCategory: Slice[]
  topClients: Slice[]
  overdueInvoices: BaseRecord[]
}

export interface DashboardStats {
  isStaff: boolean
  isEmpty: boolean
  clientsActive: number
  clientsLeads: number
  projectsActive: number
  contentThisWeek: number
  contentByPlatform: Slice[]
  tasks: TaskStats
  crm: CrmStats | null
  finance: FinanceStats | null
  myTasks: BaseRecord[]
  upcomingContent: BaseRecord[]
  activity: Activity[]
  clientsById: Record<string, string>
  projectsById: Record<string, string>
}

const MONTHS_SHORT = ['ينا', 'فبر', 'مار', 'أبر', 'ماي', 'يون', 'يول', 'أغس', 'سبت', 'أكت', 'نوف', 'ديس']
const DAY = 86400000
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : Number(v) || 0)
const avg = (xs: number[]) => (xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10 : null)

/** Fold a long tail into "أخرى" so part-to-whole charts never exceed `max` slices. */
function topSlices(slices: Slice[], max = 6): Slice[] {
  const sorted = slices.filter(s => s.value > 0).sort((a, b) => b.value - a.value)
  if (sorted.length <= max) return sorted
  const head = sorted.slice(0, max - 1)
  const rest = sorted.slice(max - 1).reduce((s, x) => s + x.value, 0)
  return [...head, { key: '_other', label: 'أخرى', value: rest }]
}

export async function computeStats(user: PortalUser): Promise<DashboardStats> {
  const isStaff = user.role === 'admin' || user.role === 'manager'
  const [clients, projects, tasks, content, invoices, expenses, team, deals, activity] = await Promise.all([
    store.list('clients'), store.list('projects'), store.list('tasks'), store.list('content'),
    store.list('invoices'), store.list('expenses'), store.list('team'), store.list('deals'), recentActivity(10),
  ])

  const today = dayKey()
  const in7 = dayKey(new Date(Date.now() + 7 * DAY))
  const monthKey = today.slice(0, 7)

  /* ── Tasks ─────────────────────────────────────────────────────── */
  const statusField = fieldByKey(tasksDef, 'status')
  const openTasks = tasks.filter(t => t.status !== 'done')
  const doneTasks = tasks.filter(t => t.status === 'done')
  const isLate = (t: BaseRecord) => !!t.dueDate && String(t.dueDate) < today
  const finishedDay = (t: BaseRecord) => dayKey(t.completedAt || t.updatedAt)
  const wasOnTime = (t: BaseRecord) => finishedDay(t) <= String(t.dueDate)

  const doneWithDue = doneTasks.filter(t => t.dueDate)
  const onTimeCount = doneWithDue.filter(wasOnTime).length

  // last 8 weeks (weeks start Sunday, as in Saudi Arabia), oldest → newest
  const weekStart = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - x.getDay()); return x }
  const thisWeek = weekStart(new Date())
  const completedWeekly: TaskStats['completedWeekly'] = []
  for (let k = 7; k >= 0; k--) {
    const start = new Date(thisWeek.getTime() - k * 7 * DAY)
    const end = new Date(start.getTime() + 7 * DAY)
    const value = doneTasks.filter(t => { const at = new Date(String(t.completedAt || t.updatedAt)).getTime(); return at >= start.getTime() && at < end.getTime() }).length
    completedWeekly.push({ key: dayKey(start), label: k === 0 ? 'هذا الأسبوع' : `${start.getDate()} ${MONTHS_SHORT[start.getMonth()]}`, value })
  }

  const rated = doneTasks.filter(t => typeof t.rating === 'number')
  const members: MemberScore[] = team.filter(u => u.active !== false).map(u => {
    const mine = tasks.filter(t => t.assignee === u.id)
    const mineOpen = mine.filter(t => t.status !== 'done')
    const mineDone = mine.filter(t => t.status === 'done')
    const mineRated = mineDone.filter(t => typeof t.rating === 'number')
    const withDue = mineDone.filter(t => t.dueDate)
    return {
      userId: u.id, name: String(u.name), color: u.color ? String(u.color) : undefined,
      open: mineOpen.length, overdue: mineOpen.filter(isLate).length, done: mineDone.length,
      rated: mineRated.length, avgRating: avg(mineRated.map(t => num(t.rating))),
      onTimeRate: withDue.length ? Math.round((withDue.filter(wasOnTime).length / withDue.length) * 100) : null,
    }
  }).sort((a, b) => (b.avgRating ?? -1) - (a.avgRating ?? -1) || b.done - a.done)

  const me = members.find(m => m.userId === user.id)
  const byDue = (a: BaseRecord, b: BaseRecord) => String(a.dueDate || '9').localeCompare(String(b.dueDate || '9'))

  const taskStats: TaskStats = {
    open: openTasks.length,
    overdue: openTasks.filter(isLate).length,
    dueThisWeek: openTasks.filter(t => t.dueDate && String(t.dueDate) >= today && String(t.dueDate) <= in7).length,
    byStatus: (statusField?.options ?? []).map(o => ({ key: o.value, label: o.label, value: tasks.filter(t => t.status === o.value).length })),
    completedWeekly,
    onTime: { onTime: onTimeCount, late: doneWithDue.length - onTimeCount, rate: doneWithDue.length ? Math.round((onTimeCount / doneWithDue.length) * 100) : null },
    avgRating: avg(rated.map(t => num(t.rating))),
    ratedCount: rated.length,
    unratedDone: isStaff ? doneTasks.filter(t => typeof t.rating !== 'number').sort((a, b) => String(b.completedAt || b.updatedAt).localeCompare(String(a.completedAt || a.updatedAt))).slice(0, 6) : [],
    ratingDist: [5, 4, 3, 2, 1].map(n => ({ key: String(n), label: `${n} ${n === 1 ? 'نجمة' : 'نجوم'}`, value: rated.filter(t => t.rating === n).length })),
    members,
    myAvgRating: me?.avgRating ?? null,
    myOpen: me?.open ?? openTasks.filter(t => t.assignee === user.id).length,
  }

  /* ── Content ───────────────────────────────────────────────────── */
  const contentThisWeek = content.filter(c => { const k = c.publishAt ? dayKey(c.publishAt) : ''; return k >= today && k <= in7 })
  const contentThisMonth = content.filter(c => c.publishAt && dayKey(c.publishAt).slice(0, 7) === monthKey)
  const contentByPlatform = topSlices(PLATFORMS.map(p => ({ key: p.value, label: p.label, value: contentThisMonth.filter(c => c.platform === p.value).length })))

  /* ── CRM (staff only) ──────────────────────────────────────────── */
  let crm: CrmStats | null = null
  if (isStaff) {
    const open = deals.filter(d => !DEAL_CLOSED.includes(String(d.stage)))
    const won = deals.filter(d => d.stage === 'won')
    const lost = deals.filter(d => d.stage === 'lost')
    const clientById = new Map(clients.map(c => [c.id, c]))
    const sourceOf = (d: BaseRecord) => String(d.source || clientById.get(String(d.client))?.source || 'other')
    const lostField = fieldByKey(dealsDef, 'lostReason')

    const followUps: FollowUp[] = []
    const soon = dayKey(new Date(Date.now() + 3 * DAY))
    for (const d of open) {
      const fu = d.nextFollowUp ? String(d.nextFollowUp) : ''
      if (fu && fu <= soon) followUps.push({ module: 'deals', id: d.id, title: String(d.title), sub: String(clientById.get(String(d.client))?.name ?? ''), date: fu, overdue: fu < today })
    }
    for (const c of clients) {
      const fu = c.nextFollowUp ? String(c.nextFollowUp) : ''
      if (c.status !== 'ended' && fu && fu <= soon) followUps.push({ module: 'clients', id: c.id, title: String(c.name), sub: 'متابعة عميل', date: fu, overdue: fu < today })
    }
    followUps.sort((a, b) => a.date.localeCompare(b.date))

    const staleClients = clients.filter(c => c.status === 'active').map(c => {
      const last = c.lastContactAt ? String(c.lastContactAt) : ''
      return { id: c.id, name: String(c.name), days: last ? Math.floor((Date.now() - new Date(last).getTime()) / DAY) : null }
    }).filter(c => c.days === null || c.days >= 30).sort((a, b) => (b.days ?? 9999) - (a.days ?? 9999)).slice(0, 6)

    const clientStatus = fieldByKey(clientsDef, 'status')
    crm = {
      pipelineValue: open.reduce((s, d) => s + num(d.value), 0),
      pipelineCount: open.length,
      forecast: Math.round(open.reduce((s, d) => s + num(d.value) * dealProbability(d) / 100, 0)),
      wonCount: won.length,
      lostCount: lost.length,
      wonValue: won.reduce((s, d) => s + num(d.value), 0),
      wonThisMonth: won.filter(d => String(d.closedAt || '').slice(0, 7) === monthKey).reduce((s, d) => s + num(d.value), 0),
      winRate: won.length + lost.length ? Math.round((won.length / (won.length + lost.length)) * 100) : null,
      avgDeal: won.length ? Math.round(won.reduce((s, d) => s + num(d.value), 0) / won.length) : null,
      funnel: DEAL_STAGES.filter(s => s.value !== 'lost').map(s => {
        const inStage = deals.filter(d => d.stage === s.value)
        return { key: s.value, label: s.label, count: inStage.length, value: inStage.reduce((x, d) => x + num(d.value), 0) }
      }),
      bySource: topSlices(LEAD_SOURCES.map(s => ({ key: s.value, label: s.label, value: deals.filter(d => sourceOf(d) === s.value).length }))),
      lostReasons: topSlices((lostField?.options ?? []).map(o => ({ key: o.value, label: o.label, value: lost.filter(d => d.lostReason === o.value).length }))),
      followUps: followUps.slice(0, 10),
      staleClients,
      clientsByStatus: (clientStatus?.options ?? []).map(o => ({ key: o.value, label: o.label, value: clients.filter(c => c.status === o.value).length })).filter(s => s.value > 0),
    }
  }

  /* ── Finance (staff only) ──────────────────────────────────────── */
  let finance: FinanceStats | null = null
  if (isStaff) {
    const totals = (i: BaseRecord) => invoiceTotals(i.items as LineItem[], i.discount, i.vatRate)
    const paidMonth = (i: BaseRecord) => String(i.paidAt || i.issueDate || '').slice(0, 7)
    const unpaid = invoices.filter(i => i.status === 'sent' || i.status === 'overdue')
    const overdueInvoices = unpaid.filter(i => i.status === 'overdue' || (i.dueDate && String(i.dueDate) < today))
    const paid = invoices.filter(i => i.status === 'paid')

    const byMonth: FinanceStats['byMonth'] = []
    const now = new Date()
    for (let k = 5; k >= 0; k--) {
      const d = new Date(now.getFullYear(), now.getMonth() - k, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      byMonth.push({
        key, label: MONTHS_SHORT[d.getMonth()],
        revenue: paid.filter(i => paidMonth(i) === key).reduce((s, i) => s + totals(i).total, 0),
        expenses: expenses.filter(e => String(e.date || '').slice(0, 7) === key).reduce((s, e) => s + num(e.amount), 0),
      })
    }
    const catField = fieldByKey(expensesDef, 'category')
    const sixMonthsAgo = byMonth[0]?.key ?? monthKey
    const recentExpenses = expenses.filter(e => String(e.date || '').slice(0, 7) >= sixMonthsAgo)
    const revenueByClient = new Map<string, number>()
    for (const i of paid) revenueByClient.set(String(i.client), (revenueByClient.get(String(i.client)) ?? 0) + totals(i).total)

    finance = {
      unpaidTotal: unpaid.reduce((s, i) => s + totals(i).total, 0),
      unpaidCount: unpaid.length,
      overdueCount: overdueInvoices.length,
      revenueThisMonth: paid.filter(i => paidMonth(i) === monthKey).reduce((s, i) => s + totals(i).total, 0),
      expensesThisMonth: expenses.filter(e => String(e.date || '').slice(0, 7) === monthKey).reduce((s, e) => s + num(e.amount), 0),
      byMonth,
      expensesByCategory: topSlices((catField?.options ?? []).map(o => ({ key: o.value, label: optionLabel(catField, o.value), value: recentExpenses.filter(e => e.category === o.value).reduce((s, e) => s + num(e.amount), 0) }))),
      topClients: [...revenueByClient.entries()].map(([id, value]) => ({ key: id, label: String(clients.find(c => c.id === id)?.name ?? '—'), value })).sort((a, b) => b.value - a.value).slice(0, 5),
      overdueInvoices: overdueInvoices.slice(0, 6),
    }
  }

  return {
    isStaff,
    isEmpty: clients.length === 0 && tasks.length === 0 && deals.length === 0 && projects.length === 0,
    clientsActive: clients.filter(c => c.status === 'active').length,
    clientsLeads: clients.filter(c => c.status === 'lead' || c.status === 'proposal').length,
    projectsActive: projects.filter(p => p.status === 'active' || p.status === 'review').length,
    contentThisWeek: contentThisWeek.length,
    contentByPlatform,
    tasks: taskStats,
    crm,
    finance,
    myTasks: openTasks.filter(t => t.assignee === user.id).sort(byDue).slice(0, 6),
    upcomingContent: contentThisWeek.sort((a, b) => String(a.publishAt).localeCompare(String(b.publishAt))).slice(0, 6),
    activity,
    clientsById: Object.fromEntries(clients.map(c => [c.id, String(c.name)])),
    projectsById: Object.fromEntries(projects.map(p => [p.id, String(p.title)])),
  }
}
