/**
 * Portal schema primitives.
 *
 * Every portal module (clients, projects, tasks…) is ONE declarative `ModuleDef`
 * in `src/portal/modules/`. The generic engine (API routes, tables, forms, detail
 * pages, board/calendar views, search, permissions) renders itself from these
 * definitions — so adding a field, a status or a whole module is data, not code.
 */

export type Role = 'admin' | 'manager' | 'member'

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'مدير',
  manager: 'مشرف',
  member: 'عضو فريق',
}

export type FieldType =
  | 'text' | 'textarea' | 'number' | 'money' | 'percent'
  | 'date' | 'datetime'
  | 'select' | 'multiselect' | 'relation'
  | 'email' | 'phone' | 'url'
  | 'boolean' | 'color' | 'tags'
  | 'items'      // invoice line items: { description, qty, price }[]
  | 'rating'     // 1–5 stars (null = not rated yet)
  | 'checklist'  // sub-steps: { text, done }[]
  | 'password'   // write-only; never returned by the API

export interface Option {
  value: string
  label: string
  /** Used for status chips, board columns and calendar dots. */
  color?: string
}

export interface FieldDef {
  key: string
  label: string
  type: FieldType
  required?: boolean
  options?: Option[]
  /** For `relation`: the module key this field points to (e.g. 'clients'). */
  relation?: string
  placeholder?: string
  help?: string
  /** Render at half width in the form. */
  half?: boolean
  /** Show as a column in the list table. */
  table?: boolean
  /** Include in free-text search / ⌘K. */
  search?: boolean
  default?: unknown
  /** Shown in detail but not editable (e.g. auto number). */
  readonly?: boolean
  min?: number
  max?: number
  step?: number
  /** Only show (form + detail) when another field has one of these values. */
  showIf?: { field: string; in: string[] }
  /** Roles allowed to change this field; others' input for it is ignored. Default: the module's write roles. */
  writeRoles?: Role[]
}

export type NavGroup = 'crm' | 'work' | 'finance' | 'system'

export const NAV_GROUP_LABELS: Record<NavGroup, string> = {
  crm: 'المبيعات · CRM',
  work: 'العمل',
  finance: 'المالية',
  system: 'النظام',
}

/** Plain-language explainer shown on the module page and in the guide. */
export interface ModuleHelp {
  what: string
  example: string
  tips?: string[]
}

export type ViewKind = 'table' | 'board' | 'calendar'

export interface ModuleDef {
  /** URL + collection key, e.g. 'clients'. */
  key: string
  label: string
  singular: string
  /** Gender-correct CTA, e.g. 'مهمة جديدة'. */
  newLabel: string
  description: string
  /** Name in the portal icon set (see components/portal/Icon). */
  icon: string
  /** Accent for the module (nav, headers, empty states). */
  color: string
  fields: FieldDef[]
  /** Field shown as the record title everywhere. */
  titleField: string
  subtitleField?: string
  /** A `select` field driving chips, board columns and filters. */
  statusField?: string
  defaultSort?: { key: string; dir: 'asc' | 'desc' }
  views?: ViewKind[]
  /** Date/datetime field used by the calendar view. */
  calendarField?: string
  /** Auto-number prefix, e.g. 'INV' → INV-2026-0001. */
  numberPrefix?: string
  permissions: { read: Role[]; write: Role[] }
  /** Show in the sidebar. */
  nav?: boolean
  /** Sidebar section. */
  group?: NavGroup
  help?: ModuleHelp
}

export interface BaseRecord {
  id: string
  createdAt: string
  updatedAt: string
  createdBy?: string
  /** Auto number for modules with `numberPrefix`. */
  number?: string
  [key: string]: unknown
}

export interface LineItem {
  description: string
  qty: number
  price: number
}

export interface ChecklistItem {
  text: string
  done: boolean
}

/** Is this field visible for the given record values? */
export function fieldVisible(f: FieldDef, values: Record<string, unknown>): boolean {
  if (!f.showIf) return true
  return f.showIf.in.includes(String(values[f.showIf.field] ?? ''))
}

export const ALL_ROLES: Role[] = ['admin', 'manager', 'member']
export const STAFF_ROLES: Role[] = ['admin', 'manager']
export const ADMIN_ONLY: Role[] = ['admin']

export function fieldByKey(def: ModuleDef, key: string): FieldDef | undefined {
  return def.fields.find(f => f.key === key)
}

export function optionLabel(field: FieldDef | undefined, value: unknown): string {
  if (!field?.options) return String(value ?? '')
  return field.options.find(o => o.value === value)?.label ?? String(value ?? '')
}

