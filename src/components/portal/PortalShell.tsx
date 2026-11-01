'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Icon } from './Icon'
import { Avatar, ToastProvider } from './ui'
import { CommandPalette } from './CommandPalette'
import { fmtHijri, fmtTime, fmtDate, ROLE_LABELS_SAFE } from './shellFormat'
import type { PortalUser } from '@/portal/auth'
import type { ModuleDef } from '@/portal/schema'

interface NavModule { key: string; label: string; icon: string; color: string; newLabel?: string }

export function PortalShell({ user, modules, storageOk, storageDir, children }: {
  user: PortalUser
  modules: NavModule[]
  storageOk: boolean
  storageDir: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [cmd, setCmd] = useState(false)
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmd(c => !c) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const logout = async () => {
    await fetch('/api/portal/auth/logout', { method: 'POST' })
    router.push('/portal/login')
    router.refresh()
  }

  const current = (href: string) => (href === '/portal' ? pathname === '/portal' : pathname.startsWith(href))
  const title =
    pathname === '/portal' ? 'لوحة التحكم'
    : pathname.startsWith('/portal/settings') ? 'الإعدادات'
    : modules.find(m => pathname.startsWith(`/portal/${m.key}`))?.label ?? 'هيمنة'

  return (
    <ToastProvider>
      <div className="portal" dir="rtl">
        <aside className="pt-side" data-open={open}>
          <Link href="/portal" className="pt-brand">
            <span className="pt-brand-mark">هـ</span>
            <span>
              <div className="pt-brand-name">هيمنة</div>
              <div className="pt-brand-sub">Team OS</div>
            </span>
          </Link>

          <nav className="pt-nav" aria-label="أقسام النظام">
            <Link href="/portal" className="pt-nav-item" aria-current={current('/portal') ? 'page' : undefined}>
              <Icon name="dashboard" /> لوحة التحكم
            </Link>
            <div className="pt-nav-label">العمل</div>
            {modules.map(m => (
              <Link key={m.key} href={`/portal/${m.key}`} className="pt-nav-item" aria-current={current(`/portal/${m.key}`) ? 'page' : undefined}>
                <Icon name={m.icon} /> {m.label}
              </Link>
            ))}
            {user.role === 'admin' && (
              <>
                <div className="pt-nav-label">النظام</div>
                <Link href="/portal/settings" className="pt-nav-item" aria-current={current('/portal/settings') ? 'page' : undefined}>
                  <Icon name="settings" /> الإعدادات
                </Link>
              </>
            )}
          </nav>

          <div className="pt-side-foot">
            <div className="pt-user">
              <Avatar name={user.name} color={user.color} size={34} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="pt-user-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                <div className="pt-user-role">{user.title || ROLE_LABELS_SAFE[user.role]}</div>
              </div>
              <button type="button" className="pt-btn pt-btn-ghost pt-btn-icon" onClick={logout} title="تسجيل الخروج" aria-label="تسجيل الخروج">
                <Icon name="logout" />
              </button>
            </div>
          </div>
        </aside>

        {open && <div className="pt-scrim" style={{ zIndex: 65 }} onClick={() => setOpen(false)} />}

        <header className="pt-top">
          <button type="button" className="pt-btn pt-btn-ghost pt-btn-icon pt-menu-btn" onClick={() => setOpen(o => !o)} aria-label="القائمة"><Icon name="menu" /></button>
          <div className="pt-top-title">{title}</div>
          <div className="pt-top-grow" />
          <button type="button" className="pt-search-btn" onClick={() => setCmd(true)}>
            <Icon name="search" size={15} />
            <span>ابحث أو نفّذ أمراً…</span>
            <kbd>⌘K</kbd>
          </button>
          <div className="pt-clock" aria-live="off">
            <span className="pt-clock-time">{now ? fmtTime(now) : '—'}</span>
            <span className="pt-clock-date">{now ? `${fmtDate(now)} · ${fmtHijri(now, 'short')}` : ''}</span>
          </div>
        </header>

        <main className="pt-main">
          {!storageOk && (
            <div className="pt-banner" role="alert">
              <Icon name="alert" style={{ color: 'var(--pt-warn)', flexShrink: 0 }} />
              <div>
                <strong>التخزين غير متاح على هذه الاستضافة.</strong> لا يمكن الكتابة في <code dir="ltr">{storageDir}</code> — البيانات لن تُحفظ هنا.
                على Hostinger يعمل تلقائياً؛ على Vercel يلزم ربط قاعدة بيانات.
              </div>
            </div>
          )}
          {children}
        </main>

        {cmd && <CommandPalette onClose={() => setCmd(false)} modules={modules as ModuleDef[]} role={user.role} />}
      </div>
    </ToastProvider>
  )
}
