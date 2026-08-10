'use client'

import { services } from '@/lib/services'
import { LogoMark } from '@/components/signature/LogoMark'
import { GlowCard } from '@/components/signature/GlowCard'
import { ClipReveal } from '@/components/signature/ClipReveal'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { motion } from 'motion/react'

/* ─── Platform definitions ──────────────────────────── */
const platforms = [
  {
    name: 'Meta Ads',
    color: '#1877F2',
    bg: 'rgba(24,119,242,0.12)',
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="#1877F2">
        <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"/>
      </svg>
    ),
  },
  {
    name: 'Google Ads',
    color: '#EA4335',
    bg: 'rgba(234,67,53,0.10)',
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20}>
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
  },
  {
    name: 'TikTok',
    color: '#000000',
    bg: 'rgba(var(--ivory-rgb),0.06)',
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="#111111">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.16a8.16 8.16 0 0 0 4.77 1.52V7.22a4.85 4.85 0 0 1-1-.53z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    color: '#E1306C',
    bg: 'rgba(225,48,108,0.10)',
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="url(#igGrad)">
        <defs>
          <linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fd5949"/>
            <stop offset="50%" stopColor="#d6249f"/>
            <stop offset="100%" stopColor="#285AEB"/>
          </linearGradient>
        </defs>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    name: 'Snapchat',
    color: '#FFFC00',
    bg: 'rgba(255,252,0,0.10)',
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="#FFFC00">
        <path d="M12.166.006C9.813-.028 6.9 1.122 5.149 3.462c-.875 1.16-1.317 2.525-1.317 4.282v.845c0 .234-.01.478-.02.73-.051.02-.106.042-.163.064a2.2 2.2 0 0 1-.766.165c-.259 0-.554-.083-.879-.248a.592.592 0 0 0-.284-.07.61.61 0 0 0-.41.149.566.566 0 0 0-.198.426c0 .383.277.696.831.934.069.03.193.072.354.113.327.083.748.19.969.394.148.14.219.322.213.54-.005.203-.094.455-.262.75-.277.485-.611.893-1.122 1.265-.444.32-.685.676-.685 1.023 0 .378.28.715.835.997.458.23.856.347 1.175.347a1.83 1.83 0 0 0 .485-.06c.196-.054.368-.082.51-.082.24 0 .451.073.653.223.354.267.71.4 1.059.4.146 0 .294-.02.44-.057.408-.1.78-.17 1.104-.21.55-.068 1.187-.1 1.895-.1.706 0 1.342.032 1.892.1.323.04.695.11 1.104.21.146.037.294.057.44.057.35 0 .705-.133 1.058-.4.203-.15.414-.223.654-.223.143 0 .315.028.51.082.148.04.315.06.485.06.32 0 .717-.117 1.175-.347.555-.282.835-.619.835-.997 0-.347-.24-.703-.685-1.023-.511-.372-.845-.78-1.122-1.265-.168-.295-.258-.547-.262-.75-.006-.218.065-.4.213-.54.22-.204.642-.311.97-.394.16-.04.285-.083.354-.113.553-.238.83-.55.83-.934a.566.566 0 0 0-.197-.426.613.613 0 0 0-.41-.149.595.595 0 0 0-.284.07c-.325.165-.62.248-.88.248-.263 0-.524-.05-.765-.165a2.175 2.175 0 0 1-.164-.064c-.01-.252-.02-.496-.02-.73v-.845C19.168 3.293 16.273.035 12.166.006z"/>
      </svg>
    ),
  },
  {
    name: 'YouTube',
    color: '#FF0000',
    bg: 'rgba(255,0,0,0.10)',
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="#FF0000">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    name: 'X / Twitter',
    color: '#000000',
    bg: 'rgba(var(--ivory-rgb),0.06)',
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="#111111">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    color: '#0A66C2',
    bg: 'rgba(10,102,194,0.12)',
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="#0A66C2">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: 'Google Analytics',
    color: '#F9AB00',
    bg: 'rgba(249,171,0,0.10)',
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20}>
        <path fill="#F9AB00" d="M22.84 2.998C21.956 1.708 20.54 1 18.959 1c-1.057 0-2.034.367-2.756 1.034L12 6.22V1.5a.5.5 0 0 0-.5-.5H9a.5.5 0 0 0-.5.5v9.06L2.94 14.87C2.343 15.447 2 16.232 2 17.07 2 18.67 3.294 20 4.86 20H20.14C21.706 20 23 18.67 23 17.07V5.49c0-.91-.057-1.73-.16-2.492z"/>
        <path fill="#E37400" d="M9 22.5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-4H9v4z"/>
      </svg>
    ),
  },
]

