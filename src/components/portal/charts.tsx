'use client'

/**
 * Portal chart kit — dependency-free, RTL-native, dark-surface.
 *
 * Colour: the eight categorical slots (--viz-1…8 in portal.css) are a validated
 * set for the portal surface (CVD-safe adjacent pairs, ≥3:1 contrast). Slots are
 * assigned in fixed order by the caller; text always wears text tokens, never the
 * series colour. Every chart has a legend or direct labels, a hover/focus
 * read-out, and (through ChartCard) a table view of the same numbers.
 */
import { createContext, useContext, useId, useMemo, useState } from 'react'
import Link from 'next/link'
import { Icon } from './Icon'
import { fmtNumber } from '@/portal/format'

export const VIZ = ['var(--viz-1)', 'var(--viz-2)', 'var(--viz-3)', 'var(--viz-4)', 'var(--viz-5)', 'var(--viz-6)', 'var(--viz-7)', 'var(--viz-8)']
const OTHER = 'var(--viz-other)'

export interface Datum { key: string; label: string; value: number }
type Fmt = (n: number) => string

/** When on, every card shows its plain-language explanation and example. */
export const GuideContext = createContext(false)

export function fmtCompact(n: number): string {
  const a = Math.abs(n)
  if (a >= 1_000_000) return `${fmtNumber(Math.round(n / 100_000) / 10)} مليون`
  if (a >= 10_000) return `${fmtNumber(Math.round(n / 1000))} ألف`
  return fmtNumber(n)
}

function niceMax(v: number): number {
  if (v <= 0) return 1
  const pow = Math.pow(10, Math.floor(Math.log10(v)))
  const f = v / pow
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10
  return nice * pow
}

/* ── Explain block ─────────────────────────────────────────────────── */
export interface Explain { what: string; example: string }

export function ExplainBox({ explain }: { explain: Explain }) {
  return (
    <div className="pt-explain" role="note">
      <p><strong>وش يعني؟</strong> {explain.what}</p>
      <p><strong>مثال:</strong> {explain.example}</p>
    </div>
  )
}

