'use client'

import { useCallback, useEffect, useState } from 'react'
import { isNationalDayActive, NATIONAL_DAY_EDITION } from '@/lib/nationalDay'
import { PixelSky } from './PixelSky'
import { NationalIntro } from './NationalIntro'

const RIBBON_KEY = 'haymanah-nd-ribbon'
const INTRO_KEY = 'haymanah-nd-intro'
const RIBBON_H = 32

const ribbonItems = [
  'عِزّنا بطبعنا',
  `اليوم الوطني السعودي ${NATIONAL_DAY_EDITION.toLocaleString('ar-EG')}`,
  'نَصنع الهيمنة، لا نُطاردها',
  '٢٣ سبتمبر',
]

/**
 * Orchestrates the National Day theme. Renders nothing unless the pre-paint head
 * script turned the theme on (`data-national` on <html>), so server and first
 * client render always agree.
 */
export function NationalDay() {
  const [active, setActive] = useState(false)
  const [ribbon, setRibbon] = useState(false)
  const [intro, setIntro] = useState(false)

  useEffect(() => {
    if (!isNationalDayActive()) return
    setActive(true)

    let ribbonOn = true
    try { ribbonOn = sessionStorage.getItem(RIBBON_KEY) !== '0' } catch { /* private mode */ }
    setRibbon(ribbonOn)

    // Play the intro once per session, right after the site preloader lets go.
    let introSeen = false
    try { introSeen = sessionStorage.getItem(INTRO_KEY) === '1' } catch { /* private mode */ }
    let timer = 0
    if (!introSeen) {
      const waitForPreloader = () => {
        let loaded = false
        try { loaded = sessionStorage.getItem('haymanah-loaded') === '1' } catch { loaded = true }
        if (loaded) setIntro(true)
        else timer = window.setTimeout(waitForPreloader, 120)
      }
      waitForPreloader()
    }
    return () => window.clearTimeout(timer)
  }, [])

  // The ribbon pushes the fixed chrome (nav, scroll bar, sticky filters) down by its height.
  useEffect(() => {
    if (!active) return
    document.documentElement.style.setProperty('--nd-offset', ribbon ? `${RIBBON_H}px` : '0px')
    return () => { document.documentElement.style.removeProperty('--nd-offset') }
  }, [active, ribbon])

  const closeRibbon = () => {
    setRibbon(false)
    try { sessionStorage.setItem(RIBBON_KEY, '0') } catch { /* private mode */ }
  }
  const finishIntro = useCallback(() => setIntro(false), [])

  if (!active) return null

  return (
    <>
      {ribbon && (
        <div className="nd-ribbon" role="region" aria-label="احتفال اليوم الوطني السعودي" style={{ height: RIBBON_H }}>
          <div className="nd-ribbon-track" aria-hidden="true">
            {[0, 1].map(k => (
              <div className="nd-ribbon-run" key={k}>
                {Array.from({ length: 4 }).flatMap((_, r) =>
                  ribbonItems.map((item, i) => (
                    <span key={`${r}-${i}`} className="nd-ribbon-item">
                      <span className="nd-ribbon-dot" />
                      {item}
                    </span>
                  )),
                )}
              </div>
            ))}
          </div>
          <button type="button" className="nd-ribbon-close" onClick={closeRibbon} aria-label="إخفاء شريط الاحتفال">
            <svg viewBox="0 0 12 12" width={10} height={10} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 2l8 8M10 2l-8 8" /></svg>
          </button>
        </div>
      )}
      <PixelSky />
      {intro && <NationalIntro onDone={finishIntro} />}
    </>
  )
}
