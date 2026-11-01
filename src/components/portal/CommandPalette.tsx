'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from './Icon'
import { api } from './data'
import type { Role } from '@/portal/schema'

interface NavModule { key: string; label: string; icon: string; color: string; newLabel?: string }
interface Hit { module: string; moduleLabel: string; id: string; title: string; subtitle?: string }
interface Item { id: string; group: string; label: string; sub?: string; icon: string; run: () => void }

export function CommandPalette({ onClose, modules, role }: { onClose: () => void; modules: NavModule[]; role: Role }) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [hits, setHits] = useState<Hit[]>([])
  const [sel, setSel] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  // remote search (debounced)
  useEffect(() => {
    const term = q.trim()
    if (!term) { setHits([]); return }
    const t = setTimeout(() => {
      api<{ hits: Hit[] }>(`/search?q=${encodeURIComponent(term)}`).then(r => setHits(r.hits)).catch(() => setHits([]))
    }, 160)
    return () => clearTimeout(t)
  }, [q])

  const go = (href: string) => { onClose(); router.push(href) }

  const items = useMemo<Item[]>(() => {
    const term = q.trim().toLowerCase()
    const nav: Item[] = [
      { id: 'nav-dash', group: 'انتقال', label: 'لوحة التحكم', icon: 'dashboard', run: () => go('/portal') },
      ...modules.map(m => ({ id: `nav-${m.key}`, group: 'انتقال', label: m.label, icon: m.icon, run: () => go(`/portal/${m.key}`) })),
      ...(role === 'admin' ? [{ id: 'nav-settings', group: 'انتقال', label: 'الإعدادات', icon: 'settings', run: () => go('/portal/settings') }] : []),
    ]
    const quick: Item[] = modules.map(m => ({ id: `new-${m.key}`, group: 'إجراء سريع', label: m.newLabel ?? `إضافة ${labelSingular(m.key)}`, icon: 'plus', run: () => go(`/portal/${m.key}?new=1`) }))
    const local = [...nav, ...quick].filter(i => !term || i.label.toLowerCase().includes(term))
    const remote: Item[] = hits.map(h => ({ id: `hit-${h.module}-${h.id}`, group: h.moduleLabel, label: h.title, sub: h.subtitle, icon: modules.find(m => m.key === h.module)?.icon ?? 'search', run: () => go(`/portal/${h.module}/${h.id}`) }))
    return [...remote, ...local]
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, hits, modules, role])

  useEffect(() => { setSel(0) }, [q, hits.length])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(s + 1, items.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => Math.max(s - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); items[sel]?.run() }
    else if (e.key === 'Escape') onClose()
  }

  let lastGroup = ''
  return (
    <div className="pt-cmd-scrim" onClick={onClose}>
      <div className="pt-cmd" role="dialog" aria-label="لوحة الأوامر" onClick={e => e.stopPropagation()}>
        <div className="pt-cmd-input">
          <Icon name="search" />
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} onKeyDown={onKey} placeholder="ابحث في العملاء، المشاريع، المهام، الفواتير… أو اكتب أمراً" />
          <kbd style={{ fontSize: '0.65rem', color: 'var(--pt-dim)', border: '1px solid var(--pt-line-strong)', borderRadius: 5, padding: '0.1rem 0.4rem' }}>Esc</kbd>
        </div>
        <div className="pt-cmd-list" role="listbox">
          {items.length === 0 && <div className="pt-empty" style={{ padding: '2rem' }}>لا نتائج لـ «{q}»</div>}
          {items.map((it, i) => {
            const header = it.group !== lastGroup ? <div className="pt-cmd-group" key={`g-${it.group}-${i}`}>{it.group}</div> : null
            lastGroup = it.group
            return (
              <div key={it.id}>
                {header}
                <div className="pt-cmd-item" role="option" aria-selected={i === sel} onMouseEnter={() => setSel(i)} onClick={it.run}>
                  <Icon name={it.icon} size={16} />
                  <span>{it.label}</span>
                  {it.sub && <span className="pt-cmd-sub">{it.sub}</span>}
                </div>
              </div>
            )
          })}
        </div>
        <div className="pt-cmd-foot">
          <span>↑↓ تنقّل</span><span>↵ فتح</span><span>Esc إغلاق</span>
        </div>
      </div>
    </div>
  )
}

function labelSingular(key: string) {
  return ({ clients: 'عميل', projects: 'مشروع', tasks: 'مهمة', content: 'منشور', invoices: 'فاتورة', expenses: 'مصروف', team: 'عضو' } as Record<string, string>)[key] ?? 'سجل'
}
