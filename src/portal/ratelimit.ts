/**
 * In-memory attempt limiter — server only. Good enough for a single Node
 * process (the Hostinger app); resets on restart, which only ever helps a
 * legitimate user who locked themselves out.
 */
type Bucket = number[]
const g = globalThis as unknown as { __hmRL?: Map<string, Bucket> }
const buckets: Map<string, Bucket> = (g.__hmRL ??= new Map())

function fresh(key: string, windowMs: number): Bucket {
  const now = Date.now()
  const b = (buckets.get(key) ?? []).filter(t => now - t < windowMs)
  buckets.set(key, b)
  if (buckets.size > 5000) {
    // keep memory bounded: drop the oldest keys
    for (const k of [...buckets.keys()].slice(0, 1000)) buckets.delete(k)
  }
  return b
}

/** Seconds until another attempt is allowed, or 0 if allowed now. */
export function limitWait(key: string, max: number, windowMs: number): number {
  const b = fresh(key, windowMs)
  if (b.length < max) return 0
  return Math.max(1, Math.ceil((b[0] + windowMs - Date.now()) / 1000))
}

export function limitHit(key: string, windowMs: number) {
  fresh(key, windowMs).push(Date.now())
}

export function limitReset(key: string) {
  buckets.delete(key)
}

export function waitMessage(seconds: number) {
  const m = Math.ceil(seconds / 60)
  return m <= 1 ? 'محاولات كثيرة — حاول بعد دقيقة' : `محاولات كثيرة — حاول بعد ${m} دقيقة`
}
