import Link from 'next/link'

export default function PortalNotFound() {
  return (
    <div className="pt-card pt-card-pad" style={{ maxWidth: 520, margin: '4rem auto', textAlign: 'center' }}>
      <h1 className="pt-h1" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>هذا السجل غير موجود</h1>
      <p className="pt-lead" style={{ margin: '0 auto 1.25rem' }}>ربما حُذف، أو الرابط غير صحيح.</p>
      <Link href="/portal" className="pt-btn pt-btn-primary">العودة للوحة التحكم</Link>
    </div>
  )
}
