import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'هيمنة للخدمات التسويقية',
    short_name: 'هيمنة',
    description: 'وكالة تسويق رقمي سعودية في الرياض — إعلانات الأداء، الهوية البصرية، تحسين محركات البحث.',
    start_url: '/',
    display: 'standalone',
    background_color: '#EBF4FB',
    theme_color: '#2E3373',
    lang: 'ar-SA',
    dir: 'rtl',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
