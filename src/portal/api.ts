/**
 * Shared helpers for portal route handlers — server only.
 */
import { NextResponse } from 'next/server'
import { getCurrentUser, type PortalUser } from './auth'
import type { ModuleDef, BaseRecord } from './schema'

export function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, { ...init, headers: { 'Cache-Control': 'no-store', ...(init?.headers ?? {}) } })
}

export function fail(message: string, status = 400, extra?: Record<string, unknown>) {
  return json({ error: message, ...extra }, { status })
}

export async function requireUser(): Promise<{ user: PortalUser } | { response: NextResponse }> {
  const user = await getCurrentUser()
  if (!user) return { response: fail('يلزم تسجيل الدخول', 401) }
  return { user }
}

/** Never leak password hashes (or any write-only field) to the client. */
export function sanitize(def: ModuleDef, rec: BaseRecord): BaseRecord {
  const out: BaseRecord = { ...rec }
  for (const f of def.fields) if (f.type === 'password') delete out[f.key]
  if (def.key === 'team') out.hasPassword = !!rec.passwordHash
  delete out.passwordHash
  delete out.sessionVersion
  return out
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  return (fwd?.split(',')[0] || req.headers.get('x-real-ip') || 'local').trim().slice(0, 64)
}

/** Public base URL for links in emails (env override, then proxy headers). */
export function publicOrigin(req: Request): string {
  if (process.env.PORTAL_PUBLIC_URL) return process.env.PORTAL_PUBLIC_URL.replace(/\/$/, '')
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host')
  const proto = req.headers.get('x-forwarded-proto') || (host?.startsWith('localhost') ? 'http' : 'https')
  return host ? `${proto.split(',')[0]}://${host.split(',')[0]}` : new URL(req.url).origin
}

export function recordTitle(def: ModuleDef, rec: Record<string, unknown>): string {
  const v = rec[def.titleField]
  return v ? String(v) : rec.number ? String(rec.number) : def.singular
}

export async function readBody(req: Request): Promise<Record<string, unknown>> {
  try {
    const b = await req.json()
    return b && typeof b === 'object' ? (b as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}
