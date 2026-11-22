/**
 * Embedded document store — server only.
 *
 * Collections are JSON files under DATA_DIR (see resolveDataDir below).
 * Reads are served from an in-memory cache; writes are serialised through a
 * promise queue and persisted atomically (write temp → rename), so a crash
 * mid-write never corrupts a collection.
 *
 * This is deliberately a tiny, dependency-free store sized for a team of
 * tens — the `Store` interface below is the only thing the rest of the portal
 * knows about, so swapping in Postgres/Supabase later is a one-file change.
 */
import { promises as fs, accessSync, constants, cpSync, existsSync, mkdirSync } from 'fs'
import os from 'os'
import path from 'path'
import { randomUUID } from 'crypto'
import type { BaseRecord } from '../schema'

export interface Store {
  list(collection: string): Promise<BaseRecord[]>
  get(collection: string, id: string): Promise<BaseRecord | undefined>
  insert(collection: string, data: Record<string, unknown>): Promise<BaseRecord>
  update(collection: string, id: string, patch: Record<string, unknown>): Promise<BaseRecord | undefined>
  remove(collection: string, id: string): Promise<boolean>
  /** Create-or-replace a record under a fixed id (singletons like settings). */
  upsert(collection: string, id: string, data: Record<string, unknown>): Promise<BaseRecord>
  /** Atomically bump and return a yearly counter, e.g. invoice numbers. */
  nextNumber(prefix: string): Promise<string>
}

/**
 * Where the data lives. Deploying to Hostinger replaces the app folder, which
 * used to wipe `data/portal` (accounts, clients, tasks…) on every release. So in
 * production the default is a folder in the hosting account's home directory,
 * outside the app — `~/haymanah-portal-data` — which deploys never touch. An
 * existing `data/portal` is copied there once. PORTAL_DATA_DIR still wins.
 */
function resolveDataDir(): string {
  if (process.env.PORTAL_DATA_DIR) return process.env.PORTAL_DATA_DIR
  const legacy = path.join(process.cwd(), 'data', 'portal')
  if (process.env.NODE_ENV !== 'production' || process.env.VERCEL) return legacy
  try {
    const home = os.homedir()
    const target = path.join(home, 'haymanah-portal-data')
    if (!home || target.startsWith(process.cwd() + path.sep)) return legacy
    accessSync(home, constants.W_OK)
    if (process.env.NEXT_PHASE !== 'phase-production-build') {
      mkdirSync(target, { recursive: true })
      if (existsSync(path.join(legacy, 'team.json')) && !existsSync(path.join(target, 'team.json'))) {
        cpSync(legacy, target, { recursive: true, force: false, errorOnExist: false })
      }
    }
    return target
  } catch {
    return legacy
  }
}

export const DATA_DIR = resolveDataDir()

type Cache = Map<string, BaseRecord[]>
const g = globalThis as unknown as { __hmCache?: Cache; __hmQueue?: Promise<void> }
const cache: Cache = (g.__hmCache ??= new Map())
let queue: Promise<void> = g.__hmQueue ?? Promise.resolve()

function fileFor(collection: string) {
  if (!/^_?[a-z][a-z0-9_-]*$/i.test(collection)) throw new Error(`bad collection name: ${collection}`)
  return path.join(DATA_DIR, `${collection}.json`)
}

async function load(collection: string): Promise<BaseRecord[]> {
  const hit = cache.get(collection)
  if (hit) return hit
  let rows: BaseRecord[] = []
  try {
    const raw = await fs.readFile(fileFor(collection), 'utf8')
    rows = JSON.parse(raw) as BaseRecord[]
    if (!Array.isArray(rows)) rows = []
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e
  }
  cache.set(collection, rows)
  return rows
}

function persist(collection: string): Promise<void> {
  const rows = cache.get(collection) ?? []
  const json = JSON.stringify(rows, null, 2)
  const run = async () => {
    await fs.mkdir(DATA_DIR, { recursive: true })
    const file = fileFor(collection)
    const tmp = `${file}.${process.pid}.${Date.now()}.tmp`
    await fs.writeFile(tmp, json, 'utf8')
    await fs.rename(tmp, file)
  }
  queue = queue.then(run, run)
  g.__hmQueue = queue
  return queue
}

const now = () => new Date().toISOString()

export const store: Store = {
  async list(collection) {
    return [...(await load(collection))]
  },
  async get(collection, id) {
    return (await load(collection)).find(r => r.id === id)
  },
  async insert(collection, data) {
    const rows = await load(collection)
    const rec: BaseRecord = { ...data, id: randomUUID(), createdAt: now(), updatedAt: now() }
    rows.push(rec)
    await persist(collection)
    return rec
  },
  async update(collection, id, patch) {
    const rows = await load(collection)
    const i = rows.findIndex(r => r.id === id)
    if (i < 0) return undefined
    const next: BaseRecord = { ...rows[i], ...patch, id, createdAt: rows[i].createdAt, updatedAt: now() }
    rows[i] = next
    await persist(collection)
    return next
  },
  async remove(collection, id) {
    const rows = await load(collection)
    const i = rows.findIndex(r => r.id === id)
    if (i < 0) return false
    rows.splice(i, 1)
    await persist(collection)
    return true
  },
  async upsert(collection, id, data) {
    const rows = await load(collection)
    const i = rows.findIndex(r => r.id === id)
    const rec: BaseRecord = i >= 0
      ? { ...rows[i], ...data, id, createdAt: rows[i].createdAt, updatedAt: now() }
      : { ...data, id, createdAt: now(), updatedAt: now() }
    if (i >= 0) rows[i] = rec; else rows.push(rec)
    await persist(collection)
    return rec
  },
  async nextNumber(prefix) {
    const year = new Date().getFullYear()
    const rows = await load('_counters')
    const key = `${prefix}-${year}`
    let rec = rows.find(r => r.id === key)
    if (!rec) {
      rec = { id: key, createdAt: now(), updatedAt: now(), value: 0 }
      rows.push(rec)
    }
    rec.value = (Number(rec.value) || 0) + 1
    rec.updatedAt = now()
    await persist('_counters')
    return `${prefix}-${year}-${String(rec.value).padStart(4, '0')}`
  },
}

/** Can we actually write to the data directory on this host? */
export async function storageHealth(): Promise<{ ok: boolean; dir: string; error?: string }> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    const probe = path.join(DATA_DIR, '.write-probe')
    await fs.writeFile(probe, String(Date.now()))
    await fs.unlink(probe)
    return { ok: true, dir: DATA_DIR }
  } catch (e) {
    return { ok: false, dir: DATA_DIR, error: (e as Error).message }
  }
}

/* ── Activity log (append-only, capped) ───────────────────────────── */

export interface Activity {
  id: string
  at: string
  userId: string
  userName: string
  module: string
  recordId: string
  recordTitle: string
  action: 'create' | 'update' | 'delete' | 'login' | 'setup'
  summary?: string
}

export async function logActivity(a: Omit<Activity, 'id' | 'at'>) {
  const rows = (await load('_activity')) as unknown as Activity[]
  rows.unshift({ ...a, id: randomUUID(), at: now() })
  if (rows.length > 2000) rows.length = 2000
  await persist('_activity')
}

export async function recentActivity(limit = 30): Promise<Activity[]> {
  const rows = (await load('_activity')) as unknown as Activity[]
  return rows.slice(0, limit)
}
