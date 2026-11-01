'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FieldValue } from './FieldValue'
import { Empty } from './ui'
import { fieldByKey, type BaseRecord, type ModuleDef } from '@/portal/schema'

export function RecordTable({ def, rows, onNew }: { def: ModuleDef; rows: BaseRecord[]; onNew?: () => void }) {
  const router = useRouter()
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' }>(def.defaultSort ?? { key: 'updatedAt', dir: 'desc' })

  const cols = useMemo(() => {
    const title = fieldByKey(def, def.titleField)
    const rest = def.fields.filter(f => f.table && f.key !== def.titleField)
    return [title, ...rest].filter(Boolean) as NonNullable<typeof title>[]
  }, [def])

  const sorted = useMemo(() => {
    const f = fieldByKey(def, sort.key)
    const numeric = f && ['money', 'number', 'percent'].includes(f.type)
    return [...rows].sort((a, b) => {
      const av = a[sort.key], bv = b[sort.key]
      if (av === bv) return 0
      if (av === undefined || av === null || av === '') return 1
      if (bv === undefined || bv === null || bv === '') return -1
      const r = numeric ? Number(av) - Number(bv) : String(av).localeCompare(String(bv), 'ar')
      return sort.dir === 'asc' ? r : -r
    })
  }, [rows, sort, def])

  if (rows.length === 0) {
    return (
      <div className="pt-card">
        <Empty icon={def.icon} title={`لا يوجد ${def.label} بعد`} hint={def.description} action={onNew && <button type="button" className="pt-btn pt-btn-primary" onClick={onNew}>إضافة أول {def.singular}</button>} />
      </div>
    )
  }

  const toggle = (key: string) => setSort(s => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }))

  return (
    <div className="pt-table-wrap">
      <table className="pt-table">
        <thead>
          <tr>
            {cols.map(c => (
              <th key={c.key} onClick={() => toggle(c.key)} aria-sort={sort.key === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}>
                {c.label} {sort.key === c.key ? (sort.dir === 'asc' ? '↑' : '↓') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(r => (
            <tr key={r.id} onClick={() => router.push(`/portal/${def.key}/${r.id}`)}>
              {cols.map((c, i) => (
                <td key={c.key}>
                  {i === 0 ? (
                    <div>
                      <div className="pt-title-cell">{String(r[c.key] ?? r.number ?? '—')}</div>
                      {def.subtitleField && !cols.some(x => x.key === def.subtitleField) && fieldByKey(def, def.subtitleField)?.type !== 'relation' && r[def.subtitleField] ? <div className="pt-sub-cell">{String(r[def.subtitleField])}</div> : null}
                    </div>
                  ) : (
                    <FieldValue field={c} value={r[c.key]} record={r} def={def} compact />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