export function optionColor(field: FieldDef | undefined, value: unknown): string | undefined {
  return field?.options?.find(o => o.value === value)?.color
}

/** Default values for a fresh record of a module. */
export function emptyRecord(def: ModuleDef): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const f of def.fields) {
    if (f.default !== undefined) out[f.key] = f.default
    else if (f.type === 'multiselect' || f.type === 'tags' || f.type === 'items' || f.type === 'checklist') out[f.key] = []
    else if (f.type === 'rating') out[f.key] = null
    else if (f.type === 'boolean') out[f.key] = false
    else out[f.key] = ''
  }
  return out
}

/** Server-side validation + coercion. Returns cleaned data or a list of field errors. */
export function validateRecord(def: ModuleDef, input: Record<string, unknown>, partial = false, role?: Role) {
  const errors: Record<string, string> = {}
  const data: Record<string, unknown> = {}
  for (const f of def.fields) {
    // server-managed fields and fields this role may not change are never taken from input
    if (f.readonly) continue
    if (f.writeRoles && role && !f.writeRoles.includes(role)) continue
    const has = Object.prototype.hasOwnProperty.call(input, f.key)
    if (!has) {
      if (!partial && f.required && f.type !== 'password') errors[f.key] = 'هذا الحقل مطلوب'
      continue
    }
    let v = input[f.key]
    switch (f.type) {
      case 'number': case 'money': case 'percent': {
        if (v === '' || v === null || v === undefined) { v = null; break }
        const n = typeof v === 'number' ? v : Number(String(v).replace(/[^\d.-]/g, ''))
        if (Number.isNaN(n)) { errors[f.key] = 'أدخل رقماً صحيحاً'; continue }
        if (f.min !== undefined && n < f.min) { errors[f.key] = `الحد الأدنى ${f.min}`; continue }
        if (f.max !== undefined && n > f.max) { errors[f.key] = `الحد الأقصى ${f.max}`; continue }
        v = n; break
      }
      case 'boolean': v = Boolean(v); break
      case 'rating': {
        if (v === '' || v === null || v === undefined || Number(v) === 0) { v = null; break }
        const n = Math.round(Number(v))
        if (!Number.isFinite(n) || n < 1 || n > 5) { errors[f.key] = 'التقييم من ١ إلى ٥ نجوم'; continue }
        v = n; break
      }
      case 'checklist':
        v = Array.isArray(v)
          ? (v as Partial<ChecklistItem>[]).slice(0, 100).map(it => ({ text: String(it?.text ?? '').trim().slice(0, 300), done: Boolean(it?.done) })).filter(it => it.text)
          : []
        break
      case 'date':
        v = v === null || v === undefined ? '' : String(v).trim().slice(0, 10)
        if (v && !/^\d{4}-\d{2}-\d{2}$/.test(v as string)) { errors[f.key] = 'تاريخ غير صالح'; continue }
        break
      case 'datetime':
        v = v === null || v === undefined ? '' : String(v).trim()
        if (v && Number.isNaN(Date.parse(v as string))) { errors[f.key] = 'تاريخ ووقت غير صالحين'; continue }
        break
      case 'multiselect': case 'tags':
        v = Array.isArray(v) ? v.map(String).filter(Boolean) : []; break
      case 'items':
        v = Array.isArray(v)
          ? (v as Partial<LineItem>[]).map(it => ({
              description: String(it.description ?? '').trim(),
              qty: Number(it.qty) || 0,
              price: Number(it.price) || 0,
            })).filter(it => it.description || it.qty || it.price)
          : []
        break
      case 'email':
        v = String(v ?? '').trim()
        if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v as string)) { errors[f.key] = 'بريد إلكتروني غير صالح'; continue }
        break
      case 'url':
        v = String(v ?? '').trim()
        if (v && !/^https?:\/\//i.test(v as string)) v = `https://${v}`
        break
      case 'select':
        v = v === null || v === undefined ? '' : String(v)
        if (v && f.options && !f.options.some(o => o.value === v)) { errors[f.key] = 'قيمة غير معروفة'; continue }
        break
      case 'password':
        v = String(v ?? ''); break
      default:
        v = v === null || v === undefined ? '' : String(v).trim().slice(0, 20000)
    }
    if (f.required && (v === '' || v === null || (Array.isArray(v) && v.length === 0)) && f.type !== 'password') {
      errors[f.key] = 'هذا الحقل مطلوب'; continue
    }
    data[f.key] = v
  }
  return { data, errors, ok: Object.keys(errors).length === 0 }
}
