import Link from 'next/link'
import Image from 'next/image'

const company = [
  { href: '/about',    label: 'من نحن' },
  { href: '/approach', label: 'منهجيتنا' },
  { href: '/insights', label: 'المقالات' },
]

const services = [
  { href: '/services/performance-ads',    label: 'إعلانات الأداء' },
  { href: '/services/brand-identity',     label: 'الهوية البصرية' },
  { href: '/services/content-creation',   label: 'إنتاج المحتوى' },
  { href: '/services/seo',                label: 'تحسين محركات البحث' },
  { href: '/services/social-media',       label: 'إدارة منصات' },
  { href: '/services/strategy',           label: 'الاستراتيجية' },
]

const contact = [
  { href: 'tel:+966570591088',         label: '+966 57 059 1088' },
  { href: 'mailto:RH-2025@outlook.sa', label: 'RH-2025@outlook.sa' },
  { href: 'https://wa.me/966570591088?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1', label: 'واتساب', external: true },
  { href: '/contact',                  label: 'حجز استشارة' },
]

const socials = [
  {
    href: 'https://wa.me/966570591088?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1',
    label: 'WA',
    external: true,
    title: 'واتساب',
  },
  { href: '#', label: 'X',  external: false, title: 'تويتر' },
  { href: '#', label: 'IG', external: false, title: 'انستغرام' },
  { href: '#', label: 'TK', external: false, title: 'تيك توك' },
]

export function Footer() {
  return (
    <footer
      style={{
        background: 'var(--ink)',
        borderTop: '1px solid rgba(201,161,74,0.15)',
        padding: '4rem 2rem 2rem',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Top grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand */}
          <div>
            <Image
              src="/logo.png"
              alt="هيمنة للخدمات التسويقية"
              width={140}
              height={76}
              style={{ objectFit: 'contain', width: 'auto', height: 64, filter: 'brightness(0) invert(1) sepia(1) saturate(2) hue-rotate(5deg) brightness(0.85)', marginBottom: '0.75rem' }}
            />
            <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'var(--muted)', lineHeight: 1.7, maxWidth: 220 }}>
              للخدمات التسويقية — نَصنع الهيمنة، لا نُطاردها.
            </p>
            <p style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.75rem', color: 'rgba(107,94,73,0.7)', marginTop: '1rem' }}>
              حي المربع، الرياض
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              {socials.map(s => (
                <Link
                  key={s.label}
                  href={s.href}
                  title={s.title}
                  target={s.external ? '_blank' : undefined}
                  rel={s.external ? 'noopener noreferrer' : undefined}
                  style={{
                    fontFamily: 'var(--font-role-heading)',
                    fontSize: '0.75rem',
                    color: s.label === 'WA' ? '#25d366' : 'var(--muted)',
                    textDecoration: 'none',
                    border: `1px solid ${s.label === 'WA' ? 'rgba(37,211,102,0.3)' : 'rgba(107,94,73,0.25)'}`,
                    borderRadius: 3,
                    padding: '0.25rem 0.625rem',
                    transition: 'color 0.2s, border-color 0.2s',
                  }}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          {/* الشركة */}
          <div>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              الشركة
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {company.map(l => (
                <li key={l.href}>
                  <Link href={l.href} style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'var(--muted)', textDecoration: 'none' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* الخدمات */}
          <div>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              الخدمات
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {services.map(l => (
                <li key={l.href}>
                  <Link href={l.href} style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'var(--muted)', textDecoration: 'none' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* تواصل */}
          <div>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              تواصل
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {contact.map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    target={l.external ? '_blank' : undefined}
                    rel={l.external ? 'noopener noreferrer' : undefined}
                    style={{
                      fontFamily: 'var(--font-role-body)',
                      fontSize: 'var(--text-small)',
                      color: l.label === 'واتساب' ? '#25d366' : 'var(--muted)',
                      textDecoration: 'none',
                      direction: 'ltr',
                      display: 'inline-block',
                    }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(32,26,18,0.08)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.75rem', color: 'rgba(107,94,73,0.6)' }}>
            © {new Date().getFullYear()} هيمنة للخدمات التسويقية — جميع الحقوق محفوظة
          </p>
          <p style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.75rem', color: 'rgba(107,94,73,0.6)', direction: 'ltr' }}>
            CR 1010612147
          </p>
        </div>
      </div>
    </footer>
  )
}
