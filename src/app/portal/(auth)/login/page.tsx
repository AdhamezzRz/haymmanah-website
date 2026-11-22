import { redirect } from 'next/navigation'
import { getCurrentUser, hasAnyUser, signupOpen } from '@/portal/auth'
import { LoginForm } from '@/components/portal/AuthScreens'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  if (!(await hasAnyUser())) redirect('/portal/setup')
  if (await getCurrentUser()) redirect('/portal')
  return <LoginForm signupOpen={signupOpen()} />
}
