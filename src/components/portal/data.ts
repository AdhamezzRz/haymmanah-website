'use client'

/**
 * Tiny client data layer for the portal: fetch + cache + optimistic-friendly
 * mutations, no external dependency. Every list lives in one shared cache so
 * relation pickers, boards and tables stay in sync after any write.
 */
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import type { BaseRecord } from '@/portal/schema'

type Listener = () => void
const cache = new Map<string, BaseRecord[]>()
const inflight = new Map<string, Promise<BaseRecord[]>>()
const listeners = new Set<Listener>()
const emit = () => listeners.forEach(l => l())

export class ApiError extends Error {
  status: number
  errors?: Record<string, string>
  constructor(message: string, status: number, errors?: Record<string, string>) {
    super(message); this.status = status; this.errors = errors
  }
}

export async function api<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/portal${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    cache: 'no-store',
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') window.location.href = '/portal/login'
    throw new ApiError(body.error ?? 'حدث خطأ غير متوقع', res.status, body.errors)
  }
  return body as T
}

export function invalidate(module?: string) {
  if (module) cache.delete(module)
  else cache.clear()
  emit()
}

async function fetchList(module: string): Promise<BaseRecord[]> {
  const hit = inflight.get(module)
  if (hit) return hit
  const p = api<{ rows: BaseRecord[] }>(`/${module}`).then(r => {
    cache.set(module, r.rows)
    inflight.delete(module)
    emit()
    return r.rows
  }).catch(e => { inflight.delete(module); throw e })
  inflight.set(module, p)
  return p
}

const subscribe = (l: Listener) => { listeners.add(l); return () => { listeners.delete(l) } }

/** All records of a module (cached, shared). `undefined` while loading the first time. */
export function useRecords(module: string | undefined) {
  const rows = useSyncExternalStore(subscribe, () => (module ? cache.get(module) : undefined), () => undefined)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    if (!module || cache.has(module)) return
    fetchList(module).catch(e => setError((e as Error).message))
  }, [module, rows])
  const refresh = useCallback(() => { if (module) { cache.delete(module); return fetchList(module) } }, [module])
  return { rows, loading: !!module && rows === undefined && !error, error, refresh }
}

/** Lookup map id → record for a module (for relation labels). */
export function useLookup(module: string | undefined) {
  const { rows } = useRecords(module)
  const map = new Map<string, BaseRecord>()
  rows?.forEach(r => map.set(r.id, r))
  return map
}

export async function createRecord(module: string, data: Record<string, unknown>) {
  const r = await api<{ record: BaseRecord }>(`/${module}`, { method: 'POST', body: JSON.stringify(data) })
  const list = cache.get(module)
  if (list) cache.set(module, [...list, r.record])
  emit()
  return r.record
}

export async function updateRecord(module: string, id: string, patch: Record<string, unknown>) {
  // optimistic
  const list = cache.get(module)
  const prev = list?.find(x => x.id === id)
  if (list && prev) { cache.set(module, list.map(x => (x.id === id ? { ...x, ...patch } : x))); emit() }
  try {
    const r = await api<{ record: BaseRecord }>(`/${module}/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })
    const l2 = cache.get(module)
    if (l2) cache.set(module, l2.map(x => (x.id === id ? r.record : x)))
    emit()
    return r.record
  } catch (e) {
    if (list && prev) { cache.set(module, list); emit() }
    throw e
  }
}

export async function deleteRecord(module: string, id: string) {
  await api(`/${module}/${id}`, { method: 'DELETE' })
  const list = cache.get(module)
  if (list) cache.set(module, list.filter(x => x.id !== id))
  emit()
}
