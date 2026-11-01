/**
 * Saudi-first formatting helpers (safe in both server and client code).
 * Dates show Gregorian with a Hijri (Umm al-Qura) companion; money is SAR.
 * Digits default to Latin for scan-ability in tables; labels stay Arabic.
 */

const TZ = 'Asia/Riyadh'

export function fmtMoney(n: unknown, opts: { digits?: number } = {}): string {
  const v = typeof n === 'number' ? n : Number(n)
  if (!Number.isFinite(v)) return '—'
  const s = new Intl.NumberFormat('ar-SA-u-nu-latn', {
    minimumFractionDigits: opts.digits ?? (Number.isInteger(v) ? 0 : 2),
    maximumFractionDigits: 2,
  }).format(v)
  return `${s} ر.س`
}

export function fmtNumber(n: unknown): string {
  const v = typeof n === 'number' ? n : Number(n)
  if (!Number.isFinite(v)) return '—'
  return new Intl.NumberFormat('ar-SA-u-nu-latn', { maximumFractionDigits: 2 }).format(v)
}

function toDate(v: unknown): Date | null {
  if (!v) return null
  const d = v instanceof Date ? v : new Date(String(v))
  return Number.isNaN(d.getTime()) ? null : d
}

export function fmtDate(v: unknown, style: 'short' | 'long' = 'short'): string {
  const d = toDate(v)
  if (!d) return '—'
  return new Intl.DateTimeFormat('ar-SA-u-nu-latn-ca-gregory', {
    timeZone: TZ,
    day: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    year: 'numeric',
  }).format(d)
}

export function fmtDateTime(v: unknown): string {
  const d = toDate(v)
  if (!d) return '—'
  return new Intl.DateTimeFormat('ar-SA-u-nu-latn-ca-gregory', {
    timeZone: TZ, day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit',
  }).format(d)
}

export function fmtHijri(v: unknown, style: 'short' | 'long' = 'long'): string {
  const d = toDate(v)
  if (!d) return ''
  return new Intl.DateTimeFormat('ar-SA-u-nu-latn-ca-islamic-umalqura', {
    timeZone: TZ, day: 'numeric', month: style === 'long' ? 'long' : 'short', year: 'numeric',
  }).format(d)
}

export function fmtTime(v: unknown): string {
  const d = toDate(v)
  if (!d) return ''
  return new Intl.DateTimeFormat('ar-SA-u-nu-latn', { timeZone: TZ, hour: 'numeric', minute: '2-digit' }).format(d)
}

export function fmtRelative(v: unknown): string {
  const d = toDate(v)
  if (!d) return ''
  const diff = (d.getTime() - Date.now()) / 1000
  const rtf = new Intl.RelativeTimeFormat('ar', { numeric: 'auto' })
  const abs = Math.abs(diff)
  if (abs < 60) return rtf.format(Math.round(diff), 'second')
  if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute')
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hour')
  if (abs < 86400 * 30) return rtf.format(Math.round(diff / 86400), 'day')
  return rtf.format(Math.round(diff / (86400 * 30)), 'month')
}

/** YYYY-MM-DD in Riyadh time — for <input type="date"> and day keys. */
export function dayKey(v: unknown = new Date()): string {
  const d = toDate(v) ?? new Date()
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(d)
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? ''
  return `${get('year')}-${get('month')}-${get('day')}`
}

export function isOverdue(v: unknown): boolean {
  const d = toDate(v)
  return !!d && dayKey(d) < dayKey()
}

export function daysUntil(v: unknown): number | null {
  const d = toDate(v)
  if (!d) return null
  const a = new Date(dayKey(d)).getTime(), b = new Date(dayKey()).getTime()
  return Math.round((a - b) / 86400000)
}

export const ARABIC_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
export const ARABIC_WEEKDAYS_SHORT = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']

export function initials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0] ?? '').join('')
}
