'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'

export const CONSENT_KEY = 'haymanah-cookie-consent'
export const CONSENT_EVENT = 'haymanah-consent-change'

export type ConsentValue = 'accepted' | 'declined'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const existing = localStorage.getItem(CONSENT_KEY)
    if (!existing) setVisible(true)
  }, [])

  function choose(value: ConsentValue) {
    localStorage.setItem(CONSENT_KEY, value)
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }))
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            insetInline: 0,
            bottom: 0,
            zIndex: 9995,
            background: 'var(--ink)',
            borderTop: '1px solid rgba(76,99,199,0.25)',
            padding: '1.25rem 2rem',
            boxShadow: '0 -8px 30px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{
            maxWidth: 1100,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}>
            <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'var(--muted)', lineHeight: 1.7, flex: 1, minWidth: 240 }}>
              نستخدم تخزيناً ضرورياً لعمل الموقع، وقد نستخدم أدوات تحليل اختيارية لفهم كيفية استخدامك له — فقط بموافقتك.{' '}
              <Link href="/privacy" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>
                اقرأ سياسة الخصوصية
              </Link>
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
              <button
                onClick={() => choose('declined')}
                style={{
                  fontFamily: 'var(--font-role-heading)',
                  fontSize: '0.875rem',
                  color: 'var(--muted)',
                  background: 'transparent',
                  border: '1px solid rgba(76,99,199,0.2)',
                  borderRadius: 4,
                  padding: '0.625rem 1.25rem',
                  cursor: 'pointer',
                }}
              >
                رفض
              </button>
              <button
                onClick={() => choose('accepted')}
                style={{
                  fontFamily: 'var(--font-role-heading)',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: 'var(--on-gold)',
                  background: 'var(--gold-grad)',
                  border: 'none',
                  borderRadius: 4,
                  padding: '0.625rem 1.5rem',
                  cursor: 'pointer',
                }}
              >
                قبول
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
