import { peekToken } from '@/portal/tokens'
import { store } from '@/portal/store'
import { ResetForm } from '@/components/portal/AuthScreens'

export const dynamic = 'force-dynamic'
export const metadata = { title: { absolute: 'كلمة مرور جديدة — نظام هيمنة' }, referrer: 'no-referrer' }

export default async function ResetPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams
  const info = await peekToken(token, ['reset', 'invite'])
  const user = info?.userId ? await store.get('team', info.userId) : undefined
  return <ResetForm token={token} valid={!!info && !!user} name={user ? String(user.name) : undefined} purpose={info?.purpose === 'invite' ? 'invite' : 'reset'} />
}
