import Link from 'next/link'

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
  { href: 'tel:+966570591088',        label: '+966 57 059 1088' },
  { href: 'mailto:RH-2025@outlook.sa', label: 'RH-2025@outlook.sa' },
  { href: '/contact',                  label: 'حجز استشارة' },
]

const socials = [
  { href: '#', label: 'X' },
  { href: '#', label: 'IG' },
  { href: '#', label: 'LI' },
  { href: '#', label: 'TK' },
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
            <p style={{ fontFamily: 'var(--font-role-display)', fontSize: '1.75rem', color: 'var(--gold)', marginBottom: '0.75rem' }}>
              هيمنة
            </p>
            <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'var(--muted)', lineHeight: 1.7, maxWidth: 220 }}>
              للخدمات التسويقية — نَصنع الهيمنة، لا نُطاردها.
            </p>
            <p style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.75rem', color: 'rgba(138,147,191,0.5)', marginTop: '1rem' }}>
              حي المربع، الرياض
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              {socials.map(s => (
                <Link
                  key={s.label}
                  href={s.href}
                  style={{
                    fontFamily: 'var(--font-role-heading)',
                    fontSize: '0.75rem',
                    color: 'var(--muted)',
                    textDecoration: 'none',
                    border: '1px solid rgba(138,147,191,0.2)',
                    borderRadius: 3,
                    padding: '0.25rem 0.5rem',
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
                  <Link href={l.href} style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'var(--muted)', textDecoration: 'none', direction: 'ltr', display: 'inline-block' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.75rem', color: 'rgba(138,147,191,0.4)' }}>
            © {new Date().getFullYear()} هيمنة للخدمات التسويقية — جميع الحقوق محفوظة
          </p>
          <p style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.75rem', color: 'rgba(138,147,191,0.4)', direction: 'ltr' }}>
            CR 1010612147
          </p>
        </div>
      </div>
    </footer>
  )
}
