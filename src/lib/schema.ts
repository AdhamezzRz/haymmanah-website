/**
 * Centralized schema.org definitions for Haymanah.
 * Every JSON-LD block in the site pulls from these base objects.
 */

export const BASE_URL = 'https://haymanah.sa'
export const ORG_ID   = `${BASE_URL}/#organization`
export const SITE_ID  = `${BASE_URL}/#website`

export const organization = {
  '@type': ['Organization', 'MarketingAgency'],
  '@id': ORG_ID,
  name: 'هيمنة للخدمات التسويقية',
  alternateName: 'Haymanah Marketing',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/logo.png`,
    width: 280,
    height: 153,
  },
  image: `${BASE_URL}/logo.png`,
  description:
    'وكالة تسويق رقمي سعودية متخصصة في إعلانات الأداء وبناء الهوية البصرية وإدارة المنصات وتحسين محركات البحث في الرياض، المملكة العربية السعودية.',
  slogan: 'نَصنع الهيمنة، لا نُطاردها',
  foundingDate: '2022',
  numberOfEmployees: { '@type': 'QuantitativeValue', minValue: 10, maxValue: 30 },
  areaServed: [
    { '@type': 'Country', name: 'المملكة العربية السعودية', sameAs: 'https://www.wikidata.org/wiki/Q851' },
    { '@type': 'City',    name: 'الرياض' },
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'حي المربع',
    addressLocality: 'الرياض',
    addressRegion: 'منطقة الرياض',
    addressCountry: 'SA',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+966-57-059-1088',
      email: 'haymannah@gmail.com',
      contactType: 'customer service',
      availableLanguage: ['Arabic', 'English'],
      contactOption: 'HearingImpairedSupported',
      areaServed: 'SA',
    },
    {
      '@type': 'ContactPoint',
      telephone: '+966-57-059-1088',
      contactType: 'sales',
      availableLanguage: ['Arabic'],
    },
  ],
  identifier: {
    '@type': 'PropertyValue',
    name: 'السجل التجاري',
    value: '1010612147',
  },
  sameAs: [
    `https://wa.me/966570591088`,
  ],
  knowsAbout: [
    'إعلانات الأداء الرقمية',
    'التسويق عبر منصات التواصل الاجتماعي',
    'بناء الهوية البصرية',
    'تحسين محركات البحث SEO',
    'إنتاج المحتوى الرقمي',
    'استراتيجية التسويق الرقمي',
    'إعلانات ميتا',
    'إعلانات جوجل',
    'تيك توك ماركتينغ',
  ],
}

export const localBusiness = {
  '@type': ['LocalBusiness', 'MarketingAgency'],
  '@id': `${BASE_URL}/#localbusiness`,
  name: 'هيمنة للخدمات التسويقية',
  url: BASE_URL,
  telephone: '+966570591088',
  email: 'haymannah@gmail.com',
  priceRange: '$$$$',
  currenciesAccepted: 'SAR',
  paymentAccepted: 'Cash, Credit Card, Bank Transfer',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'حي المربع',
    addressLocality: 'الرياض',
    addressRegion: 'منطقة الرياض',
    addressCountry: 'SA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 24.6877,
    longitude: 46.7219,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  image: `${BASE_URL}/logo.png`,
}

export const website = {
  '@type': 'WebSite',
  '@id': SITE_ID,
  url: BASE_URL,
  name: 'هيمنة للخدمات التسويقية',
  description: 'نَصنع الهيمنة، لا نُطاردها — وكالة تسويق رقمي سعودية متخصصة في الرياض.',
  inLanguage: 'ar-SA',
  publisher: { '@id': ORG_ID },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/insights?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

export const globalSchema = {
  '@context': 'https://schema.org',
  '@graph': [organization, localBusiness, website],
}

export function blogPostingSchema(post: {
  slug: string
  title: string
  excerpt: string
  topic: string
  date: string
  readingTime: number
  wordCount?: number
  keywords?: string[]
}) {
  const dateIso = post.date.replace(/٠/g,'0').replace(/١/g,'1').replace(/٢/g,'2').replace(/٣/g,'3').replace(/٤/g,'4').replace(/٥/g,'5').replace(/٦/g,'6').replace(/٧/g,'7').replace(/٨/g,'8').replace(/٩/g,'9')
  const url = `${BASE_URL}/insights/${post.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: dateIso,
    dateModified: dateIso,
    inLanguage: 'ar-SA',
    articleSection: post.topic,
    wordCount: post.wordCount ?? 700,
    keywords: post.keywords ?? [post.topic, 'تسويق رقمي', 'الرياض', 'السعودية'],
    timeRequired: `PT${post.readingTime}M`,
    author: { '@id': ORG_ID },
    publisher: {
      '@id': ORG_ID,
      '@type': 'Organization',
      name: 'هيمنة للخدمات التسويقية',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
    image: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png`, width: 280, height: 153 },
    isPartOf: { '@id': SITE_ID },
  }
}

export function serviceSchema(service: {
  slug: string
  name: string
  promise: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${BASE_URL}/services/${service.slug}#service`,
    name: service.name,
    description: service.promise,
    url: `${BASE_URL}/services/${service.slug}`,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'Saudi Arabia', sameAs: 'https://www.wikidata.org/wiki/Q851' },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${BASE_URL}/services/${service.slug}`,
      servicePhone: '+966570591088',
    },
    serviceType: 'Digital Marketing',
  }
}

export function breadcrumbSchema(crumbs: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  }
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}
