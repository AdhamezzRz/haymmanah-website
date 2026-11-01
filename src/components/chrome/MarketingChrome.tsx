'use client'

import { usePathname } from 'next/navigation'

/** Marketing-site chrome (nav, footer, preloader, cursor…) is hidden inside the team portal. */
export function MarketingChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/portal')) return null
  return <>{children}</>
}
