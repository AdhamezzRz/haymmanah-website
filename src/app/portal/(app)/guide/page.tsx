import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser, canRead } from '@/portal/auth'
import { modules } from '@/portal/modules'
import { NAV_GROUP_LABELS, type NavGroup } from '@/portal/schema'
import { Icon } from '@/components/portal/Icon'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'دليل الاستخدام' }

const journey = [
  { title: 'عميل محتمل يتواصل', body: 'أضفه في «العملاء» بحالة «عميل محتمل» واختر «كيف وصل إلينا؟». مثال: كوفي حرف، وصل من تيك توك.', href: '/portal/clients', cta: 'العملاء' },
  { title: 'افتح له فرصة بيع', body: 'في «فرص البيع» اكتب ماذا يريد وكم قيمته المتوقعة. مثال: «باقة ريلز شهرية» بـ ٦٬٠٠٠ ر.س. اسحبها بين المراحل كلما تقدّمتم.', href: '/portal/deals', cta: 'فرص البيع' },
  { title: 'سجّل كل تواصل', body: 'بعد كل اتصال أو اجتماع اضغط «سجّل تواصل» واكتب سطراً والخطوة التالية وموعدها. النظام يذكّرك في الموعد.', href: '/portal/interactions', cta: 'سجل التواصل' },
  { title: 'كسبتم الفرصة 🎉', body: 'اسحبها إلى «مكسوبة» — يتحوّل العميل تلقائياً إلى «نشط». ثم أنشئ له مشروعاً.', href: '/portal/projects', cta: 'المشاريع' },
  { title: 'وزّع المهام', body: 'تحت المشروع أضف المهام، لكل مهمة شخص وتاريخ. الفريق يحرّكها: قيد الانتظار ← جارٍ العمل ← للمراجعة ← مكتملة.', href: '/portal/tasks', cta: 'المهام' },
  { title: 'قيّم الإنجاز', body: 'عند اكتمال المهمة يعطيها المشرف من ١ إلى ٥ نجوم مع ملاحظة قصيرة. المتوسط يظهر في لوحة «المهام والفريق».', href: '/portal', cta: 'لوحة التحكم' },
  { title: 'أصدر الفاتورة', body: 'من «الفواتير» أضف البنود؛ الضريبة ١٥٪ ورمز QR يُحسبان تلقائياً. عند السداد غيّر الحالة إلى «مدفوعة».', href: '/portal/invoices', cta: 'الفواتير' },
]

const faqs = [
  { q: 'ما معنى «وضع الشرح»؟', a: 'زر في أعلى لوحة التحكم. إذا فعّلته ظهر تحت كل رقم ورسم سطران: «وش يعني؟» و«مثال». أوقفه متى ما تعوّدت على النظام.' },
  { q: 'كيف تعمل التنبيهات؟', a: 'الجرس أعلى الصفحة يجمع كل ما يحتاج تصرفاً: مهمة تأخرت أو تستحق اليوم/غداً، مهمة بانتظار مراجعتك، مهمة اكتملت ولم تُقيَّم، متابعة عميل حان موعدها، فاتورة تأخر سدادها. اضغط × لتجاهل تنبيه بعد التصرف فيه.' },
  { q: 'من يستطيع تقييم المهام؟', a: 'المدير والمشرف فقط، وبعد أن تصبح المهمة «مكتملة». إذا أُعيد فتح المهمة يُمسح تقييمها ليُقيَّم العمل الجديد.' },
  { q: 'كيف يُحسب «الإيراد المتوقّع»؟', a: 'قيمة كل فرصة × احتمال فوزها حسب المرحلة: جديدة ١٠٪، تم التواصل ٢٠٪، اجتماع ٤٠٪، عرض سعر ٦٠٪، تفاوض ٨٠٪. تقدر تكتب احتمالاً خاصاً لأي فرصة.' },
  { q: 'هل أستطيع رؤية الأرقام بدل الرسم؟', a: 'نعم — كل رسم فيه زر «جدول» يعرض نفس الأرقام في جدول، وكل صفحة فيها زر تنزيل CSV للإكسل.' },
  { q: 'أين أبحث بسرعة؟', a: 'اضغط ⌘K (أو Ctrl+K) من أي مكان واكتب اسم عميل، مهمة، أو رقم فاتورة.' },
]

export default async function GuidePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/portal/login')
  const visible = modules.filter(m => m.help && canRead(user.role, m))
  const groups = (['crm', 'work', 'finance', 'system'] as NavGroup[]).map(g => ({ g, items: visible.filter(m => m.group === g) })).filter(x => x.items.length)

  return (
    <div style={{ maxWidth: 980 }}>
      <div className="pt-page-head">
        <div>
          <div className="pt-eyebrow">ابدأ من هنا</div>
          <h1 className="pt-h1">دليل الاستخدام</h1>
          <p className="pt-lead">كل شيء في النظام مشروح بجملة ومثال. خمس دقائق قراءة تكفي لتستخدمه بثقة.</p>
        </div>
      </div>

      <h2 className="pt-card-title" style={{ margin: '0 0 0.75rem' }}><Icon name="sparkles" size={16} /> الرحلة الكاملة: من أول اتصال إلى الفاتورة</h2>
      <div className="pt-steps" style={{ marginBottom: '2rem' }}>
        {journey.filter(s => user.role !== 'member' || ['/portal/projects', '/portal/tasks', '/portal'].includes(s.href)).map((s, i) => (
          <div key={s.title} className="pt-card pt-step">
            <span className="pt-step-n">{(i + 1).toLocaleString('ar-EG')}</span>
            <div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <p style={{ marginTop: '0.5rem' }}><Link href={s.href} className="pt-btn pt-btn-sm">افتح {s.cta} ←</Link></p>
            </div>
          </div>
        ))}
      </div>

      {groups.map(({ g, items }) => (
        <section key={g} style={{ marginBottom: '2rem' }}>
          <h2 className="pt-card-title" style={{ margin: '0 0 0.75rem' }}>{NAV_GROUP_LABELS[g]}</h2>
          <div className="pt-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {items.map(m => (
              <Link key={m.key} href={`/portal/${m.key}`} className="pt-card pt-card-pad" style={{ display: 'block' }}>
                <h3 className="pt-card-title" style={{ marginBottom: '0.6rem' }}><Icon name={m.icon} size={16} style={{ color: m.color }} /> {m.label}</h3>
                <p className="pt-muted" style={{ fontSize: '0.82rem', lineHeight: 1.8, margin: 0 }}>{m.help!.what}</p>
                <p style={{ fontSize: '0.8rem', lineHeight: 1.8, margin: '0.5rem 0 0', color: 'var(--pt-text)' }}>{m.help!.example}</p>
                {m.help!.tips && (
                  <ul className="pt-muted" style={{ fontSize: '0.78rem', lineHeight: 1.8, margin: '0.5rem 0 0', paddingInlineStart: '1.1rem' }}>
                    {m.help!.tips.map(t => <li key={t}>{t}</li>)}
                  </ul>
                )}
              </Link>
            ))}
          </div>
        </section>
      ))}

      <h2 className="pt-card-title" style={{ margin: '0 0 0.75rem' }}><Icon name="guide" size={16} /> أسئلة سريعة</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {faqs.map(f => (
          <details key={f.q} className="pt-howto" style={{ marginBottom: 0 }}>
            <summary><Icon name="chevronDown" size={14} /> {f.q}</summary>
            <div className="pt-howto-body"><p>{f.a}</p></div>
          </details>
        ))}
      </div>
    </div>
  )
}
