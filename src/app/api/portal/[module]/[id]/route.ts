import { getModule } from '@/portal/modules'
import { store, logActivity } from '@/portal/store'
import { canRead, canWrite, hashPassword } from '@/portal/auth'
import { validateRecord } from '@/portal/schema'
import { json, fail, requireUser, sanitize, recordTitle, readBody } from '@/portal/api'
import { beforeSave, afterSave } from '@/portal/hooks'

export const dynamic = 'force-dynamic'

type Ctx = { params: Promise<{ module: string; id: string }> }

export async function GET(_req: Request, { params }: Ctx) {
  const auth = await requireUser()
  if ('response' in auth) return auth.response
  const { module, id } = await params
  const def = getModule(module)
  if (!def) return fail('وحدة غير معروفة', 404)
  if (!canRead(auth.user.role, def)) return fail('لا تملك صلاحية العرض', 403)
  const rec = await store.get(def.key, id)
  if (!rec) return fail('السجل غير موجود', 404)
  return json({ record: sanitize(def, rec) })
}

export async function PATCH(req: Request, { params }: Ctx) {
  const auth = await requireUser()
  if ('response' in auth) return auth.response
  const { module, id } = await params
  const def = getModule(module)
  if (!def) return fail('وحدة غير معروفة', 404)
  // Members may always edit their own profile basics; otherwise module write permission applies.
  const selfEdit = def.key === 'team' && id === auth.user.id
  if (!canWrite(auth.user.role, def) && !selfEdit) return fail('لا تملك صلاحية التعديل', 403)
  const existing = await store.get(def.key, id)
  if (!existing) return fail('السجل غير موجود', 404)

  const body = await readBody(req)
  if (selfEdit && !canWrite(auth.user.role, def)) {
    // a member can't promote themselves or toggle their own activation
    delete body.role; delete body.active
  }
  const { data, errors, ok } = validateRecord(def, body, true, auth.user.role)
  if (!ok) return fail('تحقق من الحقول', 422, { errors })
  const changedKeys = Object.keys(data)
  const hookErrors = beforeSave(def, data, existing, auth.user)
  if (hookErrors) return fail('تحقق من الحقول', 422, { errors: hookErrors })

  if (def.key === 'team') {
    const pw = String(data.password ?? '')
    delete data.password
    if (pw) {
      if (pw.length < 8) return fail('تحقق من الحقول', 422, { errors: { password: 'كلمة المرور ٨ أحرف على الأقل' } })
      data.passwordHash = await hashPassword(pw)
    }
    if (data.email) {
      data.email = String(data.email).toLowerCase()
      const dup = (await store.list('team')).some(u => u.id !== id && String(u.email).toLowerCase() === data.email)
      if (dup) return fail('تحقق من الحقول', 422, { errors: { email: 'هذا البريد مستخدم مسبقاً' } })
    }
    // never let the last admin demote/deactivate themselves
    if (existing.role === 'admin' && (data.role && data.role !== 'admin' || data.active === false)) {
      const admins = (await store.list('team')).filter(u => u.role === 'admin' && u.active !== false)
      if (admins.length <= 1) return fail('لا يمكن تعطيل آخر مدير في النظام', 409)
    }
  }
  delete data.number // auto numbers are immutable

  const rec = await store.update(def.key, id, data)
  if (!rec) return fail('السجل غير موجود', 404)
  await afterSave(def, rec, existing, auth.user)
  const changed = changedKeys.map(k => def.fields.find(f => f.key === k)?.label ?? k)
  await logActivity({ userId: auth.user.id, userName: auth.user.name, module: def.key, recordId: id, recordTitle: recordTitle(def, rec), action: 'update', summary: changed.slice(0, 4).join('، ') + (changed.length > 4 ? '…' : '') })
  return json({ record: sanitize(def, rec) })
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const auth = await requireUser()
  if ('response' in auth) return auth.response
  const { module, id } = await params
  const def = getModule(module)
  if (!def) return fail('وحدة غير معروفة', 404)
  if (!canWrite(auth.user.role, def)) return fail('لا تملك صلاحية الحذف', 403)
  const existing = await store.get(def.key, id)
  if (!existing) return fail('السجل غير موجود', 404)
  if (def.key === 'team') {
    if (id === auth.user.id) return fail('لا يمكنك حذف حسابك وأنت مسجّل الدخول به', 409)
    if (existing.role === 'admin') {
      const admins = (await store.list('team')).filter(u => u.role === 'admin' && u.active !== false)
      if (admins.length <= 1) return fail('لا يمكن حذف آخر مدير في النظام', 409)
    }
  }
  await store.remove(def.key, id)
  await logActivity({ userId: auth.user.id, userName: auth.user.name, module: def.key, recordId: id, recordTitle: recordTitle(def, existing), action: 'delete' })
  return json({ ok: true })
}
