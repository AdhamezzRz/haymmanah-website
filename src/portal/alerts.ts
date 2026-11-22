/**
 * Alerts — server only.
 *
 * Alerts are *derived* from the data on every request (nothing to schedule, nothing
 * to go stale): overdue and upcoming tasks, reviews waiting, unrated work, CRM
 * follow-ups, late invoices, content due today. Each alert has a stable `key`
 * that includes the date it refers to, so dismissing "task X overdue since the
 * 3rd" stays dismissed, but a new due date raises a new alert.
 */
import { store } from './store'
import { dayKey, fmtDate } from './format'
import { DEAL_CLOSED } from './modules'
import { invoiceTotals } from './zatca'
import type { BaseRecord, LineItem } from './schema'
import type { PortalUser } from './auth'

export type AlertSeverity = 'critical' | 'warning' | 'info'

export interface Alert {
  key: string
  severity: AlertSeverity
  icon: string
  title: string
  body: string
  href: string
  /** ISO date the alert is about — used for ordering. */
  at: string
}

const SEVERITY_ORDER: Record<AlertSeverity, number> = { critical: 0, warning: 1, info: 2 }
const DAY = 86400000

function daysBetween(a: string, b: string) {
  return Math.round((new Date(a).getTime() - new Date(b).getTime()) / DAY)
}
const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(Math.max(0, 5 - n))

async function dismissedKeys(userId: string): Promise<Record<string, string>> {
  const rec = await store.get('_alertState', userId)
  const d = rec?.dismissed
  return d && typeof d === 'object' ? (d as Record<string, string>) : {}
}

export async function dismissAlerts(userId: string, keys: string[]) {
  const current = await dismissedKeys(userId)
  const stamp = new Date().toISOString()
  for (const k of keys.slice(0, 500)) current[String(k).slice(0, 200)] = stamp
  // forget dismissals older than 90 days so the record never grows without bound
  const cutoff = Date.now() - 90 * DAY
  for (const [k, v] of Object.entries(current)) if (new Date(v).getTime() < cutoff) delete current[k]
  await store.upsert('_alertState', userId, { dismissed: current })
}

