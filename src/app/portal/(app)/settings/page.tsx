import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/portal/auth'
import { getSettings, SETTINGS_FIELDS } from '@/portal/settings'
import { storageHealth, DATA_DIR } from '@/portal/store'
import { SettingsForm } from '@/components/portal/SettingsForm'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'الإعدادات' }

export default async function SettingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/portal/login')
  if (user.role !== 'admin') redirect('/portal')
  const [settings, health] = await Promise.all([getSettings(), storageHealth()])
  return <SettingsForm fields={SETTINGS_FIELDS} initial={settings} storage={{ ok: health.ok, dir: DATA_DIR, error: health.error }} />
}
