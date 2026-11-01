import { redirect } from 'next/navigation'
import { getCurrentUser, hasAnyUser } from '@/portal/auth'
import { AuthForm } from '@/components/portal/AuthForm'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  if (!(await hasAnyUser())) redirect('/portal/setup')
  if (await getCurrentUser()) redirect('/portal')
  return <AuthForm mode="login" />
}
