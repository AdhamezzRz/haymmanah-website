import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser, hasAnyUser, canRead } from '@/portal/auth'
import { modules } from '@/portal/modules'
import { storageHealth } from '@/portal/store'
import { PortalShell } from '@/components/portal/PortalShell'
import '../portal.css'

export const metadata: Metadata = {
  title: { default: 'نظام هيمنة', template: '%s — نظام هيمنة' },
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function PortalAppLayout({ children }: { children: React.ReactNode }) {
  if (!(await hasAnyUser())) redirect('/portal/setup')
  const user = await getCurrentUser()
  if (!user) redirect('/portal/login')
  const health = await storageHealth()
  const nav = modules.filter(m => m.nav && canRead(user.role, m)).map(m => ({ key: m.key, label: m.label, icon: m.icon, color: m.color, newLabel: m.newLabel }))

  return (
    <PortalShell user={user} modules={nav} storageOk={health.ok} storageDir={health.dir}>
      {children}
    </PortalShell>
  )
}