export async function computeAlerts(user: PortalUser, opts: { includeDismissed?: boolean } = {}): Promise<Alert[]> {
  const staff = user.role === 'admin' || user.role === 'manager'
  const [team, tasks, deals, clients, invoices, content, dismissed] = await Promise.all([
    user.role === 'admin' ? store.list('team') : Promise.resolve([] as BaseRecord[]),
    store.list('tasks'),
    staff ? store.list('deals') : Promise.resolve([] as BaseRecord[]),
    staff ? store.list('clients') : Promise.resolve([] as BaseRecord[]),
    staff ? store.list('invoices') : Promise.resolve([] as BaseRecord[]),
    store.list('content'),
    dismissedKeys(user.id),
  ])

  const today = dayKey()
  const tomorrow = dayKey(new Date(Date.now() + DAY))
  const out: Alert[] = []
  const push = (a: Alert) => out.push(a)
  const clientName = (id: unknown) => String(clients.find(c => c.id === id)?.name ?? '')

  /* ── Join requests waiting on an admin ── */
  for (const m of team) {
    if (m.joinStatus !== 'pending') continue
    push({ key: `join-request:${m.id}`, severity: 'warning', icon: 'team', title: `طلب انضمام جديد: ${String(m.name)}`, body: `${String(m.email)}${m.title ? ` — ${String(m.title)}` : ''}. افتح الطلب لقبوله أو رفضه.`, href: `/portal/team/${m.id}`, at: String(m.createdAt) })
  }

  /* ── Tasks assigned to me ── */
  for (const t of tasks) {
    const title = String(t.title ?? 'مهمة')
    const href = `/portal/tasks/${t.id}`
    const mine = t.assignee === user.id
    const due = t.dueDate ? String(t.dueDate) : ''

    if (mine && t.status !== 'done' && due) {
      if (due < today) {
        const late = daysBetween(today, due)
        push({ key: `task-overdue:${t.id}:${due}`, severity: 'critical', icon: 'alert', title: `مهمة متأخرة: ${title}`, body: `كانت مستحقة ${fmtDate(due)} — متأخرة ${late} ${late === 1 ? 'يوم' : 'أيام'}.`, href, at: due })
      } else if (due === today) {
        push({ key: `task-today:${t.id}:${due}`, severity: 'warning', icon: 'clock', title: `تستحق اليوم: ${title}`, body: 'موعد تسليم هذه المهمة اليوم.', href, at: due })
      } else if (due === tomorrow) {
        push({ key: `task-tomorrow:${t.id}:${due}`, severity: 'info', icon: 'calendar', title: `تستحق غداً: ${title}`, body: 'تذكير مبكر — موعد التسليم غداً.', href, at: due })
      }
    }
    if (mine && t.assignedAt && t.assignedBy && t.assignedBy !== user.id && Date.now() - new Date(String(t.assignedAt)).getTime() < 3 * DAY && t.status !== 'done') {
      push({ key: `task-assigned:${t.id}:${t.assignedAt}`, severity: 'info', icon: 'tasks', title: `مهمة جديدة لك: ${title}`, body: due ? `تستحق ${fmtDate(due)}.` : 'بدون تاريخ استحقاق.', href, at: String(t.assignedAt) })
    }
    if (mine && t.ratedAt && t.ratedBy !== user.id && typeof t.rating === 'number' && Date.now() - new Date(String(t.ratedAt)).getTime() < 7 * DAY) {
      push({ key: `task-rated:${t.id}:${t.ratedAt}`, severity: 'info', icon: 'star', title: `تم تقييم مهمتك: ${title}`, body: `${stars(t.rating)} (${t.rating} من ٥)${t.ratingNote ? ` — ${String(t.ratingNote).slice(0, 90)}` : ''}`, href, at: String(t.ratedAt) })
    }

    /* ── Things waiting on a manager ── */
    if (staff && t.status === 'review') {
      push({ key: `task-review:${t.id}:${t.statusChangedAt ?? t.updatedAt}`, severity: 'warning', icon: 'tasks', title: `بانتظار مراجعتك: ${title}`, body: 'المهمة في عمود «للمراجعة» — اعتمدها أو أعدها للعمل.', href, at: String(t.statusChangedAt ?? t.updatedAt) })
    }
    if (staff && t.status === 'done' && (t.rating === null || t.rating === undefined) && t.completedAt && Date.now() - new Date(String(t.completedAt)).getTime() < 14 * DAY) {
      push({ key: `task-unrated:${t.id}:${t.completedAt}`, severity: 'info', icon: 'star', title: `قيّم المهمة: ${title}`, body: 'اكتملت ولم تُقيَّم بعد — التقييم يأخذ ثانيتين.', href, at: String(t.completedAt) })
    }
  }

  /* ── CRM follow-ups (owner, or any manager when nobody owns it) ── */
  if (staff) {
    for (const d of deals) {
      if (DEAL_CLOSED.includes(String(d.stage))) continue
      const forMe = d.owner === user.id || !d.owner
      if (!forMe) continue
      const title = String(d.title ?? 'فرصة')
      const href = `/portal/deals/${d.id}`
      const fu = d.nextFollowUp ? String(d.nextFollowUp) : ''
      if (fu && fu <= today) {
        push({ key: `deal-followup:${d.id}:${fu}`, severity: fu < today ? 'critical' : 'warning', icon: 'deals', title: `${fu < today ? 'متابعة فائتة' : 'متابعة اليوم'}: ${title}`, body: `${clientName(d.client)} — موعد المتابعة ${fmtDate(fu)}.`, href, at: fu })
      }
      const ec = d.expectedClose ? String(d.expectedClose) : ''
      if (ec && ec < today) {
        push({ key: `deal-stale:${d.id}:${ec}`, severity: 'warning', icon: 'deals', title: `فرصة تجاوزت موعد إغلاقها: ${title}`, body: `كان متوقعاً إغلاقها ${fmtDate(ec)} — حدّث التاريخ أو أغلقها.`, href, at: ec })
      }
    }
    for (const c of clients) {
      if (c.status === 'ended') continue
      const forMe = c.owner === user.id || !c.owner
      const fu = c.nextFollowUp ? String(c.nextFollowUp) : ''
      if (forMe && fu && fu <= today) {
        push({ key: `client-followup:${c.id}:${fu}`, severity: fu < today ? 'critical' : 'warning', icon: 'clients', title: `${fu < today ? 'متابعة عميل فائتة' : 'متابعة عميل اليوم'}: ${String(c.name)}`, body: `موعد المتابعة ${fmtDate(fu)}. سجّل التواصل بعد إتمامه ليتحدّث الموعد.`, href: `/portal/clients/${c.id}`, at: fu })
      }
    }
    for (const i of invoices) {
      const due = i.dueDate ? String(i.dueDate) : ''
      if ((i.status === 'sent' || i.status === 'overdue') && due && due < today) {
        const total = invoiceTotals(i.items as LineItem[], i.discount, i.vatRate).total
        push({ key: `invoice-overdue:${i.id}:${due}`, severity: 'critical', icon: 'invoices', title: `فاتورة متأخرة السداد: ${String(i.number ?? '')}`, body: `${clientName(i.client)} — ${total.toLocaleString('ar-SA-u-nu-latn')} ر.س، استحقت ${fmtDate(due)}.`, href: `/portal/invoices/${i.id}`, at: due })
      }
    }
  }

  /* ── Content going out today that isn't approved yet ── */
  for (const c of content) {
    if (!c.publishAt || dayKey(c.publishAt) !== today) continue
    if (['approved', 'scheduled', 'published'].includes(String(c.status))) continue
    if (c.assignee === user.id || staff) {
      push({ key: `content-today:${c.id}:${today}`, severity: 'warning', icon: 'content', title: `منشور اليوم غير معتمد: ${String(c.title ?? '')}`, body: 'موعد نشره اليوم وحالته لم تصل «معتمد» بعد.', href: `/portal/content/${c.id}`, at: String(c.publishAt) })
    }
  }

  const visible = opts.includeDismissed ? out : out.filter(a => !dismissed[a.key])
  return visible.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || a.at.localeCompare(b.at))
}