/* ─── Per-service platform tags ──────────────────────── */
const servicePlatforms: Record<string, string[]> = {
  'performance-ads':  ['Meta Ads', 'Google Ads', 'TikTok', 'Snapchat'],
  'brand-identity':   ['Instagram', 'LinkedIn', 'YouTube'],
  'content-creation': ['Instagram', 'TikTok', 'YouTube', 'Snapchat'],
  'seo':              ['Google Ads', 'Google Analytics'],
  'social-media':     ['Instagram', 'TikTok', 'X / Twitter', 'LinkedIn', 'Snapchat'],
  'strategy':         ['Google Analytics', 'Meta Ads', 'Google Ads'],
}

const serviceNumbers = ['٠١', '٠٢', '٠٣', '٠٤', '٠٥', '٠٦']

export default function ServicesPage() {
  return (
    <div style={{ background: 'var(--navy)', color: 'var(--ivory)', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{ padding: '10rem 2rem 6rem', textAlign: 'center', background: 'var(--ink)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.04, pointerEvents: 'none' }}>
          <LogoMark size={640} mode="spin" />
        </div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 740, margin: '0 auto' }}>
          <ClipReveal>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              ترسانة الهيمنة
            </p>
          </ClipReveal>
          <ClipReveal delay={200}>
            <h1 style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h1)', color: 'var(--ivory)', marginBottom: '1.5rem', lineHeight: 1.05 }}>
              ست كفاءات.<br />
              <span className="text-gold-grad">نتيجة واحدة.</span>
            </h1>
          </ClipReveal>
          <ClipReveal delay={400}>
            <p style={{ fontFamily: 'var(--font-role-body)', color: 'var(--muted)', maxWidth: 480, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
              كل خدمة مُصممة لهدف تجاري محدد. لا نبيع ساعات — نبيع نتائج قابلة للقياس في السوق السعودي.
            </p>
          </ClipReveal>
        </div>
      </section>

      {/* ── Platform logos strip ── */}
      <section style={{ background: 'var(--ink)', borderTop: '1px solid rgba(201,161,74,0.08)', borderBottom: '1px solid rgba(201,161,74,0.08)', padding: '2rem', overflow: 'hidden' }}>
        <p style={{ textAlign: 'center', fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--muted)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.75rem' }}>
          المنصات التي نُسيطر عليها
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 900, margin: '0 auto' }}>
          {platforms.map((p, i) => (
            <Reveal key={p.name} delay={i * 60}>
              <motion.div
                whileHover={{ y: -3, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: p.bg,
                  border: `1px solid ${p.color}30`,
                  borderRadius: 40,
                  cursor: 'default',
                }}
              >
                {p.icon}
                <span style={{ fontFamily: 'var(--font-role-heading)', fontSize: '0.8125rem', color: 'var(--ivory)', whiteSpace: 'nowrap' }}>
                  {p.name}
                </span>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Services list ── */}
      <section style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {services.map((s, i) => {
            const tags = servicePlatforms[s.slug] ?? []
            const isEven = i % 2 === 0
            return (
              <Reveal key={s.slug} delay={80}>
                <Link href={`/services/${s.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <GlowCard
                    style={{
                      background: 'var(--navy-2)',
                      display: 'grid',
                      gridTemplateColumns: isEven ? '1fr 2.5fr 1fr' : '1fr 2.5fr 1fr',
                      gap: '2rem',
                      padding: '2.5rem 3rem',
                      alignItems: 'center',
                    }}
                  >
                    {/* Number */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-role-display)',
                          fontSize: 'clamp(3rem,5vw,4.5rem)',
                          fontWeight: 700,
                          background: 'var(--gold-grad)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          lineHeight: 1,
                          opacity: 0.35,
                        }}
                      >
                        {serviceNumbers[i]}
                      </span>
                      {/* Service icon */}
                      <div style={{ width: 52, height: 52, background: 'rgba(201,161,74,0.1)', border: '1px solid rgba(201,161,74,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg viewBox="0 0 24 24" width={26} height={26} fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d={s.icon} />
                        </svg>
                      </div>
                    </div>

                    {/* Content */}
                    <div>
                      <h2 style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'clamp(1.25rem,2vw,1.625rem)', color: 'var(--ivory)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
                        {s.name}
                      </h2>
                      <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'var(--gold)', marginBottom: '0.875rem', fontStyle: 'italic' }}>
                        {s.promise}
                      </p>
                      <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'var(--muted)', lineHeight: 1.75, maxWidth: '55ch' }}>
                        {s.problem.slice(0, 120)}…
                      </p>
                      {/* Platform tags */}
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
                        {tags.map(t => {
                          const pl = platforms.find(p => p.name === t)
                          return (
                            <span
                              key={t}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                fontFamily: 'var(--font-role-heading)',
                                fontSize: '0.6875rem',
                                letterSpacing: '0.05em',
                                color: 'var(--muted)',
                                border: `1px solid ${pl?.color ?? 'var(--gold)'}40`,
                                background: pl?.bg ?? 'transparent',
                                borderRadius: 20,
                                padding: '0.2rem 0.625rem',
                              }}
                            >
                              {pl && <span style={{ display: 'flex', alignItems: 'center', transform: 'scale(0.75)', transformOrigin: 'center' }}>{pl.icon}</span>}
                              {t}
                            </span>
                          )
                        })}
                      </div>
                    </div>

                    {/* CTA */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <span style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                          {s.deliverables.length} مخرجات
                        </span>
                      </div>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontFamily: 'var(--font-role-heading)',
                        fontSize: '0.875rem',
                        color: 'var(--gold)',
                        border: '1px solid rgba(201,161,74,0.3)',
                        borderRadius: 4,
                        padding: '0.5rem 1rem',
                      }}>
                        اعرف المزيد
                        <svg viewBox="0 0 16 16" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M10 8H3M7 5l3 3-3 3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </GlowCard>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* ── Ad platforms deep-dive ── */}
      <section style={{ padding: '5rem 2rem', background: 'var(--ink)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', insetInlineEnd: '-4rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.03, pointerEvents: 'none' }}>
          <LogoMark size={500} mode="spin" />
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <Reveal>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              تخصصنا الإعلاني
            </p>
            <h2 style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h2)', color: 'var(--ivory)', marginBottom: '3rem', lineHeight: 1.1 }}>
              نُدير الميزانيات، لا نتمنى النتائج
            </h2>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {[
              {
                platform: 'Meta Ads',
                icon: platforms[0].icon,
                color: '#1877F2',
                bg: 'rgba(24,119,242,0.07)',
                desc: 'إعلانات فيسبوك وإنستقرام. استهداف دقيق بالديموغرافيا والاهتمامات والسلوك. تخصصنا في قمع التحويل الكامل.',
                stats: '+٣٤٠٪ ROAS متوسط',
              },
              {
                platform: 'Google Ads',
                icon: platforms[1].icon,
                color: '#34A853',
                bg: 'rgba(52,168,83,0.07)',
                desc: 'بحث، شبكة إعلانية، يوتيوب، Shopping. نستهدف النية الشرائية الحقيقية في اللحظة الصحيحة.',
                stats: 'CPA أقل بـ ٤٢٪',
              },
              {
                platform: 'TikTok Ads',
                icon: platforms[2].icon,
                color: '#111111',
                bg: 'rgba(var(--ivory-rgb),0.05)',
                desc: 'In-Feed، TopView، Spark Ads، TikTok Shop. محتوى إعلاني يبدو عضوياً ويُحقق تحويلاً حقيقياً.',
                stats: 'CPM أقل ٣٥٪ من ميتا',
              },
              {
                platform: 'Snapchat Ads',
                icon: platforms[4].icon,
                color: '#9C8500',
                bg: 'rgba(255,224,0,0.08)',
                desc: 'الجمهور السعودي الشاب — ٧٢٪ من السعوديين ١٣-٣٥ على سناب يومياً. Story Ads و Filters و Lenses.',
                stats: 'وصول ٧٢٪ السعوديين الشباب',
              },
            ].map((item, i) => (
              <Reveal key={item.platform} delay={i * 100}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{
                    background: item.bg,
                    border: `1px solid ${item.color}25`,
                    borderRadius: 10,
                    padding: '2rem',
                    height: '100%',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.icon}
                    </div>
                    <span style={{ fontFamily: 'var(--font-role-heading)', fontSize: '1rem', color: 'var(--ivory)' }}>{item.platform}</span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'var(--muted)', lineHeight: 1.75, marginBottom: '1rem' }}>
                    {item.desc}
                  </p>
                  <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: '0.8125rem', color: item.color }}>
                    {item.stats}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <Reveal>
          <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            ابدأ الآن
          </p>
          <h2 style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h2)', color: 'var(--ivory)', marginBottom: '1rem', lineHeight: 1.1 }}>
            لا تعرف من أين تبدأ؟
          </h2>
          <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-role-body)', maxWidth: 380, margin: '0 auto 2.5rem', lineHeight: 1.75 }}>
            في استشارة واحدة مجانية نُحدد الخدمة الأنسب لمرحلتك ونضع خطة عمل واضحة.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button href="/contact" variant="primary" size="lg">احجز استشارة مجانية</Button>
            <Button href="/work" variant="outline" size="lg">شاهد نتائجنا</Button>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
