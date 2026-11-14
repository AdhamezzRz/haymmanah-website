'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Icon } from './Icon'
import { Avatar, Chip, Spinner, useToast, RelTime } from './ui'
import { GuideContext, ChartCard, StatTile, Donut, BarList, Columns, Trend, Meter, Stars } from './charts'
import { CrmInsights } from './CrmInsights'
import { api } from './data'
import { fmtMoney, fmtDate, fmtDateTime, fmtNumber, isOverdue } from '@/portal/format'
import { tasks as tasksDef, content as contentDef } from '@/portal/modules'
import { fieldByKey, optionColor, optionLabel } from '@/portal/schema'
import type { DashboardStats } from '@/portal/stats'
import type { Alert } from '@/portal/alerts'
import type { PortalUser } from '@/portal/auth'

type Tab = 'overview' | 'crm' | 'team' | 'finance'

export function DashboardView({ stats, alerts, user, greeting, dateLine }: {
  stats: DashboardStats
  alerts: Alert[]
  user: PortalUser
  greeting: string
  dateLine: string
}) {
  const router = useRouter()
  const toast = useToast()
  const [tab, setTab] = useState<Tab>('overview')
  const [guide, setGuide] = useState(true)
  const [seeding, setSeeding] = useState(false)

  useEffect(() => {
    try {
      const g = localStorage.getItem('hm-guide'); if (g !== null) setGuide(g === '1')
    } catch { /* private mode */ }
  }, [])

  // The dashboard always opens on the overview — predictable beats clever here.
  const pickTab = (t: Tab) => setTab(t)
  const toggleGuide = () => setGuide(g => { try { localStorage.setItem('hm-guide', g ? '0' : '1') } catch { /* ignore */ } return !g })

  const loadDemo = async () => {
    setSeeding(true)
    try {
      const r = await api<{ count: number }>('/demo', { method: 'POST' })
      toast(`تم تحميل ${r.count} سجلاً تجريبياً — استكشف براحتك`, 'success')
      router.refresh()
    } catch (e) { toast((e as Error).message, 'error') } finally { setSeeding(false) }
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'نظرة عامة', icon: 'dashboard' },
    ...(stats.crm ? [{ id: 'crm' as Tab, label: 'المبيعات', icon: 'deals' }] : []),
    { id: 'team', label: 'المهام والفريق', icon: 'tasks' },
    ...(stats.finance ? [{ id: 'finance' as Tab, label: 'المالية', icon: 'money' }] : []),
  ]
  const first = user.name.split(' ')[0]
  const critical = alerts.filter(a => a.severity === 'critical').length

  return (
    <GuideContext.Provider value={guide}>
      <div className="pt-page-head">
        <div>
          <div className="pt-eyebrow">{dateLine}</div>
          <h1 className="pt-h1">{greeting} يا {first} 👋</h1>
          <p className="pt-lead">
            {critical > 0 ? `عندك ${fmtNumber(critical)} ${critical === 1 ? 'أمر عاجل' : 'أمور عاجلة'} — ابدأ بها من «يحتاج انتباهك» تحت.`
              : alerts.length > 0 ? `${fmtNumber(alerts.length)} تذكير بسيط اليوم، ولا شيء عاجل.`
              : 'كل شيء تحت السيطرة. يوم جميل لبناء هيمنة جديدة.'}
          </p>
        </div>
        <label className="pt-guide-toggle pt-switch" title="يُظهر تحت كل رقم ورسم شرحاً مبسطاً ومثالاً">
          <input type="checkbox" checked={guide} onChange={toggleGuide} />
          <span>وضع الشرح {guide ? 'مفعّل' : 'متوقف'}</span>
        </label>
      </div>

      {stats.isEmpty && user.role === 'admin' && (
        <div className="pt-banner" style={{ background: 'rgba(57,135,229,0.1)', borderColor: 'rgba(57,135,229,0.4)', alignItems: 'center' }}>
          <Icon name="sparkles" style={{ color: 'var(--viz-1)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <strong>النظام فارغ — تبي تشوف شكله وهو شغّال؟</strong> حمّل بيانات تجريبية (عملاء وفرص ومهام وهمية معلّمة بكلمة «تجريبي») لتجرّب كل الرسوم والتنبيهات. تحذفها بضغطة من الإعدادات.
          </div>
          <button type="button" className="pt-btn pt-btn-primary" onClick={loadDemo} disabled={seeding}>{seeding ? <Spinner /> : <Icon name="sparkles" />} حمّل بيانات تجريبية</button>
        </div>
      )}

      <div className="pt-tabs" role="tablist" aria-label="أقسام لوحة التحكم">
        {tabs.map(x => (
          <button key={x.id} type="button" role="tab" className="pt-tab" aria-selected={tab === x.id} onClick={() => pickTab(x.id)}>
            <Icon name={x.icon} size={16} /> {x.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && <Overview stats={stats} alerts={alerts} />}
      {tab === 'crm' && stats.crm && (
        <>
          <CrmInsights crm={stats.crm} />
          <p style={{ marginTop: '1rem' }}><Link href="/portal/crm" className="pt-btn"><Icon name="chart" /> افتح صفحة المبيعات الكاملة</Link></p>
        </>
      )}
      {tab === 'team' && <TeamTab stats={stats} />}
      {tab === 'finance' && stats.finance && <FinanceTab stats={stats} />}

    </GuideContext.Provider>
  )
}

/* ── Overview ──────────────────────────────────────────────────────── */
function Overview({ stats, alerts }: { stats: DashboardStats; alerts: Alert[] }) {
  const t = stats.tasks
  const taskStatus = fieldByKey(tasksDef, 'status')
  const platform = fieldByKey(contentDef, 'platform')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Needs attention */}
      <section>
        <h2 className="pt-card-title" style={{ marginBottom: '0.75rem' }}><Icon name="bell" size={16} /> يحتاج انتباهك الآن</h2>
        {alerts.length === 0 ? (
          <div className="pt-card pt-card-pad pt-muted" style={{ fontSize: '0.875rem' }}>✅ لا شيء عاجل. التنبيهات تظهر هنا تلقائياً عند تأخر مهمة، حلول موعد متابعة عميل، أو تأخر سداد فاتورة.</div>
        ) : (
          <div className="pt-attention">
            {alerts.slice(0, 6).map(a => (
              <Link key={a.key} href={a.href} className="pt-alert" data-sev={a.severity}>
                <span className="pt-alert-ico"><Icon name={a.icon} size={16} /></span>
                <span><span className="pt-alert-title">{a.title}</span><span className="pt-alert-body">{a.body}</span></span>
                <Icon name="chevronLeft" size={14} style={{ opacity: 0.5, marginTop: 8 }} />
              </Link>
            ))}
          </div>
        )}
        {alerts.length > 6 && <p className="pt-dim" style={{ fontSize: '0.76rem', marginTop: '0.5rem' }}>+ {fmtNumber(alerts.length - 6)} تنبيهات أخرى في الجرس أعلى الصفحة.</p>}
      </section>

      <div className="pt-grid pt-grid-4">
        <StatTile label="مهامي المفتوحة" icon="tasks" href="/portal/tasks" value={fmtNumber(t.myOpen)}
          sub={t.overdue > 0 ? `${fmtNumber(t.overdue)} متأخرة في الفريق كله` : `${fmtNumber(t.dueThisWeek)} تستحق هذا الأسبوع`} tone={t.overdue > 0 ? 'bad' : 'default'}
          explain="المهام المسندة لك ولم تكتمل بعد. اضغط لفتح لوحة المهام." />
        <StatTile label="عملاء نشطون" icon="clients" href="/portal/clients" value={fmtNumber(stats.clientsActive)}
          sub={`${fmtNumber(stats.clientsLeads)} محتمل / عرض سعر`}
          explain="العملاء الذين نعمل معهم الآن. «المحتمل» من لم يوقّع بعد." />
        {stats.crm ? (
          <StatTile label="الإيراد المتوقّع من الفرص" icon="deals" href="/portal/deals" value={fmtMoney(stats.crm.forecast)}
            sub={`من ${fmtNumber(stats.crm.pipelineCount)} فرصة مفتوحة`}
            explain="قيمة كل فرصة × احتمال فوزها. التفاصيل في تبويب «المبيعات»." />
        ) : (
          <StatTile label="منشورات هذا الأسبوع" icon="content" href="/portal/content" value={fmtNumber(stats.contentThisWeek)} sub="في تقويم المحتوى"
            explain="عدد المنشورات المجدولة خلال ٧ أيام قادمة." />
        )}
        {stats.finance ? (
          <StatTile label="مستحقات لم تُحصَّل" icon="invoices" href="/portal/invoices" value={fmtMoney(stats.finance.unpaidTotal)}
            sub={stats.finance.overdueCount ? `${fmtNumber(stats.finance.overdueCount)} فاتورة متأخرة` : `${fmtNumber(stats.finance.unpaidCount)} فاتورة مرسلة`} tone={stats.finance.overdueCount ? 'bad' : 'default'}
            explain="فواتير أُرسلت للعملاء ولم تُدفع بعد." />
        ) : (
          <div className="pt-card pt-stat pt-tile">
            <span className="pt-stat-label"><Icon name="star" size={15} /> متوسط تقييمي</span>
            <span className="pt-tile-value">{t.myAvgRating === null ? '—' : fmtNumber(t.myAvgRating)}</span>
            <Stars value={t.myAvgRating} />
          </div>
        )}
      </div>

      <div className="pt-grid pt-grid-2">
        <ChartCard
          title="المهام المنجزة كل أسبوع" icon="activity"
          explain={{
            what: 'كل نقطة = عدد المهام التي اكتملت في ذلك الأسبوع (آخر ٨ أسابيع). الخط الصاعد = الفريق ينجز أكثر.',
            example: 'هذا الأسبوع ٦ مهام والأسبوع الماضي ٣ ⟵ الإنتاجية تضاعفت.',
          }}
          table={{ head: ['الأسبوع', 'مهام مكتملة'], rows: t.completedWeekly.map(w => [w.label, fmtNumber(w.value)]) }}
        >
          <Trend points={t.completedWeekly} unit="مهمة" />
        </ChartCard>

        <ChartCard
          title="أين تقف المهام الآن؟" icon="tasks"
          explain={{
            what: 'كل المهام مقسّمة حسب حالتها. قطعة «للمراجعة» الكبيرة تعني أن العمل متوقف بانتظار اعتماد المشرف.',
            example: '٣ قيد الانتظار · ١ جارٍ العمل · ٢ للمراجعة · ١٢ مكتملة.',
          }}
          table={{ head: ['الحالة', 'عدد المهام'], rows: t.byStatus.map(s => [s.label, fmtNumber(s.value)]) }}
        >
          <Donut data={t.byStatus} centerLabel="مهمة" />
        </ChartCard>
      </div>

      <div className="pt-grid pt-grid-half">
        <section className="pt-card">
          <div className="pt-card-head"><h3 className="pt-card-title"><Icon name="tasks" size={16} /> مهامي القادمة</h3><Link href="/portal/tasks" className="pt-btn pt-btn-ghost pt-btn-sm">اللوحة ←</Link></div>
          <div className="pt-list">
            {stats.myTasks.length === 0 && <div className="pt-empty" style={{ padding: '1.5rem' }}>لا مهام مسندة إليك حالياً ✨</div>}
            {stats.myTasks.map(x => (
              <Link key={x.id} href={`/portal/tasks/${x.id}`} className="pt-list-item">
                <div className="pt-list-main">
                  <div className="pt-list-title">{String(x.title)}</div>
                  <div className="pt-list-sub">{x.project ? stats.projectsById[String(x.project)] : x.client ? stats.clientsById[String(x.client)] : ''}</div>
                </div>
                <span className={`pt-num ${isOverdue(x.dueDate) ? 'pt-overdue' : 'pt-dim'}`} style={{ fontSize: '0.74rem' }}>{x.dueDate ? fmtDate(x.dueDate) : ''}</span>
                <Chip label={optionLabel(taskStatus, x.status)} color={optionColor(taskStatus, x.status)} small />
              </Link>
            ))}
          </div>
        </section>

        <section className="pt-card">
          <div className="pt-card-head"><h3 className="pt-card-title"><Icon name="content" size={16} /> محتوى هذا الأسبوع</h3><Link href="/portal/content" className="pt-btn pt-btn-ghost pt-btn-sm">التقويم ←</Link></div>
          <div className="pt-list">
            {stats.upcomingContent.length === 0 && <div className="pt-empty" style={{ padding: '1.5rem' }}>لا منشورات مجدولة للأيام السبعة القادمة</div>}
            {stats.upcomingContent.map(c => (
              <Link key={c.id} href={`/portal/content/${c.id}`} className="pt-list-item">
                <div className="pt-list-main">
                  <div className="pt-list-title">{String(c.title)}</div>
                  <div className="pt-list-sub">{stats.clientsById[String(c.client)] ?? ''} · {optionLabel(platform, c.platform)}</div>
                </div>
                <span className="pt-dim pt-num" style={{ fontSize: '0.74rem' }}>{fmtDateTime(c.publishAt)}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="pt-card">
        <div className="pt-card-head"><h3 className="pt-card-title"><Icon name="clock" size={16} /> آخر ما حدث في النظام</h3></div>
        <div className="pt-card-pad pt-timeline">
          {stats.activity.length === 0 && <span className="pt-dim" style={{ fontSize: '0.8rem' }}>كل ما يفعله الفريق سيظهر هنا.</span>}
          {stats.activity.map(a => (
            <div key={a.id} className="pt-tl-item">
              <i className="pt-tl-dot" style={{ background: a.action === 'create' || a.action === 'setup' ? 'var(--viz-3)' : a.action === 'delete' ? 'var(--viz-8)' : a.action === 'login' ? 'var(--viz-other)' : 'var(--viz-1)' }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <strong>{a.userName}</strong>{' '}
                  {a.action === 'login' ? 'سجّل الدخول' : a.action === 'setup' ? 'أعدّ النظام' : a.action === 'create' ? 'أضاف' : a.action === 'delete' ? 'حذف' : 'عدّل'}{' '}
                  {a.action !== 'login' && a.action !== 'setup' && (a.action === 'delete' || a.module === 'settings' ? <span>{a.recordTitle}</span> : <Link href={`/portal/${a.module}/${a.recordId}`} style={{ color: 'var(--gold-bright)' }}>{a.recordTitle}</Link>)}
                </div>
                <div className="pt-tl-when"><RelTime at={a.at} /></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

/* ── Tasks & team ──────────────────────────────────────────────────── */
function TeamTab({ stats }: { stats: DashboardStats }) {
  const t = stats.tasks
  const closedWithDue = t.onTime.onTime + t.onTime.late
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="pt-grid pt-grid-4">
        <div className="pt-card pt-stat pt-tile">
          <span className="pt-stat-label"><Icon name="clock" size={15} /> الالتزام بالمواعيد</span>
          <span className="pt-tile-value">{t.onTime.rate === null ? '—' : `${fmtNumber(t.onTime.rate)}٪`}</span>
          <Meter value={t.onTime.rate} target={90} caption={closedWithDue ? `${fmtNumber(t.onTime.onTime)} من ${fmtNumber(closedWithDue)} مهمة سُلّمت في موعدها · الهدف ٩٠٪` : 'تظهر بعد اكتمال أول مهمة لها تاريخ استحقاق'} />
        </div>
        <div className="pt-card pt-stat pt-tile">
          <span className="pt-stat-label"><Icon name="star" size={15} /> متوسط تقييم المهام</span>
          <span className="pt-tile-value">{t.avgRating === null ? '—' : `${fmtNumber(t.avgRating)} / 5`}</span>
          <Stars value={t.avgRating} size={18} />
          <span className="pt-stat-sub">من {fmtNumber(t.ratedCount)} مهمة مقيَّمة</span>
        </div>
        <StatTile label="مهام مفتوحة" icon="tasks" href="/portal/tasks" value={fmtNumber(t.open)}
          sub={`${fmtNumber(t.dueThisWeek)} تستحق هذا الأسبوع`}
          explain="كل ما لم يصل «مكتملة» بعد، لكل الفريق." />
        <StatTile label="مهام متأخرة" icon="alert" href="/portal/tasks" value={fmtNumber(t.overdue)}
          sub={t.overdue === 0 ? 'لا تأخير — ممتاز' : 'تجاوزت تاريخ الاستحقاق'} tone={t.overdue === 0 ? 'good' : 'bad'}
          explain="مهام مفتوحة مرّ تاريخ استحقاقها. كل واحدة ترسل تنبيهاً لصاحبها." />
      </div>

      <ChartCard
        title="لوحة أداء الفريق" icon="team"
        explain={{
          what: 'لكل عضو: كم مهمة أنجز، متوسط تقييم المشرف لعمله (من ٥ نجوم)، ونسبة ما سلّمه في الموعد. الترتيب حسب أعلى تقييم.',
          example: 'فهد: ٦ مهام منجزة · ★ ٤٫٢ · ٨٣٪ في الموعد ⟵ جودة عالية مع تأخير بسيط يستحق نقاشاً.',
        }}
      >
        {t.members.length === 0 ? <div className="pt-dim" style={{ fontSize: '0.85rem' }}>أضف أعضاء الفريق لتظهر نتائجهم هنا.</div> : (
          <div className="pt-table-wrap" style={{ border: 0 }}>
            <table className="pt-table" style={{ minWidth: 560 }}>
              <thead><tr>{['العضو', 'أنجز', 'متوسط التقييم', 'في الموعد', 'مفتوحة', 'متأخرة'].map(h => <th key={h} style={{ cursor: 'default' }}>{h}</th>)}</tr></thead>
              <tbody>
                {t.members.map(m => (
                  <tr key={m.userId} style={{ cursor: 'default' }}>
                    <td><span className="pt-score-name"><Avatar name={m.name} color={m.color} size={26} /> <strong>{m.name}</strong></span></td>
                    <td className="pt-num">{fmtNumber(m.done)}</td>
                    <td>{m.avgRating === null ? <span className="pt-dim">—</span> : <Stars value={m.avgRating} showNumber />}</td>
                    <td>{m.onTimeRate === null ? <span className="pt-dim">—</span> : <span className="pt-mini-meter"><span className="pt-meter"><i style={{ width: `${m.onTimeRate}%` }} /></span><span className="pt-num">{fmtNumber(m.onTimeRate)}٪</span></span>}</td>
                    <td className="pt-num">{fmtNumber(m.open)}</td>
                    <td className={`pt-num ${m.overdue ? 'pt-overdue' : ''}`}>{fmtNumber(m.overdue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ChartCard>

      <div className="pt-grid pt-grid-half">
        <ChartCard
          title="توزيع التقييمات" icon="star"
          explain={{ what: 'كم مهمة حصلت على كل عدد من النجوم. الأشرطة الطويلة في الأعلى (٤ و٥ نجوم) علامة جودة.', example: '٨ مهام بخمس نجوم، ٤ بأربع، ١ بنجمتين ⟵ الجودة ممتازة مع استثناء واحد يُراجع.' }}
          table={{ head: ['التقييم', 'عدد المهام'], rows: t.ratingDist.map(r => [r.label, fmtNumber(r.value)]) }}
        >
          <BarList rows={t.ratingDist} color="var(--viz-4)" emptyText="لا مهام مقيَّمة بعد — قيّم أول مهمة مكتملة" />
        </ChartCard>

        <ChartCard
          title="حِمل العمل الحالي" icon="team"
          explain={{ what: 'عدد المهام المفتوحة عند كل عضو الآن. يساعدك توزّع المهمة الجديدة على الأقل انشغالاً.', example: 'سارة ٧ مهام وفهد ٢ ⟵ المهمة القادمة لفهد.' }}
          table={{ head: ['العضو', 'مهام مفتوحة'], rows: t.members.map(m => [m.name, fmtNumber(m.open)]) }}
        >
          <BarList rows={[...t.members].sort((a, b) => b.open - a.open).map(m => ({ key: m.userId, label: m.name, value: m.open, sub: m.overdue ? `${fmtNumber(m.overdue)} متأخرة` : undefined }))} color="var(--viz-1)" emptyText="لا مهام مفتوحة" />
        </ChartCard>
      </div>

      {stats.isStaff && (
        <section className="pt-card">
          <div className="pt-card-head"><h3 className="pt-card-title"><Icon name="star" size={16} /> مهام مكتملة بانتظار تقييمك</h3></div>
          <div className="pt-list">
            {t.unratedDone.length === 0 && <div className="pt-empty" style={{ padding: '1.5rem' }}>كل المهام المكتملة مقيَّمة ✓</div>}
            {t.unratedDone.map(x => (
              <Link key={x.id} href={`/portal/tasks/${x.id}`} className="pt-list-item">
                <div className="pt-list-main"><div className="pt-list-title">{String(x.title)}</div><div className="pt-list-sub">اكتملت <RelTime at={x.completedAt || x.updatedAt} /></div></div>
                <span className="pt-btn pt-btn-sm"><Icon name="star" size={13} /> قيّم</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

/* ── Finance ───────────────────────────────────────────────────────── */
function FinanceTab({ stats }: { stats: DashboardStats }) {
  const f = stats.finance!
  const net = f.revenueThisMonth - f.expensesThisMonth
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="pt-grid pt-grid-4">
        <StatTile label="إيراد هذا الشهر" icon="money" value={fmtMoney(f.revenueThisMonth)} sub="فواتير مدفوعة فعلاً" explain="مجموع الفواتير التي حالتها «مدفوعة» وتاريخ سدادها هذا الشهر (شامل الضريبة)." />
        <StatTile label="مصروف هذا الشهر" icon="expenses" href="/portal/expenses" value={fmtMoney(f.expensesThisMonth)} sub="كل ما سُجّل في المصروفات" explain="إنتاج، إعلانات، اشتراكات، مستقلون… المسجّلة بتاريخ هذا الشهر." />
        <StatTile label="الصافي" icon="chart" value={fmtMoney(net)} sub={net >= 0 ? 'ربح' : 'خسارة'} tone={net >= 0 ? 'good' : 'bad'} explain="الإيراد − المصروف. مثال: دخل ٢٠ ألف وصُرف ٨ آلاف ⟵ الصافي ١٢ ألف." />
        <StatTile label="مستحقات لم تُحصَّل" icon="invoices" href="/portal/invoices" value={fmtMoney(f.unpaidTotal)} sub={f.overdueCount ? `${fmtNumber(f.overdueCount)} متأخرة` : `${fmtNumber(f.unpaidCount)} فاتورة مرسلة`} tone={f.overdueCount ? 'bad' : 'default'} explain="فواتير أُرسلت ولم تُدفع. المتأخرة منها تظهر في التنبيهات." />
      </div>

      <div className="pt-grid pt-grid-2">
        <ChartCard
          title="الإيراد مقابل المصروف — آخر ٦ أشهر" icon="activity"
          explain={{ what: 'لكل شهر عمودان: الأزرق ما دخل (فواتير مدفوعة)، والبرتقالي ما خرج (مصروفات). الفرق بينهما هو ربح الشهر.', example: 'أكتوبر: أزرق ٢٣ ألف وبرتقالي ٦ آلاف ⟵ ربح ١٧ ألف.' }}
          table={{ head: ['الشهر', 'الإيراد', 'المصروف', 'الصافي'], rows: f.byMonth.map(m => [m.label, fmtMoney(m.revenue), fmtMoney(m.expenses), fmtMoney(m.revenue - m.expenses)]) }}
        >
          <Columns data={f.byMonth.map(m => ({ key: m.key, label: m.label, values: [m.revenue, m.expenses] }))} series={['إيراد محصّل', 'مصروف']} format={fmtMoney} />
        </ChartCard>

        <ChartCard
          title="أين تذهب المصروفات؟" icon="expenses"
          explain={{ what: 'توزيع مصروفات آخر ٦ أشهر حسب التصنيف. القطعة الأكبر هي أول مكان تبحث فيه عن توفير.', example: 'لو «ميزانية إعلانات» ٥٠٪ فهذا طبيعي للوكالة؛ لو «اشتراكات» ٣٠٪ فراجع الاشتراكات غير المستخدمة.' }}
          table={{ head: ['التصنيف', 'المبلغ'], rows: f.expensesByCategory.map(s => [s.label, fmtMoney(s.value)]) }}
        >
          <Donut data={f.expensesByCategory} centerLabel="إجمالي ٦ أشهر" format={fmtMoney} />
        </ChartCard>
      </div>

      <div className="pt-grid pt-grid-half">
        <ChartCard
          title="أعلى العملاء إيراداً" icon="clients"
          explain={{ what: 'مجموع ما دفعه كل عميل (كل الفواتير المدفوعة). يوضّح على من تعتمد الوكالة.', example: 'لو عميل واحد يمثل أكثر من نصف الإيراد ⟵ خطر؛ نوّع قاعدة العملاء.' }}
          table={{ head: ['العميل', 'المدفوع'], rows: f.topClients.map(s => [s.label, fmtMoney(s.value)]) }}
        >
          <BarList rows={f.topClients.map(c => ({ ...c, href: `/portal/clients/${c.key}` }))} format={fmtMoney} emptyText="لا فواتير مدفوعة بعد" />
        </ChartCard>

        <section className="pt-card">
          <div className="pt-card-head"><h3 className="pt-card-title"><Icon name="alert" size={16} /> فواتير متأخرة السداد</h3></div>
          <div className="pt-list">
            {f.overdueInvoices.length === 0 && <div className="pt-empty" style={{ padding: '1.5rem' }}>لا فواتير متأخرة ✓</div>}
            {f.overdueInvoices.map(i => (
              <Link key={i.id} href={`/portal/invoices/${i.id}`} className="pt-list-item">
                <div className="pt-list-main"><div className="pt-list-title">{String(i.number)}</div><div className="pt-list-sub">{stats.clientsById[String(i.client)] ?? ''} · استحقت {fmtDate(i.dueDate)}</div></div>
                <span className="pt-overdue pt-num" style={{ fontSize: '0.78rem' }}><RelTime at={i.dueDate} /></span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
