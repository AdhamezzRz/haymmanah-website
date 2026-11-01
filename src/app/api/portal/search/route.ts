import { modules, getModule } from '@/portal/modules'
import { store } from '@/portal/store'
import { canRead } from '@/portal/auth'
import { json, requireUser, recordTitle } from '@/portal/api'
import { fieldByKey, optionLabel } from '@/portal/schema'

export const dynamic = 'force-dynamic'

/** Cross-module search for ⌘K: returns up to 6 hits per module. */
export async function GET(req: Request) {
  const auth = await requireUser()
  if ('response' in auth) return auth.response
  const q = (new URL(req.url).searchParams.get('q') ?? '').trim().toLowerCase()
  if (q.length < 1) return json({ hits: [] })
  const hits: { module: string; moduleLabel: string; id: string; title: string; subtitle?: string }[] = []
  // resolve relation subtitles (client name, project title…) to human labels
  const titleCache = new Map<string, Map<string, string>>()
  const titleOf = async (module: string, id: string) => {
    if (!titleCache.has(module)) {
      const d = getModule(module)
      const m = new Map<string, string>()
      for (const r of await store.list(module)) m.set(r.id, String(r[d?.titleField ?? 'name'] ?? r.number ?? ''))
      titleCache.set(module, m)
    }
    return titleCache.get(module)!.get(id)
  }
  for (const def of modules) {
    if (!canRead(auth.user.role, def)) continue
    const keys = def.fields.filter(f => f.search).map(f => f.key)
    const rows = await store.list(def.key)
    let n = 0
    for (const r of rows) {
      if (n >= 6) break
      if (keys.some(k => String(r[k] ?? '').toLowerCase().includes(q)) || String(r.number ?? '').toLowerCase().includes(q)) {
        const subField = def.subtitleField ? fieldByKey(def, def.subtitleField) : undefined
        const raw = subField ? r[subField.key] : undefined
        let subtitle: string | undefined
        if (subField && raw) {
          if (subField.type === 'relation') subtitle = await titleOf(subField.relation!, String(raw))
          else if (subField.type === 'select') subtitle = optionLabel(subField, raw)
          else subtitle = String(raw)
        }
        hits.push({ module: def.key, moduleLabel: def.label, id: r.id, title: recordTitle(def, r), subtitle })
        n++
      }
    }
  }
  return json({ hits })
}
