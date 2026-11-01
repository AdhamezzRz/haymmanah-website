import { redirect } from 'next/navigation'
import { hasAnyUser } from '@/portal/auth'
import { storageHealth } from '@/portal/store'
import { AuthForm } from '@/components/portal/AuthForm'

export const dynamic = 'force-dynamic'

export default async function SetupPage() {
  if (await hasAnyUser()) redirect('/portal/login')
  const health = await storageHealth()
  return <AuthForm mode="setup" storageError={health.ok ? undefined : `${health.dir}: ${health.error}`} />
}
