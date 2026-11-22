import { redirect } from 'next/navigation'
import { hasAnyUser } from '@/portal/auth'
import { RecoverForm } from '@/components/portal/AuthScreens'

export const dynamic = 'force-dynamic'
export const metadata = { title: { absolute: 'استعادة دخول المدير — نظام هيمنة' } }

export default async function RecoverPage() {
  if (!(await hasAnyUser())) redirect('/portal/setup')
  return <RecoverForm />
}
