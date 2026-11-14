'use client'

import { useEffect } from 'react'
import Link from 'next/link'

/** Any unexpected error inside the portal lands here instead of a blank screen. */
export default function PortalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('[portal]', error) }, [error])
  return (
    <div className="pt-card pt-card-pad" style={{ maxWidth: 560, margin: '4rem auto', textAlign: 'center' }}>
      <h1 className="pt-h1" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>حدث خطأ غير متوقع</h1>
      <p className="pt-lead" style={{ margin: '0 auto 1.25rem' }}>بياناتك بأمان — لم يُحفظ أي تغيير ناقص. جرّب مرة أخرى، وإن تكرر أخبر مدير النظام.</p>
      {error.digest && <p className="pt-dim" dir="ltr" style={{ fontSize: '0.7rem', marginBottom: '1rem' }}>ref: {error.digest}</p>}
      <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center' }}>
        <button type="button" className="pt-btn pt-btn-primary" onClick={reset}>حاول مرة أخرى</button>
        <Link href="/portal" className="pt-btn">لوحة التحكم</Link>
      </div>
    </div>
  )
}
