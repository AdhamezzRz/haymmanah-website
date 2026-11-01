/**
 * ZATCA (هيئة الزكاة والضريبة والجمارك) phase-1 simplified e-invoice QR.
 * The QR payload is Base64 of TLV-encoded fields:
 *   1 seller name · 2 seller VAT number · 3 timestamp (ISO 8601)
 *   4 invoice total incl. VAT · 5 VAT amount
 */
import QRCode from 'qrcode'
import type { LineItem } from './schema'

function tlv(tag: number, value: string): Buffer {
  const v = Buffer.from(value, 'utf8')
  return Buffer.concat([Buffer.from([tag, v.length]), v])
}

export function zatcaPayload(input: { sellerName: string; vatNumber: string; timestamp: string; total: number; vat: number }): string {
  return Buffer.concat([
    tlv(1, input.sellerName),
    tlv(2, input.vatNumber),
    tlv(3, input.timestamp),
    tlv(4, input.total.toFixed(2)),
    tlv(5, input.vat.toFixed(2)),
  ]).toString('base64')
}

export async function zatcaQrSvg(payload: string): Promise<string> {
  return QRCode.toString(payload, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#14173A', light: '#0000' } })
}

export interface InvoiceTotals {
  subtotal: number
  discount: number
  taxable: number
  vatRate: number
  vat: number
  total: number
}

export function invoiceTotals(items: LineItem[] | undefined, discount: unknown, vatRate: unknown): InvoiceTotals {
  const subtotal = (items ?? []).reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.price) || 0), 0)
  const disc = Math.min(Math.max(Number(discount) || 0, 0), subtotal)
  const taxable = subtotal - disc
  const rate = Number.isFinite(Number(vatRate)) ? Number(vatRate) : 15
  const vat = Math.round(taxable * rate) / 100
  return { subtotal, discount: disc, taxable, vatRate: rate, vat, total: Math.round((taxable + vat) * 100) / 100 }
}
