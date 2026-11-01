'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from './Icon'
import { fieldByKey, optionColor, type BaseRecord, type ModuleDef } from '@/portal/schema'
import { ARABIC_MONTHS, ARABIC_WEEKDAYS_SHORT, dayKey, fmtHijri } from '@/portal/format'

/** Month grid. Gregorian with Hijri (Umm al-Qura) companions; Fri/Sat shaded as the Saudi weekend. */
export function CalendarView({ def, rows, canWrite, onNew }: { def: ModuleDef; rows: BaseRecord[]; canWrite: boolean; onNew?: (prefill: Record<string, unknown>) => void }) {
  const router = useRouter()
  const [cursor, setCursor] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1) })
  const field = def.calendarField ?? 'dueDate'
  const status = fieldByKey(def, def.statusField ?? '')
  const today = dayKey()

  const cells = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
    const start = new Date(first); start.setDate(first.getDate() - first.getDay())   // weeks start Sunday
    return Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d })
  }, [cursor])

  const byDay = useMemo(() => {
    const m = new Map<string, BaseRecord[]>()
    for (const r of rows) {
      const v = r[field]
      if (!v) continue
      const k = dayKey(v)
      if (!m.has(k)) m.set(k, [])
      m.get(k)!.push(r)
    }
    return m
  }, [rows, field])

  const monthLabel = `${ARABIC_MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`
  const hijriRange = `${fmtHijri(cursor, 'short')} — ${fmtHijri(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0), 'short')}`

  return (
    <div>
      <div className="pt-cal-head">
        <div className="pt-cal-title">{monthLabel}<small>{hijriRange}</small></div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button type="button" className="pt-btn pt-btn-icon" onClick={() => setCursor(c => new Date(c.getFullYear(), c.getMonth() - 1, 1))} aria-label="الشهر السابق"><Icon name="chevronRight" /></button>
          <button type="button" className="pt-btn" onClick={() => { const d = new Date(); setCursor(new Date(d.getFullYear(), d.getMonth(), 1)) }}>اليوم</button>
          <button type="button" className="pt-btn pt-btn-icon" onClick={() => setCursor(c => new Date(c.getFullYear(), c.getMonth() + 1, 1))} aria-label="الشهر التالي"><Icon name="chevronLeft" /></button>
        </div>
      </div>
      <div className="pt-cal" role="grid">
        {ARABIC_WEEKDAYS_SHORT.map(d => <div key={d} className="pt-cal-dow">{d}</div>)}
        {cells.map(d => {
          const k = dayKey(d)
          const items = byDay.get(k) ?? []
          const outside = d.getMonth() !== cursor.getMonth()
          const weekend = d.getDay() === 5 || d.getDay() === 6
          return (
            <div
              key={k}
              className="pt-cal-day"
              data-outside={outside}
              data-today={k === today}
              data-weekend={weekend}
              role="gridcell"
              onClick={() => canWrite && onNew?.({ [field]: field.endsWith('At') ? `${k}T10:00:00+03:00` : k })}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="pt-cal-num">{d.getDate()}</span>
                <span className="pt-cal-hijri">{fmtHijri(d, 'short').split(' ')[0]}</span>
              </div>
              {items.slice(0, 3).map(r => (
                <div key={r.id} className="pt-cal-ev" style={{ borderInlineStartColor: optionColor(status, r[status?.key ?? '']) ?? 'var(--gold)' }} title={String(r[def.titleField] ?? '')} onClick={e => { e.stopPropagation(); router.push(`/portal/${def.key}/${r.id}`) }}>
                  {String(r[def.titleField] ?? '')}
                </div>
              ))}
              {items.length > 3 && <span className="pt-cal-more">+{items.length - 3} أخرى</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
