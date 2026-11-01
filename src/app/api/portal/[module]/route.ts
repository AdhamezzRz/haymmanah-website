import { getModule } from '@/portal/modules'
import { store, logActivity } from '@/portal/store'
import { canRead, canWrite, hashPassword } from '@/portal/auth'
import { validateRecord } from '@/portal/schema'
import { json, fail, requireUser, sanitize, recordTitle, readBody } from '@/portal/api'

export const dynamic = 'force-dynamic'

type Ctx = { params: Promise<{ module: string }> }

export async function GET(req: Request, { params }: Ctx) {
  const auth = await requireUser()
  if ('response' in auth) return auth.response
  const { module } = await params
  const def = getModule(module)
  if (!def) return fail('وحدة غير معروفة', 404)
  if (!canRead(auth.user.role, def)) return fail('لا تملك صلاحية العرض', 403)

  const url = new URL(req.url)
  const q = (url.searchParams.get('q') ?? '').trim().toLowerCase()
  let rows = await store.list(def.key)

  // ?status=x or any select field: ?field=value (comma-separated for several)
  for (const f of def.fields) {
    const raw = url.searchParams.get(f.key)
    if (!raw) continue
    const wanted = raw.split(',')
    rows = rows.filter(r => wanted.includes(String(r[f.key] ?? '')))
  }
  if (q) {
    const keys = def.fields.filter(f => f.search).map(f => f.key)
    rows = rows.filter(r => keys.some(k => String(r[k] ?? '').toLowerCase().includes(q)) || String(r.number ?? '').toLowerCase().includes(q))
  }
  return json({ rows: rows.map(r => sanitize(def, r)) })
}

export async function POST(req: Request, { params }: Ctx) {
  const auth = await requireUser()
  if ('response' in auth) return auth.response
  const { module } = await params
  const def = getModule(module)
  if (!def) return fail('وحدة غير معروفة', 404)
  if (!canWrite(auth.user.role, def)) return fail('لا تملك صلاحية الإضافة', 403)

  const body = await readBody(req)
  const { data, errors, ok } = validateRecord(def, body)
  if (!ok) return fail('تحقق من الحقول', 422, { errors })

  // Team: password → hash, email must be unique
  if (def.key === 'team') {
    const pw = String(data.password ?? '')
    delete data.password
    if (pw.length < 8) return fail('تحقق من الحقول', 422, { errors: { password: 'كلمة المرور ٨ أحرف على الأقل' } })
    data.passwordHash = await hashPassword(pw)
    data.email = String(data.email).toLowerCase()
    const dup = (await store.list('team')).some(u => String(u.email).toLowerCase() === data.email)
    if (dup) return fail('تحقق من الحقول', 422, { errors: { email: 'هذا البريد مستخدم مسبقاً' } })
  }
  if (def.numberPrefix) data.number = await store.nextNumber(def.numberPrefix)
  data.createdBy = auth.user.id

  const rec = await store.insert(def.key, data)
  await logActivity({ userId: auth.user.id, userName: auth.user.name, module: def.key, recordId: rec.id, recordTitle: recordTitle(def, rec), action: 'create' })
  return json({ record: sanitize(def, rec) }, { status: 201 })
}
