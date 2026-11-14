import { json, fail, requireUser } from '@/portal/api'
import { seedDemo, clearDemo, demoCount } from '@/portal/demo'
import { logActivity } from '@/portal/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const auth = await requireUser()
  if ('response' in auth) return auth.response
  return json({ count: await demoCount() })
}

/** Load clearly-labelled sample data so the team can explore every chart. Admin only. */
export async function POST() {
  const auth = await requireUser()
  if ('response' in auth) return auth.response
  if (auth.user.role !== 'admin') return fail('للمدير فقط', 403)
  if ((await demoCount()) > 0) return fail('البيانات التجريبية محمّلة مسبقاً — احذفها أولاً لإعادة التحميل', 409)
  const count = await seedDemo(auth.user)
  await logActivity({ userId: auth.user.id, userName: auth.user.name, module: 'settings', recordId: 'demo', recordTitle: 'بيانات تجريبية', action: 'create', summary: `${count} سجل` })
  return json({ count })
}

export async function DELETE() {
  const auth = await requireUser()
  if ('response' in auth) return auth.response
  if (auth.user.role !== 'admin') return fail('للمدير فقط', 403)
  const removed = await clearDemo()
  await logActivity({ userId: auth.user.id, userName: auth.user.name, module: 'settings', recordId: 'demo', recordTitle: 'بيانات تجريبية', action: 'delete', summary: `${removed} سجل` })
  return json({ removed })
}
