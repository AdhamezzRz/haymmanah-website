'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'

const links = [
  { href: '/services', label: 'الخدمات' },
  { href: '/work',     label: 'أعمالنا' },
  { href: '/about',    label: 'من نحن' },
  { href: '/approach', label: 'منهجيتنا' },
  { href: '/insights', label: 'المقالات' },
]


export function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          insetInline: 0,
          zIndex: 1000,
          padding: '0 2rem',
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled ? 'rgba(10,16,48,0.8)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(201,161,74,0.1)' : 'none',
          transition: 'background 0.4s, backdrop-filter 0.4s, border-color 0.4s',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image
            src="/logo.png"
            alt="هيمنة للخدمات التسويقية"
            width={110}
            height={60}
            style={{ objectFit: 'contain', filter: 'brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(5deg)', height: 44, width: 'auto' }}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="التنقل الرئيسي" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <ul
            role="list"
            style={{ display: 'flex', gap: '2rem', listStyle: 'none', margin: 0, padding: 0 }}
            className="hidden-mobile"
          >
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  style={{
                    fontFamily: 'var(--font-role-heading)',
                    fontSize: '0.9375rem',
                    color: pathname === href ? 'var(--gold)' : 'var(--ivory)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/contact"
            style={{
              fontFamily: 'var(--font-role-heading)',
              fontSize: '0.9375rem',
              color: 'var(--ink)',
              background: 'var(--gold-grad)',
              padding: '0.5rem 1.25rem',
              borderRadius: 4,
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'opacity 0.2s',
            }}
            className="hidden-mobile"
          >
            احجز استشارتك
          </Link>

          {/* Burger */}
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={open}
            className="show-mobile"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: 'var(--ivory)',
            }}
          >
            <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </nav>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999,
              background: 'rgba(5,8,26,0.97)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2rem',
            }}
          >
            {links.map(({ href, label }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={href}
                  style={{
                    fontFamily: 'var(--font-role-display)',
                    fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
                    color: pathname === href ? 'var(--gold)' : 'var(--ivory)',
                    textDecoration: 'none',
                  }}
                >
                  {label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: links.length * 0.07, duration: 0.4 }}
            >
              <Link
                href="/contact"
                style={{
                  fontFamily: 'var(--font-role-heading)',
                  fontSize: '1rem',
                  color: 'var(--ink)',
                  background: 'var(--gold-grad)',
                  padding: '0.875rem 2rem',
                  borderRadius: 4,
                  textDecoration: 'none',
                  fontWeight: 600,
                  marginTop: '1rem',
                  display: 'inline-block',
                }}
              >
                احجز استشارتك
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive helpers injected into <head> via globals.css isn't ideal — doing it inline */}
      <style>{`
        @media (min-width: 768px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile   { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
      `}</style>
    </>
  )
}
