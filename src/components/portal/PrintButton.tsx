'use client'

import { Icon } from './Icon'

export function PrintButton() {
  return (
    <button type="button" className="pt-btn pt-btn-primary" onClick={() => window.print()}>
      <Icon name="print" /> طباعة / حفظ PDF
    </button>
  )
}
