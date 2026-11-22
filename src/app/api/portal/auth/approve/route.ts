import { store, logActivity } from '@/portal/store'
import { json, fail, requireUser, readBody } from '@/portal/api'
import type { Role } from '@/portal/schema'

export const dynamic = 'force-dynamic'

/** Admin: accept ({ approve: true, role? }) or reject ({ approve: false }) a join request. */
export async function POST(req: Request) {
  const auth = await requireUser()
  if ('response' in auth) return auth.response
  if (auth.user.role !== 'admin') return fail('للمدير فقط', 403)
  const { userId, approve, role } = await readBody(req)
  const member = typeof userId === 'string' ? await store.get('team', userId) : undefined
  if (!member || member.joinStatus !== 'pending') return fail('لا يوجد طلب انضمام بهذا المعرّف', 404)

  if (approve === true) {
    const r: Role = role === 'manager' || role === 'admin' ? role : 'member'
    await store.update('team', member.id, { active: true, joinStatus: '', role: r })
    await logActivity({ userId: auth.user.id, userName: auth.user.name, module: 'team', recordId: member.id, recordTitle: String(member.name), action: 'update', summary: 'قبل طلب الانضمام' })
    return json({ ok: true, approved: true })
  }
  await store.remove('team', member.id)
  await logActivity({ userId: auth.user.id, userName: auth.user.name, module: 'team', recordId: member.id, recordTitle: String(member.name), action: 'delete', summary: 'رفض طلب الانضمام' })
  return json({ ok: true, approved: false })
}
