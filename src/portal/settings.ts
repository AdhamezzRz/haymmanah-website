/**
 * Company settings (single record) — used on invoices and in the shell.
 */
import { store } from './store'
import type { FieldDef } from './schema'

export const SETTINGS_FIELDS: FieldDef[] = [
  { key: 'companyName', label: 'اسم المنشأة', type: 'text', required: true, default: 'هيمنة للخدمات التسويقية', half: true },
  { key: 'companyNameEn', label: 'الاسم بالإنجليزية', type: 'text', default: 'Haymanah Marketing Services', half: true },
  { key: 'vatNumber', label: 'الرقم الضريبي', type: 'text', placeholder: '3xxxxxxxxxxxxxx', half: true, help: '١٥ رقماً يبدأ بـ ٣ — يظهر على الفاتورة وفي رمز QR' },
  { key: 'crNumber', label: 'السجل التجاري', type: 'text', half: true },
  { key: 'phone', label: 'الجوال', type: 'phone', half: true },
  { key: 'email', label: 'البريد الإلكتروني', type: 'email', half: true },
  { key: 'address', label: 'العنوان', type: 'text', default: 'الرياض، المملكة العربية السعودية' },
  { key: 'bankName', label: 'البنك', type: 'text', half: true },
  { key: 'iban', label: 'IBAN', type: 'text', half: true, placeholder: 'SA00 0000 0000 0000 0000 0000' },
  { key: 'defaultVat', label: 'ضريبة القيمة المضافة الافتراضية %', type: 'percent', default: 15, half: true },
  { key: 'paymentTermsDays', label: 'مهلة السداد الافتراضية (أيام)', type: 'number', default: 15, half: true },
  { key: 'invoiceFooter', label: 'نص أسفل الفاتورة', type: 'textarea', default: 'شكراً لثقتكم — هيمنة للخدمات التسويقية. نَصنع الهيمنة، لا نُطاردها.' },
]

export type Settings = Record<string, unknown> & { companyName: string }

export async function getSettings(): Promise<Settings> {
  const rec = await store.get('_settings', 'company')
  const defaults: Record<string, unknown> = {}
  for (const f of SETTINGS_FIELDS) if (f.default !== undefined) defaults[f.key] = f.default
  return { ...defaults, ...(rec ?? {}) } as Settings
}
