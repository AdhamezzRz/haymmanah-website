'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { work } from '@/lib/work'
import { insights } from '@/lib/insights'

type Result = { href: string; title: string; sub: string; kind: 'أعمالنا' | 'المقالات' }

const workResults: Result[] = work.map(c => ({
  href: `/work/${c.slug}`,
  title: c.client,
  sub: `${c.sector} — ${c.tagline}`,
  kind: 'أعمالنا',
}))

const insightResults: Result[] = insights.map(a => ({
  href: `/insights/${a.slug}`,
  title: a.title,
  sub: a.topic,
  kind: 'المقالات',
}))

const allResults = [...workResults, ...insightResults]

function matches(r: Result, q: string) {
  const haystack = `${r.title} ${r.sub} ${r.kind}`.toLowerCase()
  return haystack.includes(q.toLowerCase())
}

export function SearchModal() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) setQuery('')
    return () => { document.body.style.overflow = '' }
  }, [open])

  const results = useMemo(() => {
    if (!query.trim()) return []
    return allResults.filter(r => matches(r, query.trim())).slice(0, 8)
  }, [query])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="بحث"
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'none', border: '1px solid rgba(var(--ivory-rgb),0.15)', borderRadius: 20,
          padding: '0.4rem 0.75rem', cursor: 'pointer', color: 'var(--muted)',
        }}
      >
        <svg viewBox="0 0 20 20" width={15} height={15} fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="9" cy="9" r="6" /><path d="M17 17l-3.5-3.5" strokeLinecap="round" /></svg>
        <span style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.75rem' }} className="hidden-mobile">بحث</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(5,4,2,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '10vh 1.5rem 2rem' }}
          >
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: 560, background: 'var(--navy-2)', border: '1px solid rgba(201,161,74,0.25)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.1rem 1.25rem', borderBottom: '1px solid rgba(201,161,74,0.12)' }}>
                <svg viewBox="0 0 20 20" width={18} height={18} fill="none" stroke="var(--gold)" strokeWidth="1.6"><circle cx="9" cy="9" r="6" /><path d="M17 17l-3.5-3.5" strokeLinecap="round" /></svg>
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="ابحث في الأعمال والمقالات…"
                  style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--font-role-body)', fontSize: '1rem', color: 'var(--ivory)' }}
                />
                <kbd style={{ fontFamily: 'var(--font-role-heading)', fontSize: '0.65rem', color: 'var(--muted)', border: '1px solid rgba(var(--ivory-rgb),0.15)', borderRadius: 4, padding: '0.15rem 0.4rem' }}>Esc</kbd>
              </div>

              <div style={{ maxHeight: '55vh', overflowY: 'auto' }}>
                {query.trim() && results.length === 0 && (
                  <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)', fontFamily: 'var(--font-role-body)', fontSize: '0.875rem' }}>
                    لا نتائج مطابقة لـ «{query}»
                  </p>
                )}
                {results.map(r => (
                  <Link
                    key={r.href}
                    href={r.href}
                    onClick={() => setOpen(false)}
                    style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', padding: '0.875rem 1.25rem', textDecoration: 'none', borderBottom: '1px solid rgba(var(--ivory-rgb),0.06)' }}
                  >
                    <span style={{ fontFamily: 'var(--font-role-heading)', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--gold)', textTransform: 'uppercase' }}>{r.kind}</span>
                    <span style={{ fontFamily: 'var(--font-role-heading)', fontSize: '0.9375rem', color: 'var(--ivory)' }}>{r.title}</span>
                    <span style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.8125rem', color: 'var(--muted)' }}>{r.sub}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
