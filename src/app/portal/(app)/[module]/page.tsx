import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'
import { getModule } from '@/portal/modules'
import { getCurrentUser, canRead, canWrite } from '@/portal/auth'
import { ModuleView } from '@/components/portal/ModuleView'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params
  return { title: getModule(module)?.label ?? 'نظام هيمنة' }
}

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params
  const def = getModule(module)
  if (!def) notFound()
  const user = await getCurrentUser()
  if (!user) redirect('/portal/login')
  if (!canRead(user.role, def)) redirect('/portal')
  return (
    <Suspense>
      <ModuleView def={def} canWrite={canWrite(user.role, def)} />
    </Suspense>
  )
}
