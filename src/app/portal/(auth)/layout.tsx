import type { Metadata } from 'next'
import '../portal.css'

export const metadata: Metadata = {
  title: { absolute: 'الدخول — نظام هيمنة' },
  robots: { index: false, follow: false },
}

export default function PortalAuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="portal pt-auth" dir="rtl" style={{ display: 'grid' }}>{children}</div>
}
