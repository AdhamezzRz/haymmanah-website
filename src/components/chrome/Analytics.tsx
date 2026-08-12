'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { CONSENT_KEY, CONSENT_EVENT, type ConsentValue } from './CookieConsent'

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

/**
 * Loads GA4 / Meta Pixel only once the visitor has accepted the cookie
 * banner, and only if the corresponding env var is actually set. Both are
 * no-ops until those two conditions are met — safe to ship even with
 * empty env vars.
 */
export function Analytics() {
  const [consent, setConsent] = useState<ConsentValue | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY) as ConsentValue | null
    setConsent(stored)

    const onChange = (e: Event) => setConsent((e as CustomEvent<ConsentValue>).detail)
    window.addEventListener(CONSENT_EVENT, onChange)
    return () => window.removeEventListener(CONSENT_EVENT, onChange)
  }, [])

  if (consent !== 'accepted') return null

  return (
    <>
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');`}
          </Script>
        </>
      )}
      {META_PIXEL_ID && (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');`}
        </Script>
      )}
    </>
  )
}
