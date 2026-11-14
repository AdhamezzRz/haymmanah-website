'use client'

import { useEffect, useState } from 'react'
import { GuideContext } from './charts'
import { CrmInsights } from './CrmInsights'
import type { CrmStats } from '@/portal/stats'

/** Full CRM overview with the same "explain mode" switch as the dashboard. */
export function CrmPage({ crm }: { crm: CrmStats }) {
  const [guide, setGuide] = useState(true)
  useEffect(() => { try { const g = localStorage.getItem('hm-guide'); if (g !== null) setGuide(g === '1') } catch { /* ignore */ } }, [])
  const toggle = () => setGuide(g => { try { localStorage.setItem('hm-guide', g ? '0' : '1') } catch { /* ignore */ } return !g })
  return (
    <GuideContext.Provider value={guide}>
      <div style={{ marginBottom: '1rem' }}>
        <label className="pt-guide-toggle pt-switch">
          <input type="checkbox" checked={guide} onChange={toggle} />
          <span>وضع الشرح {guide ? 'مفعّل' : 'متوقف'}</span>
        </label>
      </div>
      <CrmInsights crm={crm} full />
    </GuideContext.Provider>
  )
}
