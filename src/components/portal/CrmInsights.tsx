'use client'

import Link from 'next/link'
import { Icon } from './Icon'
import { ChartCard, StatTile, Donut, BarList, Meter, fmtCompact } from './charts'
import { fmtMoney, fmtDate, fmtNumber } from '@/portal/format'
import type { CrmStats } from '@/portal/stats'

/** The sales picture: pipeline, forecast, where deals come from, who to call today. */
export function CrmInsights({ crm, full }: { crm: CrmStats; full?: boolean }) {
  const closed = crm.wonCount + crm.lostCount
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="pt-grid pt-grid-4">
        <StatTile
          label="قيمة الفرص المفتوحة" icon="deals" href="/portal/deals"
          value={fmtMoney(crm.pipelineValue)}
          sub={`${fmtNumber(crm.pipelineCount)} فرصة قيد العمل`}
          explain="مجموع قيمة كل الصفقات التي لم تُحسم بعد. مثال: ٣ فرص بـ ١٠ و٢٠ و٣٠ ألف = ٦٠ ألف."
        />
        <StatTile
          label="الإيراد المتوقّع" icon="chart" href="/portal/deals"
          value={fmtMoney(crm.forecast)}
          sub="قيمة كل فرصة × احتمال فوزها"
          explain="تقدير واقعي لما سيدخل فعلاً. مثال: فرصة ٢٠ ألف في مرحلة «عرض سعر» (٦٠٪) تُحسب ١٢ ألف."
        />
        <div className="pt-card pt-stat pt-tile">
          <span className="pt-stat-label"><Icon name="star" size={15} /> نسبة الفوز</span>
          <span className="pt-tile-value">{crm.winRate === null ? '—' : `${fmtNumber(crm.winRate)}٪`}</span>
          <Meter value={crm.winRate} caption={closed ? `كسبنا ${fmtNumber(crm.wonCount)} من ${fmtNumber(closed)} فرصة محسومة` : 'تظهر بعد إغلاق أول فرصة'} />
        </div>
        <StatTile
          label="متوسط قيمة الصفقة" icon="money"
          value={crm.avgDeal === null ? '—' : fmtMoney(crm.avgDeal)}
          sub={crm.wonThisMonth > 0 ? `كسبنا هذا الشهر ${fmtMoney(crm.wonThisMonth)}` : 'من الصفقات المكسوبة'}
          tone={crm.wonThisMonth > 0 ? 'good' : 'default'}
          explain="مجموع قيم الصفقات المكسوبة ÷ عددها — يعطيك فكرة عن حجم العميل المعتاد."
        />
      </div>

      <div className="pt-grid pt-grid-2">
        <ChartCard
          title="قمع المبيعات — كم فرصة في كل مرحلة" icon="deals"
          explain={{
            what: 'كل شريط = عدد الفرص الموجودة الآن في تلك المرحلة، وبجانبه مجموع قيمتها. الطبيعي أن تقلّ الفرص كلما تقدّمت المراحل.',
            example: 'إذا عندك ٨ فرص جديدة و١ فقط في «تفاوض» ⟵ المشكلة في تحويل الاهتمام إلى اجتماعات، لا في جلب العملاء.',
          }}
          table={{ head: ['المرحلة', 'عدد الفرص', 'القيمة'], rows: crm.funnel.map(f => [f.label, fmtNumber(f.count), fmtMoney(f.value)]) }}
          action={<Link href="/portal/deals" className="pt-btn pt-btn-ghost pt-btn-sm">اللوحة ←</Link>}
        >
          <BarList
            rows={crm.funnel.map(f => ({ key: f.key, label: f.label, value: f.count, sub: f.value ? fmtCompact(f.value) + ' ر.س' : undefined }))}
            emptyText="أضف أول فرصة بيع لتظهر هنا"
          />
        </ChartCard>

        <ChartCard
          title="من أين تأتي الفرص؟" icon="clients"
          explain={{
            what: 'توزيع الفرص حسب القناة التي جاء منها العميل. القطعة الأكبر = القناة الأنجح في جلب الاهتمام.',
            example: 'لو ٥٠٪ من الفرص من «توصية من عميل» ⟵ استثمر في برنامج إحالة قبل زيادة الإعلانات.',
          }}
          table={{ head: ['المصدر', 'عدد الفرص'], rows: crm.bySource.map(s => [s.label, fmtNumber(s.value)]) }}
        >
          <Donut data={crm.bySource} centerLabel="فرصة" />
        </ChartCard>
      </div>

      <div className="pt-grid pt-grid-2">
        <section className="pt-card">
          <div className="pt-card-head">
            <h3 className="pt-card-title"><Icon name="phone" size={16} /> متابعات قريبة</h3>
            <Link href="/portal/interactions?new=1" className="pt-btn pt-btn-sm"><Icon name="plus" size={14} /> سجّل تواصل</Link>
          </div>
          <div className="pt-list">
            {crm.followUps.length === 0 && <div className="pt-empty" style={{ padding: '1.5rem' }}>لا متابعات خلال ٣ أيام — حدّد «المتابعة القادمة» في الفرص والعملاء ليذكّرك النظام.</div>}
            {crm.followUps.map(f => (
              <Link key={`${f.module}-${f.id}`} href={`/portal/${f.module}/${f.id}`} className="pt-list-item">
                <Icon name={f.module === 'deals' ? 'deals' : 'clients'} size={16} />
                <div className="pt-list-main"><div className="pt-list-title">{f.title}</div><div className="pt-list-sub">{f.sub}</div></div>
                <span className={`pt-num ${f.overdue ? 'pt-overdue' : 'pt-dim'}`} style={{ fontSize: '0.76rem' }}>{f.overdue ? 'فائتة · ' : ''}{fmtDate(f.date)}</span>
              </Link>
            ))}
          </div>
        </section>

        <ChartCard
          title="لماذا نخسر الفرص؟" icon="alert"
          explain={{
            what: 'أسباب الخسارة كما سجّلها الفريق عند إغلاق الفرصة كـ «خسرناها». السبب الأطول هو أول ما يستحق العلاج.',
            example: 'إذا «السعر» هو السبب الأول ⟵ جرّب باقة أصغر للدخول بدل تخفيض السعر.',
          }}
          table={{ head: ['السبب', 'عدد الفرص'], rows: crm.lostReasons.map(s => [s.label, fmtNumber(s.value)]) }}
        >
          <BarList rows={crm.lostReasons} color="var(--viz-2)" emptyText="لا فرص خاسرة مسجّلة — ممتاز" />
        </ChartCard>
      </div>

      {full && (
        <div className="pt-grid pt-grid-2">
          <ChartCard
            title="العملاء حسب الحالة" icon="clients"
            explain={{ what: 'كم عميل في كل حالة: محتمل، عرض سعر، نشط، متوقف، منتهي.', example: 'عملاء «نشط» هم من يدفعون الآن؛ «محتمل» و«عرض سعر» هم وقود الأشهر القادمة.' }}
            table={{ head: ['الحالة', 'عدد العملاء'], rows: crm.clientsByStatus.map(s => [s.label, fmtNumber(s.value)]) }}
          >
            <Donut data={crm.clientsByStatus} centerLabel="عميل" />
          </ChartCard>

          <section className="pt-card">
            <div className="pt-card-head"><h3 className="pt-card-title"><Icon name="clock" size={16} /> عملاء نشطون بلا تواصل منذ ٣٠ يوماً</h3></div>
            <div className="pt-list">
              {crm.staleClients.length === 0 && <div className="pt-empty" style={{ padding: '1.5rem' }}>كل العملاء النشطين تم التواصل معهم مؤخراً ✓</div>}
              {crm.staleClients.map(c => (
                <Link key={c.id} href={`/portal/clients/${c.id}`} className="pt-list-item">
                  <Icon name="clients" size={16} />
                  <div className="pt-list-main"><div className="pt-list-title">{c.name}</div></div>
                  <span className="pt-overdue pt-num" style={{ fontSize: '0.76rem' }}>{c.days === null ? 'لا تواصل مسجّل' : `منذ ${fmtNumber(c.days)} يوماً`}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
