import { notFound, redirect } from 'next/navigation'
import { getModule } from '@/portal/modules'
import { getCurrentUser, canRead, canWrite } from '@/portal/auth'
import { store } from '@/portal/store'
import { sanitize } from '@/portal/api'
import { RecordDetail } from '@/components/portal/RecordDetail'

export const dynamic = 'force-dynamic'

export default async function RecordPage({ params }: { params: Promise<{ module: string; id: string }> }) {
  const { module, id } = await params
  const def = getModule(module)
  if (!def) notFound()
  const user = await getCurrentUser()
  if (!user) redirect('/portal/login')
  if (!canRead(user.role, def)) redirect('/portal')
  const rec = await store.get(def.key, id)
  if (!rec) notFound()
  const selfEdit = def.key === 'team' && id === user.id
  return <RecordDetail def={def} id={id} initial={sanitize(def, rec)} canWrite={canWrite(user.role, def) || selfEdit} role={user.role} />
}
