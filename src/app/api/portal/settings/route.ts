import { store, logActivity } from '@/portal/store'
import { json, fail, requireUser, readBody } from '@/portal/api'
import { getSettings, SETTINGS_FIELDS } from '@/portal/settings'

export const dynamic = 'force-dynamic'

export async function GET() {
  const auth = await requireUser()
  if ('response' in auth) return auth.response
  return json({ settings: await getSettings() })
}

export async function PUT(req: Request) {
  const auth = await requireUser()
  if ('response' in auth) return auth.response
  if (auth.user.role !== 'admin') return fail('الإعدادات للمدير فقط', 403)
  const body = await readBody(req)
  const patch: Record<string, unknown> = {}
  for (const f of SETTINGS_FIELDS) {
    if (!(f.key in body)) continue
    const v = body[f.key]
    patch[f.key] = f.type === 'number' || f.type === 'percent' ? (v === '' || v === null ? null : Number(v)) : String(v ?? '').trim()
  }
  const rec = await store.upsert('_settings', 'company', patch)
  await logActivity({ userId: auth.user.id, userName: auth.user.name, module: 'settings', recordId: 'company', recordTitle: 'إعدادات المنشأة', action: 'update' })
  return json({ settings: rec })
}
