import type { Metadata } from 'next'
import { Aref_Ruqaa, Reem_Kufi, Tajawal } from 'next/font/google'
import { Preloader, Cursor, LenisProvider, ScrollProgress, Nav, Footer, PageTransition } from '@/components/chrome'
import './globals.css'

const arefRuqaa = Aref_Ruqaa({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-display',
  display: 'swap',
})

const reemKufi = Reem_Kufi({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
})

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['200', '300', '400', '500', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'هيمنة | للخدمات التسويقية', template: '%s — هيمنة' },
  description: 'نَصنع الهيمنة، لا نُطاردها — وكالة تسويق رقمي سعودية متخصصة في بناء العلامات التجارية والسيادة الرقمية.',
  keywords: ['تسويق رقمي', 'وكالة إعلانية', 'الرياض', 'هيمنة', 'سيو', 'إدارة منصات'],
  robots: 'index, follow',
  openGraph: {
    siteName: 'هيمنة',
    locale: 'ar_SA',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${arefRuqaa.variable} ${reemKufi.variable} ${tajawal.variable}`}>
      <body className={tajawal.className}>
        <a href="#main-content" className="skip-link">تخطى إلى المحتوى الرئيسي</a>
        <Preloader />
        <Cursor />
        <ScrollProgress />
        <LenisProvider>
          <Nav />
          <PageTransition>
            <main id="main-content">{children}</main>
          </PageTransition>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  )
}
