import { redirect } from 'next/navigation'
import { getCurrentUser, hasAnyUser, signupOpen } from '@/portal/auth'
import { SignupForm } from '@/components/portal/AuthScreens'

export const dynamic = 'force-dynamic'
export const metadata = { title: { absolute: 'طلب انضمام — نظام هيمنة' } }

export default async function SignupPage() {
  if (!(await hasAnyUser())) redirect('/portal/setup')
  if (!signupOpen()) redirect('/portal/login')
  if (await getCurrentUser()) redirect('/portal')
  return <SignupForm />
}
