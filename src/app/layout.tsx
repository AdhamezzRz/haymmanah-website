import type { Metadata } from 'next'
import { Aref_Ruqaa, Almarai } from 'next/font/google'
import { Preloader, Cursor, LenisProvider, ScrollProgress, Nav, Footer, PageTransition, FloatingWhatsApp } from '@/components/chrome'
import { JsonLd } from '@/components/seo/JsonLd'
import { globalSchema } from '@/lib/schema'
import './globals.css'

const arefRuqaa = Aref_Ruqaa({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-display',
  display: 'swap',
})

const almarai = Almarai({
  subsets: ['arabic'],
  weight: ['300', '400', '700', '800'],
  variable: '--font-almarai',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://haymanah.sa'),
  title: {
    default: 'هيمنة | وكالة تسويق رقمي في الرياض — إعلانات الأداء، هوية بصرية، SEO',
    template: '%s — هيمنة للتسويق الرقمي',
  },
  description:
    'هيمنة للخدمات التسويقية — وكالة تسويق رقمي سعودية في الرياض متخصصة في إعلانات الأداء، بناء الهوية البصرية، تحسين محركات البحث، وإدارة منصات التواصل الاجتماعي. نَصنع الهيمنة، لا نُطاردها.',
  keywords: [
    'تسويق رقمي السعودية', 'وكالة تسويق رقمي الرياض', 'إعلانات الأداء السعودية',
    'هوية بصرية السعودية', 'SEO عربي', 'تحسين محركات البحث السعودية',
    'إدارة منصات التواصل الاجتماعي', 'إعلانات ميتا السعودية', 'إعلانات جوجل السعودية',
    'تسويق تيك توك', 'هيمنة تسويق', 'digital marketing Saudi Arabia', 'marketing agency Riyadh',
  ],
  authors: [{ name: 'هيمنة للخدمات التسويقية', url: 'https://haymanah.sa' }],
  creator: 'هيمنة للخدمات التسويقية',
  publisher: 'هيمنة للخدمات التسويقية',
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  },
  alternates: {
    canonical: 'https://haymanah.sa',
    languages: { 'ar-SA': 'https://haymanah.sa' },
  },
  openGraph: {
    siteName: 'هيمنة للخدمات التسويقية',
    locale: 'ar_SA',
    type: 'website',
    url: 'https://haymanah.sa',
    title: 'هيمنة | وكالة تسويق رقمي — الرياض، السعودية',
    description: 'نَصنع الهيمنة، لا نُطاردها. وكالة تسويق رقمي سعودية متخصصة في إعلانات الأداء، الهوية البصرية، وتحسين محركات البحث.',
    images: [{ url: '/logo.png', width: 280, height: 153, alt: 'هيمنة للخدمات التسويقية' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'هيمنة | وكالة تسويق رقمي — الرياض',
    description: 'نَصنع الهيمنة، لا نُطاردها. وكالة تسويق رقمي سعودية.',
    images: ['/logo.png'],
    creator: '@haymanah_sa',
    site: '@haymanah_sa',
  },
  other: {
    'geo.region': 'SA-01', 'geo.placename': 'Riyadh, Saudi Arabia',
    'geo.position': '24.6877;46.7219', 'ICBM': '24.6877, 46.7219',
    'content-language': 'ar-SA', 'rating': 'general', 'revisit-after': '7 days',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${arefRuqaa.variable} ${almarai.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('haymanah-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`,
          }}
        />
        <JsonLd data={globalSchema} />
      </head>
      <body className={almarai.className}>
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
          <FloatingWhatsApp />
        </LenisProvider>
      </body>
    </html>
  )
}
