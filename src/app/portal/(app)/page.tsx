import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/portal/auth'
import { computeStats } from '@/portal/stats'
import { fmtMoney, fmtDate, fmtDateTime, fmtRelative, fmtHijri, isOverdue } from '@/portal/format'
import { Icon } from '@/components/portal/Icon'
import { Chip, Avatar } from '@/components/portal/ui'
import { tasks as tasksDef, content as contentDef } from '@/portal/modules'
import { optionColor, optionLabel, fieldByKey } from '@/portal/schema'

export const dynamic = 'force-dynamic'

function greeting() {
  const h = Number(new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Riyadh', hour: 'numeric', hourCycle: 'h23' }).format(new Date()))
  return h < 12 ? 'صباح الخير' : h < 17 ? 'مساء الخير' : 'مساء النور'
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/portal/login')
  const s = await computeStats(user)
  const maxBar = Math.max(1, ...s.revenueByMonth.flatMap(m => [m.revenue, m.expenses]))
  const net = s.revenueThisMonth - s.expensesThisMonth
  const taskStatus = fieldByKey(tasksDef, 'status')
  const contentPlatform = fieldByKey(contentDef, 'platform')
  const first = user.name.split(' ')[0]

  return (
    <div>
      <div className="pt-page-head">
        <div>
          <div className="pt-eyebrow">{fmtHijri(new Date())} · {fmtDate(new Date(), 'long')}</div>
          <h1 className="pt-h1">{greeting()} يا {first} 👋</h1>
          <p className="pt-lead">
            {s.tasksOverdue > 0 ? `عندك ${s.tasksOverdue} مهمة متأخرة تستحق نظرة أولاً.` : s.tasksDueThisWeek > 0 ? `${s.tasksDueThisWeek} مهمة تستحق هذا الأسبوع — الوضع تحت السيطرة.` : 'لا شيء متأخر. يوم جميل لبناء هيمنة جديدة.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href="/portal/tasks?new=1" className="pt-btn"><Icon name="plus" /> مهمة</Link>
          <Link href="/portal/invoices?new=1" className="pt-btn pt-btn-primary"><Icon name="invoices" /> فاتورة جديدة</Link>
        </div>
      </div>

      {/* KPI row */}
      <div className="pt-grid pt-grid-4" style={{ marginBottom: '1.25rem' }}>
        <Stat label="عملاء نشطون" value={s.clientsActive} sub={`${s.clientsLeads} في مرحلة الاهتمام / العرض`} icon="clients" color="#4C63C7" href="/portal/clients" />
        <Stat label="مشاريع قيد التنفيذ" value={s.projectsActive} sub={`${s.tasksOpen} مهمة مفتوحة`} icon="projects" color="#B0589E" href="/portal/projects" />
        <Stat label="مستحقات غير محصّلة" value={fmtMoney(s.invoicesUnpaidTotal)} sub={s.invoicesOverdueCount ? `${s.invoicesOverdueCount} فاتورة متأخرة` : `${s.invoicesUnpaidCount} فاتورة مرسلة`} icon="invoices" color={s.invoicesOverdueCount ? '#C4504A' : '#D98E04'} href="/portal/invoices" />
        <Stat label="صافي هذا الشهر" value={fmtMoney(net)} sub={`إيراد ${fmtMoney(s.revenueThisMonth)} · مصروف ${fmtMoney(s.expensesThisMonth)}`} icon="money" color={net >= 0 ? '#2E9E6B' : '#C4504A'} href="/portal/expenses" />
      </div>

      <div className="pt-grid pt-grid-2" style={{ marginBottom: '1.25rem' }}>
        {/* Revenue vs expenses */}
        <section className="pt-card">
          <div className="pt-card-head">
            <h3 className="pt-card-title"><Icon name="activity" size={16} /> الإيرادات مقابل المصروفات — آخر ٦ أشهر</h3>
            <div className="pt-legend"><span><i className="pt-dot" style={{ background: 'var(--gold)' }} /> إيراد محصّل</span><span><i className="pt-dot" style={{ background: '#C4504A' }} /> مصروف</span></div>
          </div>
          <div className="pt-card-pad">
            <div className="pt-bars">
              {s.revenueByMonth.map(m => (
                <div className="pt-bar-group" key={m.key} title={`${m.label}: إيراد ${fmtMoney(m.revenue)} · مصروف ${fmtMoney(m.expenses)}`}>
                  <div className="pt-bar-pair">
                    <i className="pt-bar" style={{ height: `${(m.revenue / maxBar) * 100}%`, background: 'var(--gold-grad)' }} />
                    <i className="pt-bar" style={{ height: `${(m.expenses / maxBar) * 100}%`, background: 'rgba(196,80,74,0.75)' }} />
                  </div>
                  <span className="pt-bar-label">{m.label}</span>
                </div>
              ))}
            </div>
            {s.revenueByMonth.every(m => m.revenue === 0 && m.expenses === 0) && <p className="pt-dim" style={{ fontSize: '0.78rem', textAlign: 'center', marginTop: '0.5rem' }}>سيمتلئ الرسم تلقائياً مع أول فاتورة مدفوعة أو مصروف مسجّل.</p>}
          </div>
        </section>

        {/* Workload */}
        <section className="pt-card">
          <div className="pt-card-head"><h3 className="pt-card-title"><Icon name="team" size={16} /> حِمل الفريق</h3><Link href="/portal/team" className="pt-dim" style={{ fontSize: '0.75rem' }}>الفريق ←</Link></div>
          <div className="pt-card-pad pt-workload">
            {s.workload.length === 0 && <span className="pt-dim" style={{ fontSize: '0.8rem' }}>أضف أعضاء الفريق لتظهر أحمالهم هنا.</span>}
            {s.workload.slice(0, 8).map(w => {
              const max = Math.max(1, ...s.workload.map(x => x.open))
              return (
                <div className="pt-wl-row" key={w.userId}>
                  <Avatar name={w.name} color={w.color} size={28} />
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem' }}><span>{w.name}</span>{w.overdue > 0 && <span className="pt-overdue">{w.overdue} متأخرة</span>}</div>
                    <div className="pt-wl-bar"><i style={{ width: `${(w.open / max) * 100}%` }} /></div>
                  </div>
                  <span className="pt-num pt-muted" style={{ textAlign: 'end' }}>{w.open} مهمة</span>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      <div className="pt-grid pt-grid-3">
        {/* My tasks */}
        <section className="pt-card">
          <div className="pt-card-head"><h3 className="pt-card-title"><Icon name="tasks" size={16} /> مهامي</h3><Link href="/portal/tasks" className="pt-dim" style={{ fontSize: '0.75rem' }}>اللوحة ←</Link></div>
          <div className="pt-list">
            {s.myTasks.length === 0 && <div className="pt-empty" style={{ padding: '1.5rem' }}>لا مهام مسندة إليك حالياً ✨</div>}
            {s.myTasks.map(t => (
              <Link key={t.id} href={`/portal/tasks/${t.id}`} className="pt-list-item">
                <div className="pt-list-main">
                  <div className="pt-list-title">{String(t.title)}</div>
                  <div className="pt-list-sub">{t.project ? s.projectsById[String(t.project)] : t.client ? s.clientsById[String(t.client)] : ''}</div>
                </div>
                <span className={`pt-num ${isOverdue(t.dueDate) ? 'pt-overdue' : 'pt-dim'}`} style={{ fontSize: '0.74rem' }}>{t.dueDate ? fmtDate(t.dueDate) : ''}</span>
                <Chip label={optionLabel(taskStatus, t.status)} color={optionColor(taskStatus, t.status)} small />
              </Link>
            ))}
          </div>
        </section>

        {/* Upcoming content */}
        <section className="pt-card">
          <div className="pt-card-head"><h3 className="pt-card-title"><Icon name="content" size={16} /> محتوى هذا الأسبوع</h3><Link href="/portal/content" className="pt-dim" style={{ fontSize: '0.75rem' }}>التقويم ←</Link></div>
          <div className="pt-list">
            {s.upcomingContent.length === 0 && <div className="pt-empty" style={{ padding: '1.5rem' }}>لا منشورات مجدولة للأيام السبعة القادمة</div>}
            {s.upcomingContent.map(c => (
              <Link key={c.id} href={`/portal/content/${c.id}`} className="pt-list-item">
                <i className="pt-dot" style={{ background: optionColor(contentPlatform, c.platform) ?? 'var(--gold)', width: 9, height: 9 }} />
                <div className="pt-list-main">
                  <div className="pt-list-title">{String(c.title)}</div>
                  <div className="pt-list-sub">{s.clientsById[String(c.client)] ?? ''} · {optionLabel(contentPlatform, c.platform)}</div>
                </div>
                <span className="pt-dim pt-num" style={{ fontSize: '0.74rem' }}>{fmtDateTime(c.publishAt)}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Activity */}
        <section className="pt-card">
          <div className="pt-card-head"><h3 className="pt-card-title"><Icon name="clock" size={16} /> آخر النشاط</h3></div>
          <div className="pt-card-pad pt-timeline">
            {s.activity.length === 0 && <span className="pt-dim" style={{ fontSize: '0.8rem' }}>كل ما يفعله الفريق سيظهر هنا.</span>}
            {s.activity.map(a => (
              <div key={a.id} className="pt-tl-item">
                <i className="pt-tl-dot" style={{ background: a.action === 'create' || a.action === 'setup' ? '#2E9E6B' : a.action === 'delete' ? '#C4504A' : a.action === 'login' ? '#6B7A99' : 'var(--gold)' }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <strong>{a.userName}</strong>{' '}
                    {a.action === 'login' ? 'سجّل الدخول' : a.action === 'setup' ? 'أعدّ النظام' : a.action === 'create' ? 'أضاف' : a.action === 'delete' ? 'حذف' : 'عدّل'}{' '}
                    {a.action !== 'login' && a.action !== 'setup' && (a.action === 'delete' ? <span>{a.recordTitle}</span> : <Link href={`/portal/${a.module}/${a.recordId}`} style={{ color: 'var(--gold-bright)' }}>{a.recordTitle}</Link>)}
                  </div>
                  <div className="pt-tl-when">{fmtRelative(a.at)}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {s.overdueInvoices.length > 0 && (
        <section className="pt-card" style={{ marginTop: '1.25rem', borderColor: 'rgba(196,80,74,0.4)' }}>
          <div className="pt-card-head"><h3 className="pt-card-title" style={{ color: '#FFB4AE' }}><Icon name="alert" size={16} /> فواتير تحتاج متابعة</h3></div>
          <div className="pt-list">
            {s.overdueInvoices.map(i => (
              <Link key={i.id} href={`/portal/invoices/${i.id}`} className="pt-list-item">
                <div className="pt-list-main"><div className="pt-list-title">{String(i.number)}</div><div className="pt-list-sub">{s.clientsById[String(i.client)] ?? ''} · استحقاق {fmtDate(i.dueDate)}</div></div>
                <span className="pt-overdue pt-num" style={{ fontSize: '0.78rem' }}>{fmtRelative(i.dueDate)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function Stat({ label, value, sub, icon, color, href }: { label: string; value: string | number; sub: string; icon: string; color: string; href: string }) {
  return (
    <Link href={href} className="pt-card pt-stat">
      <i className="pt-stat-glow" style={{ background: color }} />
      <span className="pt-stat-label"><Icon name={icon} size={15} style={{ color }} /> {label}</span>
      <span className="pt-stat-value">{typeof value === 'number' ? value.toLocaleString('ar-SA-u-nu-latn') : value}</span>
      <span className="pt-stat-sub">{sub}</span>
    </Link>
  )
}