/* ── Card wrapper: title, explain toggle, table view ───────────────── */
export function ChartCard({ title, icon, explain, table, action, children, className }: {
  title: string
  icon?: string
  explain?: Explain
  table?: { head: string[]; rows: (string | number)[][] }
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  const guide = useContext(GuideContext)
  const [override, setOverride] = useState<boolean | null>(null)
  const [asTable, setAsTable] = useState(false)
  const showExplain = override ?? guide
  return (
    <section className={`pt-card pt-chart-card ${className ?? ''}`}>
      <header className="pt-card-head">
        <h3 className="pt-card-title">{icon && <Icon name={icon} size={16} />} {title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {action}
          {table && (
            <button type="button" className="pt-btn pt-btn-ghost pt-btn-sm" aria-pressed={asTable} onClick={() => setAsTable(t => !t)} title="عرض الأرقام كجدول">
              <Icon name={asTable ? 'activity' : 'table'} size={14} /> {asTable ? 'رسم' : 'جدول'}
            </button>
          )}
          {explain && (
            <button type="button" className="pt-help-btn" aria-pressed={showExplain} aria-label="اشرح لي هذا" title="اشرح لي هذا" onClick={() => setOverride(!showExplain)}>؟</button>
          )}
        </div>
      </header>
      {explain && showExplain && <ExplainBox explain={explain} />}
      <div className="pt-card-pad">
        {asTable && table ? (
          <div className="pt-table-wrap" style={{ border: 0 }}>
            <table className="pt-table" style={{ minWidth: 0 }}>
              <thead><tr>{table.head.map(h => <th key={h} style={{ cursor: 'default' }}>{h}</th>)}</tr></thead>
              <tbody>{table.rows.map((r, i) => <tr key={i} style={{ cursor: 'default' }}>{r.map((c, j) => <td key={j} className={j > 0 ? 'pt-num' : undefined}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        ) : children}
      </div>
    </section>
  )
}

export function EmptyChart({ text = 'لا بيانات كافية بعد', hint }: { text?: string; hint?: string }) {
  return (
    <div className="pt-empty" style={{ padding: '2rem 1rem' }}>
      <Icon name="activity" />
      <div><div style={{ color: 'var(--pt-text)' }}>{text}</div>{hint && <div style={{ marginTop: '0.25rem' }}>{hint}</div>}</div>
    </div>
  )
}

/* ── Stat tile ─────────────────────────────────────────────────────── */
export function StatTile({ label, value, sub, icon, href, tone, explain }: {
  label: string; value: React.ReactNode; sub?: React.ReactNode; icon?: string; href?: string
  tone?: 'default' | 'good' | 'warn' | 'bad'
  explain?: string
}) {
  const guide = useContext(GuideContext)
  const body = (
    <>
      <span className="pt-stat-label">{icon && <Icon name={icon} size={15} />} {label}</span>
      <span className="pt-tile-value">{value}</span>
      {sub && <span className="pt-stat-sub" data-tone={tone}>{sub}</span>}
      {guide && explain && <span className="pt-tile-explain">{explain}</span>}
    </>
  )
  return href
    ? <Link href={href} className="pt-card pt-stat pt-tile">{body}</Link>
    : <div className="pt-card pt-stat pt-tile">{body}</div>
}

/* ── Donut (part-to-whole, ≤ 6 slices) ─────────────────────────────── */
export function Donut({ data, format = fmtNumber, centerLabel, colors }: { data: Datum[]; format?: Fmt; centerLabel: string; colors?: string[] }) {
  const [hover, setHover] = useState<number | null>(null)
  const slices = data.filter(d => d.value > 0)
  const total = slices.reduce((s, d) => s + d.value, 0)
  if (total <= 0) return <EmptyChart />

  const R = 62, W = 22, C = 2 * Math.PI * R
  const gap = slices.length > 1 ? 2.5 : 0
  let acc = 0
  const colorOf = (d: Datum, i: number) => (d.key === '_other' ? OTHER : (colors ?? VIZ)[i % 8])
  const active = hover !== null ? slices[hover] : null

  return (
    <div className="pt-donut">
      <div className="pt-donut-plot">
        <svg viewBox="0 0 160 160" role="img" aria-label={`${centerLabel}: ${slices.map(s => `${s.label} ${format(s.value)}`).join('، ')}`}>
          <g transform="rotate(-90 80 80)">
            {slices.map((d, i) => {
              const len = (d.value / total) * C
              const dash = Math.max(0.5, len - gap)
              const el = (
                <circle
                  key={d.key}
                  cx="80" cy="80" r={R} fill="none"
                  stroke={colorOf(d, i)} strokeWidth={hover === i ? W + 5 : W}
                  strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={-acc}
                  opacity={hover === null || hover === i ? 1 : 0.35}
                  style={{ transition: 'opacity 0.15s, stroke-width 0.15s', cursor: 'default' }}
                  onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
                />
              )
              acc += len
              return el
            })}
          </g>
        </svg>
        <div className="pt-donut-center" aria-hidden="true">
          <strong>{active ? format(active.value) : format(total)}</strong>
          <span>{active ? `${active.label} · ${Math.round((active.value / total) * 100)}٪` : centerLabel}</span>
        </div>
      </div>
      <ul className="pt-legend-list">
        {slices.map((d, i) => (
          <li key={d.key}>
            <button type="button" data-active={hover === i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)}>
              <i className="pt-swatch" style={{ background: colorOf(d, i) }} />
              <span className="pt-legend-name">{d.label}</span>
              <span className="pt-legend-val">{format(d.value)}</span>
              <span className="pt-legend-pct">{Math.round((d.value / total) * 100)}٪</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── Ranked horizontal bars (one hue; value at the tip) ────────────── */
export function BarList({ rows, format = fmtNumber, color = VIZ[0], max, emptyText }: {
  rows: (Datum & { sub?: string; href?: string })[]
  format?: Fmt
  color?: string
  max?: number
  emptyText?: string
}) {
  const top = max ?? Math.max(0, ...rows.map(r => r.value))
  if (rows.length === 0 || top <= 0) return <EmptyChart text={emptyText} />
  return (
    <div className="pt-barlist" role="list">
      {rows.map(r => {
        const inner = (
          <>
            <span className="pt-barlist-label" title={r.label}>{r.label}</span>
            <span className="pt-barlist-plot">
              <i style={{ width: `${Math.max(r.value > 0 ? 1.5 : 0, (r.value / top) * 100)}%`, background: color }} />
              <span className="pt-barlist-val">{format(r.value)}{r.sub && <small> · {r.sub}</small>}</span>
            </span>
          </>
        )
        return r.href
          ? <Link key={r.key} href={r.href} className="pt-barlist-row" role="listitem">{inner}</Link>
          : <div key={r.key} className="pt-barlist-row" role="listitem">{inner}</div>
      })}
    </div>
  )
}

/* ── Shared plot frame: y ticks + hairline grid ────────────────────── */
function PlotFrame({ max, format, height = 170, children }: { max: number; format: Fmt; height?: number; children: React.ReactNode }) {
  const ticks = [max, max / 2, 0]
  return (
    <div className="pt-plot" style={{ ['--plot-h' as string]: `${height}px` }}>
      <div className="pt-plot-y" aria-hidden="true">{ticks.map(t => <span key={t}>{format(t)}</span>)}</div>
      <div className="pt-plot-area">
        {ticks.map((t, i) => <i key={t} className="pt-gridline" data-base={i === ticks.length - 1} style={{ top: `${(i / (ticks.length - 1)) * 100}%` }} />)}
        {children}
      </div>
    </div>
  )
}

/* ── Grouped columns (≤ 2–3 series over ordered categories) ────────── */
export function Columns({ data, series, format = fmtNumber }: {
  data: { key: string; label: string; values: number[] }[]
  series: string[]
  format?: Fmt
}) {
  const [hover, setHover] = useState<number | null>(null)
  const rawMax = Math.max(0, ...data.flatMap(d => d.values))
  if (rawMax <= 0) return <EmptyChart />
  const max = niceMax(rawMax)
  return (
    <div>
      <div className="pt-legend" style={{ marginBottom: '0.75rem' }}>
        {series.map((s, i) => <span key={s}><i className="pt-swatch" style={{ background: VIZ[i] }} /> {s}</span>)}
      </div>
      <PlotFrame max={max} format={fmtCompact}>
        <div className="pt-cols">
          {data.map((d, gi) => (
            <div key={d.key} className="pt-col-group" tabIndex={0} data-active={hover === gi}
              onMouseEnter={() => setHover(gi)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(gi)} onBlur={() => setHover(null)}
              aria-label={`${d.label}: ${series.map((s, i) => `${s} ${format(d.values[i] ?? 0)}`).join('، ')}`}>
              <div className="pt-col-bars">
                {d.values.map((v, i) => <i key={i} style={{ height: `${(v / max) * 100}%`, background: VIZ[i], opacity: hover === null || hover === gi ? 1 : 0.4 }} />)}
              </div>
              {hover === gi && (
                <div className="pt-tip" role="tooltip">
                  <strong>{d.label}</strong>
                  {series.map((s, i) => <span key={s}><i className="pt-swatch" style={{ background: VIZ[i] }} /> {s}: <b>{format(d.values[i] ?? 0)}</b></span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      </PlotFrame>
      <div className="pt-plot-x" aria-hidden="true">{data.map(d => <span key={d.key}>{d.label}</span>)}</div>
    </div>
  )
}

/* ── Trend (single series over time: line + 10% area wash) ─────────── */
export function Trend({ points, format = fmtNumber, unit = '' }: { points: Datum[]; format?: Fmt; unit?: string }) {
  const [hover, setHover] = useState<number | null>(null)
  const gid = useId()
  const rawMax = Math.max(0, ...points.map(p => p.value))
  const max = niceMax(Math.max(rawMax, 1))
  const n = points.length
  const xy = useMemo(() => points.map((p, i) => ({
    // RTL time axis: oldest on the right, newest on the left
    x: n === 1 ? 50 : 96 - (i * 92) / (n - 1),
    y: 100 - (p.value / max) * 100,
  })), [points, n, max])
  if (n === 0 || rawMax <= 0) return <EmptyChart />
  const line = xy.map(p => `${p.x},${p.y}`).join(' ')
  const area = `${xy[0].x},100 ${line} ${xy[n - 1].x},100`
  const last = n - 1
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - r.left) / r.width) * 100
    let best = 0
    xy.forEach((p, i) => { if (Math.abs(p.x - px) < Math.abs(xy[best].x - px)) best = i })
    setHover(best)
  }
  const shown = hover ?? last
  return (
    <div>
      <PlotFrame max={max} format={fmtCompact} height={150}>
        <div className="pt-trend" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polygon points={area} fill={VIZ[0]} opacity="0.12" />
            <polyline points={line} fill="none" stroke={VIZ[0]} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
          {hover !== null && <i className="pt-crosshair" style={{ left: `${xy[hover].x}%` }} />}
          <i className="pt-trend-dot" style={{ left: `${xy[shown].x}%`, top: `${xy[shown].y}%`, background: VIZ[0] }} />
          <div className="pt-tip" role="status" style={{ left: `${Math.min(88, Math.max(12, xy[shown].x))}%`, top: `${Math.max(0, xy[shown].y - 6)}%`, transform: 'translate(-50%, -100%)', bottom: 'auto' }} key={gid + shown}>
            <strong>{points[shown].label}</strong>
            <span><b>{format(points[shown].value)}</b> {unit}</span>
          </div>
        </div>
      </PlotFrame>
      <div className="pt-plot-x" aria-hidden="true">{points.map((p, i) => <span key={p.key} data-dim={!(i === 0 || i === last || i === Math.floor(last / 2))}>{p.label}</span>)}</div>
    </div>
  )
}

/* ── Meter (one ratio against a limit) ─────────────────────────────── */
export function Meter({ value, caption, target }: { value: number | null; caption?: React.ReactNode; target?: number }) {
  if (value === null) return <span className="pt-dim" style={{ fontSize: '0.8rem' }}>لا بيانات كافية بعد</span>
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className="pt-meter-wrap">
      <div className="pt-meter" role="meter" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
        <i style={{ width: `${v}%` }} />
        {target !== undefined && <b className="pt-meter-target" style={{ insetInlineStart: `${target}%` }} title={`الهدف ${target}٪`} />}
      </div>
      {caption && <div className="pt-meter-caption">{caption}</div>}
    </div>
  )
}

/* ── Stars (read-only, supports fractions) ─────────────────────────── */
export function Stars({ value, size = 16, showNumber }: { value: number | null | undefined; size?: number; showNumber?: boolean }) {
  if (value === null || value === undefined) return <span className="pt-dim" style={{ fontSize: '0.78rem' }}>لم تُقيَّم</span>
  const pct = Math.max(0, Math.min(100, (value / 5) * 100))
  return (
    <span className="pt-stars-wrap" title={`${fmtNumber(value)} من ٥`}>
      <span className="pt-stars" style={{ fontSize: size }} aria-label={`${fmtNumber(value)} من ٥ نجوم`} role="img">
        <span className="pt-stars-bg">★★★★★</span>
        <span className="pt-stars-fg" style={{ width: `${pct}%` }}>★★★★★</span>
      </span>
      {showNumber && <span className="pt-num" style={{ fontSize: size * 0.8 }}>{fmtNumber(value)}</span>}
    </span>
  )
}

/* ── Star input ────────────────────────────────────────────────────── */
export function StarInput({ value, onChange, disabled, size = 28 }: { value: number | null | undefined; onChange: (v: number | null) => void; disabled?: boolean; size?: number }) {
  const [hover, setHover] = useState<number | null>(null)
  const shown = hover ?? value ?? 0
  const labels = ['', 'يحتاج إعادة', 'ضعيف', 'مقبول', 'جيد جداً', 'ممتاز']
  return (
    <div className="pt-star-input" role="radiogroup" aria-label="التقييم من ٥ نجوم">
      <div style={{ display: 'flex', gap: 2 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n} type="button" role="radio" aria-checked={value === n} aria-label={`${n} من ٥ — ${labels[n]}`}
            disabled={disabled} data-on={n <= shown}
            style={{ fontSize: size }}
            onMouseEnter={() => !disabled && setHover(n)} onMouseLeave={() => setHover(null)}
            onFocus={() => !disabled && setHover(n)} onBlur={() => setHover(null)}
            onClick={() => onChange(value === n ? null : n)}
          >★</button>
        ))}
      </div>
      <span className="pt-star-caption">{shown ? `${shown} من ٥ — ${labels[shown]}` : 'اضغط نجمة للتقييم'}</span>
    </div>
  )
}
