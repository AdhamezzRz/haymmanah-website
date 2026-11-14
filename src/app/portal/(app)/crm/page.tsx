import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/portal/auth'
import { computeStats } from '@/portal/stats'
import { Icon } from '@/components/portal/Icon'
import { CrmPage } from '@/components/portal/CrmPage'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'المبيعات · CRM' }

export default async function CrmOverviewPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/portal/login')
  const stats = await computeStats(user)
  if (!stats.crm) redirect('/portal')
  return (
    <div>
      <div className="pt-page-head">
        <div>
          <div className="pt-eyebrow">المبيعات · CRM</div>
          <h1 className="pt-h1">صورة المبيعات كاملة</h1>
          <p className="pt-lead">من أول اهتمام إلى توقيع العقد: كم فرصة عندنا، كم نتوقع أن يدخل، ومن يحتاج اتصالاً اليوم.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link href="/portal/interactions?new=1" className="pt-btn"><Icon name="phone" /> سجّل تواصل</Link>
          <Link href="/portal/clients?new=1" className="pt-btn"><Icon name="clients" /> عميل جديد</Link>
          <Link href="/portal/deals?new=1" className="pt-btn pt-btn-primary"><Icon name="plus" /> فرصة جديدة</Link>
        </div>
      </div>
      <CrmPage crm={stats.crm} />
    </div>
  )
}
