'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from './Icon'
import { useToast } from './ui'
import type { Alert } from '@/portal/alerts'

const POLL_MS = 60_000
const NOTIFY_KEY = 'hm-notify'

/**
 * The bell: polls the derived alerts every minute (and whenever the tab regains
 * focus), toasts anything new, and — if the visitor opted in — raises a browser
 * notification so reminders land even when the portal is in a background tab.
 */
export function AlertsBell() {
  const toast = useToast()
  const pathname = usePathname()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [open, setOpen] = useState(false)
  const [notify, setNotify] = useState<'unsupported' | 'default' | 'granted' | 'denied' | 'off'>('unsupported')
  const seen = useRef<Set<string> | null>(null)
  const wrap = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/portal/alerts', { cache: 'no-store' })
      if (!res.ok) return
      const body = (await res.json()) as { alerts: Alert[] }
      const list = Array.isArray(body.alerts) ? body.alerts : []
      setAlerts(list)
      if (seen.current === null) {
        seen.current = new Set(list.map(a => a.key))   // first load: nothing is "new"
        return
      }
      const fresh = list.filter(a => !seen.current!.has(a.key))
      fresh.forEach(a => seen.current!.add(a.key))
      if (fresh.length === 0) return
      const top = fresh[0]
      toast(fresh.length === 1 ? top.title : `${fresh.length} تنبيهات جديدة — ${top.title}`, top.severity === 'critical' ? 'error' : 'info')
      try {
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted' && localStorage.getItem(NOTIFY_KEY) === '1' && document.hidden) {
          new Notification('هيمنة — تنبيه', { body: top.title, tag: top.key, lang: 'ar', dir: 'rtl' })
        }
      } catch { /* notifications are a bonus, never a failure */ }
    } catch { /* offline: keep the last list */ }
  }, [toast])

  useEffect(() => {
    load()
    const t = setInterval(load, POLL_MS)
    const onFocus = () => load()
    window.addEventListener('focus', onFocus)
    return () => { clearInterval(t); window.removeEventListener('focus', onFocus) }
  }, [load])

  // refresh after navigating (the user probably just changed something)
  useEffect(() => { setOpen(false); load() }, [pathname, load])

  useEffect(() => {
    try {
      if (typeof Notification === 'undefined') { setNotify('unsupported'); return }
      if (Notification.permission === 'granted') setNotify(localStorage.getItem(NOTIFY_KEY) === '1' ? 'granted' : 'off')
      else setNotify(Notification.permission === 'denied' ? 'denied' : 'default')
    } catch { setNotify('unsupported') }
  }, [])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])

  const dismiss = async (body: { keys: string[] } | { all: true }) => {
    // optimistic
    setAlerts(a => ('all' in body ? [] : a.filter(x => !body.keys.includes(x.key))))
    try {
      const res = await fetch('/api/portal/alerts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) { const j = (await res.json()) as { alerts: Alert[] }; setAlerts(j.alerts ?? []) }
    } catch { load() }
  }

  const enableNotify = async () => {
    try {
      if (typeof Notification === 'undefined') return
      const p = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission()
      if (p === 'granted') { localStorage.setItem(NOTIFY_KEY, '1'); setNotify('granted'); toast('تم تفعيل إشعارات المتصفح', 'success') }
      else setNotify(p === 'denied' ? 'denied' : 'default')
    } catch { setNotify('unsupported') }
  }
  const disableNotify = () => { try { localStorage.setItem(NOTIFY_KEY, '0') } catch { /* ignore */ } setNotify('off') }

  const critical = alerts.filter(a => a.severity === 'critical').length

  return (
    <div className="pt-bell" ref={wrap}>
      <button type="button" className="pt-btn pt-btn-ghost pt-btn-icon" aria-label={`التنبيهات (${alerts.length})`} aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <Icon name="bell" />
      </button>
      {alerts.length > 0 && <span className="pt-bell-badge" data-tone={critical ? 'hot' : 'calm'} aria-hidden="true">{alerts.length > 99 ? '99+' : alerts.length}</span>}

      {open && (
        <div className="pt-alerts-panel" role="dialog" aria-label="التنبيهات">
          <div className="pt-alerts-head">
            <span>التنبيهات {alerts.length > 0 && <span className="pt-nav-count">{alerts.length}</span>}</span>
            {alerts.length > 0 && <button type="button" className="pt-btn pt-btn-ghost pt-btn-sm" onClick={() => dismiss({ all: true })}>تجاهل الكل</button>}
          </div>
          <div className="pt-alerts-list">
            {alerts.length === 0 && (
              <div className="pt-empty" style={{ padding: '2rem 1rem' }}>
                <Icon name="check" />
                <div><div style={{ color: 'var(--pt-text)', fontWeight: 700 }}>لا تنبيهات</div><div style={{ marginTop: '0.25rem' }}>سنذكّرك عند حلول موعد مهمة، متابعة عميل، أو تأخر فاتورة.</div></div>
              </div>
            )}
            {alerts.map(a => (
              <div key={a.key} className="pt-alert" data-sev={a.severity}>
                <span className="pt-alert-ico"><Icon name={a.icon} size={16} /></span>
                <Link href={a.href} onClick={() => setOpen(false)} style={{ minWidth: 0 }}>
                  <span className="pt-alert-title">{a.title}</span>
                  <span className="pt-alert-body">{a.body}</span>
                </Link>
                <button type="button" className="pt-btn pt-btn-ghost pt-btn-icon" style={{ width: 28, height: 28 }} aria-label="تجاهل هذا التنبيه" title="تجاهل" onClick={() => dismiss({ keys: [a.key] })}><Icon name="close" size={13} /></button>
              </div>
            ))}
          </div>
          <div className="pt-alerts-foot">
            <span className="pt-dim" style={{ fontSize: '0.7rem' }}>تُحدَّث كل دقيقة</span>
            {notify === 'default' || notify === 'off' ? <button type="button" className="pt-btn pt-btn-sm" onClick={enableNotify}><Icon name="bell" size={13} /> فعّل إشعارات المتصفح</button>
              : notify === 'granted' ? <button type="button" className="pt-btn pt-btn-ghost pt-btn-sm" onClick={disableNotify}>إيقاف إشعارات المتصفح</button>
              : notify === 'denied' ? <span className="pt-dim" style={{ fontSize: '0.7rem' }}>الإشعارات محظورة من إعدادات المتصفح</span> : null}
          </div>
        </div>
      )}
    </div>
  )
}
