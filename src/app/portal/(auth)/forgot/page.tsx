import { redirect } from 'next/navigation'
import { hasAnyUser } from '@/portal/auth'
import { mailEnabled } from '@/portal/mail'
import { ForgotForm } from '@/components/portal/AuthScreens'

export const dynamic = 'force-dynamic'
export const metadata = { title: { absolute: 'نسيت كلمة المرور — نظام هيمنة' } }

export default async function ForgotPage() {
  if (!(await hasAnyUser())) redirect('/portal/setup')
  return <ForgotForm mailEnabled={mailEnabled()} />
}
