'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Icon } from './Icon'
import { initials } from '@/portal/format'
import type { Option } from '@/portal/schema'

/* ── Chip ─────────────────────────────────────────────────────────── */
export function Chip({ label, color = '#6B7A99', small }: { label: string; color?: string; small?: boolean }) {
  return (
    <span className="pt-chip" style={{ color: '#fff', background: `${color}33`, borderColor: `${color}66`, fontSize: small ? '0.66rem' : undefined, padding: small ? '0.1rem 0.5rem' : undefined }}>
      <i className="pt-dot" style={{ background: color }} />
      {label}
    </span>
  )
}

export function OptionChip({ option, value, small }: { option?: Option; value?: unknown; small?: boolean }) {
  if (!option) return value ? <span className="pt-muted">{String(value)}</span> : <span className="pt-dim">—</span>
  return <Chip label={option.label} color={option.color} small={small} />
}

/* ── Avatar ───────────────────────────────────────────────────────── */
export function Avatar({ name, color = '#4C63C7', size = 30 }: { name: string; color?: string; size?: number }) {
  return (
    <span className="pt-avatar" title={name} style={{ background: color, width: size, height: size, fontSize: size * 0.36 }}>
      {initials(name || '؟')}
    </span>
  )
}

/* ── Empty state ───────────────────────────────────────────────────── */
export function Empty({ icon = 'sparkles', title, hint, action }: { icon?: string; title: string; hint?: string; action?: React.ReactNode }) {
  return (
    <div className="pt-empty">
      <Icon name={icon} />
      <div>
        <div style={{ color: 'var(--pt-text)', fontWeight: 700 }}>{title}</div>
        {hint && <div style={{ marginTop: '0.25rem' }}>{hint}</div>}
      </div>
      {action}
    </div>
  )
}

/* ── Spinner ───────────────────────────────────────────────────────── */
export function Spinner({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'pt-spin 0.8s linear infinite' }} aria-label="جارٍ التحميل">
      <path d="M12 3a9 9 0 1 0 9 9" />
      <style>{`@keyframes pt-spin { to { transform: rotate(360deg) } }`}</style>
    </svg>
  )
}

/* ── Toasts ───────────────────────────────────────────────────────── */
type ToastKind = 'info' | 'success' | 'error'
interface Toast { id: number; text: string; kind: ToastKind }
const ToastCtx = createContext<(text: string, kind?: ToastKind) => void>(() => {})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const idRef = useRef(0)
  const push = useCallback((text: string, kind: ToastKind = 'info') => {
    const id = ++idRef.current
    setToasts(t => [...t, { id, text, kind }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pt-toasts" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className="pt-toast" data-kind={t.kind}>
            <Icon name={t.kind === 'error' ? 'alert' : t.kind === 'success' ? 'check' : 'sparkles'} size={16} style={{ color: t.kind === 'error' ? '#FFB4AE' : t.kind === 'success' ? '#7FE0A8' : 'var(--gold-bright)' }} />
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}
export const useToast = () => useContext(ToastCtx)

/* ── Drawer ───────────────────────────────────────────────────────── */
export function Drawer({ title, onClose, children, footer, wide }: { title: React.ReactNode; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [onClose])
  return (
    <>
      <div className="pt-scrim" onClick={onClose} />
      <aside className="pt-drawer" role="dialog" aria-modal="true" style={wide ? { width: 'min(820px, 100vw)' } : undefined}>
        <div className="pt-drawer-head">
          <h2 className="pt-drawer-title">{title}</h2>
          <button type="button" className="pt-btn pt-btn-ghost pt-btn-icon" onClick={onClose} aria-label="إغلاق"><Icon name="close" /></button>
        </div>
        <div className="pt-drawer-body">{children}</div>
        {footer && <div className="pt-drawer-foot">{footer}</div>}
      </aside>
    </>
  )
}

/* ── Confirm ──────────────────────────────────────────────────────── */
export function useConfirm() {
  const [state, setState] = useState<{ text: string; resolve: (v: boolean) => void } | null>(null)
  const confirm = useCallback((text: string) => new Promise<boolean>(resolve => setState({ text, resolve })), [])
  const node = useMemo(() => state ? (
    <div className="pt-cmd-scrim" style={{ alignItems: 'center', paddingTop: 0 }} onClick={() => { state.resolve(false); setState(null) }}>
      <div className="pt-cmd" style={{ width: 'min(420px, calc(100vw - 2rem))', padding: '1.5rem' }} onClick={e => e.stopPropagation()}>
        <p style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', lineHeight: 1.7 }}>{state.text}</p>
        <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
          <button type="button" className="pt-btn" onClick={() => { state.resolve(false); setState(null) }}>إلغاء</button>
          <button type="button" className="pt-btn pt-btn-danger" autoFocus onClick={() => { state.resolve(true); setState(null) }}>نعم، احذف</button>
        </div>
      </div>
    </div>
  ) : null, [state])
  return { confirm, confirmNode: node }
}
