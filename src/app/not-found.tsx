import { LogoMark } from '@/components/signature/LogoMark'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

const quickLinks = [
  { href: '/services', label: 'الخدمات' },
  { href: '/work', label: 'أعمالنا' },
  { href: '/insights', label: 'المقالات' },
  { href: '/contact', label: 'تواصل معنا' },
]

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--ink)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8rem 2rem 4rem',
      position: 'relative',
      overflow: 'hidden',
      textAlign: 'center',
    }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.05, pointerEvents: 'none' }}>
        <LogoMark size={560} mode="spin" />
      </div>

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 520 }}>
        <p style={{ fontFamily: 'var(--font-role-display)', fontSize: 'clamp(5rem,14vw,9rem)', lineHeight: 1, marginBottom: '0.5rem' }} className="text-gold-grad">
          ٤٠٤
        </p>
        <h1 style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-h3)', color: 'var(--ivory)', marginBottom: '1rem' }}>
          هذه الصفحة لا تخضع لهيمنتنا
        </h1>
        <p style={{ fontFamily: 'var(--font-role-body)', color: 'var(--muted)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
          الرابط الذي وصلت إليه غير موجود أو تم نقله. جرّب أحد هذه الوجهات بدلاً من ذلك.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2.5rem' }}>
          {quickLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontFamily: 'var(--font-role-heading)',
                fontSize: '0.875rem',
                color: 'var(--gold)',
                textDecoration: 'none',
                border: '1px solid rgba(76,99,199,0.3)',
                borderRadius: 30,
                padding: '0.5rem 1.25rem',
                transition: 'border-color 0.2s',
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <Button href="/" variant="primary" size="lg">العودة للرئيسية</Button>
      </div>
    </div>
  )
}
