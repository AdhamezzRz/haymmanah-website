import { redirect } from 'next/navigation'
import { hasAnyUser } from '@/portal/auth'
import { storageHealth } from '@/portal/store'
import { ensureSetupCode, displayPath, SETUP_FILE } from '@/portal/tokens'
import { SetupForm } from '@/components/portal/AuthScreens'

export const dynamic = 'force-dynamic'

export default async function SetupPage() {
  if (await hasAnyUser()) redirect('/portal/login')
  const health = await storageHealth()
  if (health.ok) await ensureSetupCode()
  return <SetupForm storageError={health.ok ? undefined : `${health.dir}: ${health.error}`} codeFile={health.ok ? displayPath(SETUP_FILE) : undefined} />
}
