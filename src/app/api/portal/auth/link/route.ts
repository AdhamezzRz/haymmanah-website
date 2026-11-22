import { store, logActivity } from '@/portal/store'
import { issueToken } from '@/portal/tokens'
import { json, fail, requireUser, readBody } from '@/portal/api'

export const dynamic = 'force-dynamic'

/**
 * Admin: create a one-time link for a team member to choose a password —
 * an invite if they never had one, a reset otherwise. Send it on WhatsApp.
 */
export async function POST(req: Request) {
  const auth = await requireUser()
  if ('response' in auth) return auth.response
  if (auth.user.role !== 'admin') return fail('للمدير فقط', 403)
  const { userId } = await readBody(req)
  const member = typeof userId === 'string' ? await store.get('team', userId) : undefined
  if (!member) return fail('العضو غير موجود', 404)
  const purpose = member.passwordHash ? 'reset' : 'invite'
  const { token, expiresAt } = await issueToken(purpose, member.id)
  await logActivity({ userId: auth.user.id, userName: auth.user.name, module: 'team', recordId: member.id, recordTitle: String(member.name), action: 'update', summary: purpose === 'invite' ? 'أنشأ رابط دعوة' : 'أنشأ رابط إعادة تعيين كلمة المرور' })
  return json({ path: `/portal/reset?token=${token}`, expiresAt, purpose })
}
