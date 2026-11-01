/**
 * Portal module registry — the single list the whole portal reads.
 * Add a module here and it appears in the sidebar, API, search and ⌘K.
 */
import type { ModuleDef, Option } from '../schema'
import { ALL_ROLES, STAFF_ROLES, ADMIN_ONLY } from '../schema'
import { sectors, disciplines } from '@/lib/work'

/* ── Shared option sets ─────────────────────────────────────────────── */

export const PRIORITY: Option[] = [
  { value: 'low', label: 'منخفضة', color: '#6B7A99' },
  { value: 'normal', label: 'عادية', color: '#4C63C7' },
  { value: 'high', label: 'عالية', color: '#D98E04' },
  { value: 'urgent', label: 'عاجلة', color: '#C4504A' },
]

export const PLATFORMS: Option[] = [
  { value: 'instagram', label: 'إنستقرام', color: '#C13584' },
  { value: 'tiktok', label: 'تيك توك', color: '#111111' },
  { value: 'snapchat', label: 'سناب شات', color: '#C9B400' },
  { value: 'x', label: 'إكس', color: '#2B2B2B' },
  { value: 'youtube', label: 'يوتيوب', color: '#C4302B' },
  { value: 'linkedin', label: 'لينكدإن', color: '#0A66C2' },
  { value: 'google', label: 'قوقل / خرائط', color: '#2E7D32' },
  { value: 'website', label: 'الموقع', color: '#4C63C7' },
]

export const PAYMENT_METHODS: Option[] = [
  { value: 'bank', label: 'تحويل بنكي' },
  { value: 'mada', label: 'مدى' },
  { value: 'stcpay', label: 'STC Pay' },
  { value: 'cash', label: 'نقداً' },
  { value: 'other', label: 'أخرى' },
]

const sectorOptions: Option[] = sectors.map(s => ({ value: s, label: s }))
const disciplineOptions: Option[] = disciplines.map(d => ({ value: d, label: d }))

/* ── Modules ────────────────────────────────────────────────────────── */

export const clients: ModuleDef = {
  key: 'clients',
  label: 'العملاء',
  singular: 'عميل',
  newLabel: 'عميل جديد',
  description: 'ملفات العملاء والعقود وقنوات التواصل — من أول اهتمام إلى شراكة طويلة.',
  icon: 'clients',
  color: '#4C63C7',
  titleField: 'name',
  subtitleField: 'sector',
  statusField: 'status',
  defaultSort: { key: 'updatedAt', dir: 'desc' },
  views: ['table', 'board'],
  permissions: { read: ALL_ROLES, write: STAFF_ROLES },
  nav: true,
  fields: [
    { key: 'name', label: 'اسم العميل', type: 'text', required: true, table: true, search: true, placeholder: 'مثال: مطعم روزا' },
    { key: 'brandEn', label: 'الاسم بالإنجليزية', type: 'text', half: true, search: true },
    { key: 'sector', label: 'القطاع', type: 'select', options: sectorOptions, half: true, table: true },
    { key: 'status', label: 'الحالة', type: 'select', required: true, default: 'lead', table: true, options: [
      { value: 'lead', label: 'عميل محتمل', color: '#6B7A99' },
      { value: 'proposal', label: 'عرض سعر', color: '#D98E04' },
      { value: 'active', label: 'نشط', color: '#2E9E6B' },
      { value: 'paused', label: 'متوقف مؤقتاً', color: '#B07A2A' },
      { value: 'ended', label: 'منتهي', color: '#8A8F9E' },
    ] },
    { key: 'retainer', label: 'الاشتراك الشهري (ر.س)', type: 'money', half: true, table: true, min: 0 },
    { key: 'startDate', label: 'بداية التعاقد', type: 'date', half: true },
    { key: 'contactName', label: 'اسم المسؤول', type: 'text', half: true, search: true },
    { key: 'phone', label: 'الجوال', type: 'phone', half: true, placeholder: '05xxxxxxxx', search: true },
    { key: 'email', label: 'البريد الإلكتروني', type: 'email', half: true },
    { key: 'city', label: 'المدينة', type: 'text', half: true, default: 'الرياض' },
    { key: 'website', label: 'الموقع الإلكتروني', type: 'url', half: true },
    { key: 'instagram', label: 'حساب إنستقرام', type: 'text', half: true, placeholder: '@username' },
    { key: 'vatNumber', label: 'الرقم الضريبي', type: 'text', half: true, placeholder: '3xxxxxxxxxxxxxx' },
    { key: 'crNumber', label: 'السجل التجاري', type: 'text', half: true },
    { key: 'driveUrl', label: 'مجلد الملفات (Drive)', type: 'url' },
    { key: 'owner', label: 'مدير الحساب', type: 'relation', relation: 'team', half: true, table: true },
    { key: 'color', label: 'لون العميل', type: 'color', half: true, default: '#4C63C7' },
    { key: 'tags', label: 'وسوم', type: 'tags' },
    { key: 'notes', label: 'ملاحظات', type: 'textarea' },
  ],
}

export const projects: ModuleDef = {
  key: 'projects',
  label: 'المشاريع',
  singular: 'مشروع',
  newLabel: 'مشروع جديد',
  description: 'كل تعاقد أو حملة كمشروع له جدول ومخرجات وميزانية ومسؤول.',
  icon: 'projects',
  color: '#B0589E',
  titleField: 'title',
  subtitleField: 'client',
  statusField: 'status',
  defaultSort: { key: 'dueDate', dir: 'asc' },
  views: ['table', 'board'],
  permissions: { read: ALL_ROLES, write: ALL_ROLES },
  nav: true,
  fields: [
    { key: 'title', label: 'اسم المشروع', type: 'text', required: true, table: true, search: true, placeholder: 'مثال: إطلاق الهوية الجديدة' },
    { key: 'client', label: 'العميل', type: 'relation', relation: 'clients', required: true, table: true, half: true },
    { key: 'owner', label: 'المسؤول', type: 'relation', relation: 'team', half: true, table: true },
    { key: 'status', label: 'الحالة', type: 'select', required: true, default: 'planning', table: true, options: [
      { value: 'planning', label: 'تخطيط', color: '#6B7A99' },
      { value: 'active', label: 'قيد التنفيذ', color: '#4C63C7' },
      { value: 'review', label: 'مراجعة العميل', color: '#D98E04' },
      { value: 'delivered', label: 'تم التسليم', color: '#2E9E6B' },
      { value: 'archived', label: 'مؤرشف', color: '#8A8F9E' },
    ] },
    { key: 'priority', label: 'الأولوية', type: 'select', options: PRIORITY, default: 'normal', half: true },
    { key: 'services', label: 'الخدمات', type: 'multiselect', options: disciplineOptions, table: true },
    { key: 'startDate', label: 'تاريخ البداية', type: 'date', half: true },
    { key: 'dueDate', label: 'تاريخ التسليم', type: 'date', half: true, table: true },
    { key: 'budget', label: 'الميزانية (ر.س)', type: 'money', half: true, min: 0 },
    { key: 'portfolioReady', label: 'جاهز للنشر كدراسة حالة على الموقع', type: 'boolean', half: true },
    { key: 'summary', label: 'ملخص المشروع', type: 'textarea', search: true },
    { key: 'deliverables', label: 'المخرجات المتفق عليها', type: 'textarea', help: 'سطر لكل مخرج' },
    { key: 'driveUrl', label: 'مجلد الملفات (Drive)', type: 'url' },
    { key: 'tags', label: 'وسوم', type: 'tags' },
  ],
}

export const tasks: ModuleDef = {
  key: 'tasks',
  label: 'المهام',
  singular: 'مهمة',
  newLabel: 'مهمة جديدة',
  description: 'لوحة عمل الفريق اليومية — اسحب، أفلت، أنجز.',
  icon: 'tasks',
  color: '#2E9E6B',
  titleField: 'title',
  subtitleField: 'project',
  statusField: 'status',
  defaultSort: { key: 'dueDate', dir: 'asc' },
  views: ['board', 'table', 'calendar'],
  calendarField: 'dueDate',
  permissions: { read: ALL_ROLES, write: ALL_ROLES },
  nav: true,
  fields: [
    { key: 'title', label: 'المهمة', type: 'text', required: true, table: true, search: true, placeholder: 'مثال: مونتاج ريل الافتتاح' },
    { key: 'status', label: 'الحالة', type: 'select', required: true, default: 'todo', table: true, options: [
      { value: 'todo', label: 'قيد الانتظار', color: '#6B7A99' },
      { value: 'doing', label: 'جارٍ العمل', color: '#4C63C7' },
      { value: 'review', label: 'للمراجعة', color: '#D98E04' },
      { value: 'done', label: 'مكتملة', color: '#2E9E6B' },
    ] },
    { key: 'assignee', label: 'المكلّف', type: 'relation', relation: 'team', half: true, table: true },
    { key: 'priority', label: 'الأولوية', type: 'select', options: PRIORITY, default: 'normal', half: true, table: true },
    { key: 'project', label: 'المشروع', type: 'relation', relation: 'projects', half: true, table: true },
    { key: 'client', label: 'العميل', type: 'relation', relation: 'clients', half: true },
    { key: 'dueDate', label: 'تاريخ الاستحقاق', type: 'date', half: true, table: true },
    { key: 'estimateHours', label: 'الساعات المقدّرة', type: 'number', half: true, min: 0, step: 0.5 },
    { key: 'description', label: 'التفاصيل', type: 'textarea', search: true },
    { key: 'tags', label: 'وسوم', type: 'tags' },
  ],
}

export const content: ModuleDef = {
  key: 'content',
  label: 'تقويم المحتوى',
  singular: 'منشور',
  newLabel: 'منشور جديد',
  description: 'كل منشور لكل عميل على كل منصة — من الفكرة إلى النشر.',
  icon: 'content',
  color: '#C47A4A',
  titleField: 'title',
  subtitleField: 'client',
  statusField: 'status',
  defaultSort: { key: 'publishAt', dir: 'asc' },
  views: ['calendar', 'board', 'table'],
  calendarField: 'publishAt',
  permissions: { read: ALL_ROLES, write: ALL_ROLES },
  nav: true,
  fields: [
    { key: 'title', label: 'عنوان المنشور', type: 'text', required: true, table: true, search: true, placeholder: 'مثال: ريل عرض نهاية الأسبوع' },
    { key: 'client', label: 'العميل', type: 'relation', relation: 'clients', required: true, half: true, table: true },
    { key: 'platform', label: 'المنصة', type: 'select', options: PLATFORMS, required: true, half: true, table: true, default: 'instagram' },
    { key: 'format', label: 'الصيغة', type: 'select', half: true, default: 'reel', options: [
      { value: 'reel', label: 'ريل' },
      { value: 'post', label: 'منشور' },
      { value: 'carousel', label: 'كاروسيل' },
      { value: 'story', label: 'ستوري' },
      { value: 'video', label: 'فيديو طويل' },
      { value: 'article', label: 'مقال' },
      { value: 'ad', label: 'إعلان ممول' },
    ] },
    { key: 'status', label: 'الحالة', type: 'select', required: true, default: 'idea', table: true, options: [
      { value: 'idea', label: 'فكرة', color: '#6B7A99' },
      { value: 'writing', label: 'كتابة', color: '#4C63C7' },
      { value: 'design', label: 'تصميم / مونتاج', color: '#B0589E' },
      { value: 'review', label: 'مراجعة العميل', color: '#D98E04' },
      { value: 'approved', label: 'معتمد', color: '#2E9E6B' },
      { value: 'scheduled', label: 'مجدول', color: '#1F8FB8' },
      { value: 'published', label: 'منشور', color: '#0B6B3A' },
    ] },
    { key: 'publishAt', label: 'موعد النشر', type: 'datetime', half: true, table: true },
    { key: 'assignee', label: 'المكلّف', type: 'relation', relation: 'team', half: true },
    { key: 'caption', label: 'النص / الكابشن', type: 'textarea', search: true },
    { key: 'assetUrl', label: 'رابط التصميم / الفيديو', type: 'url' },
    { key: 'notes', label: 'ملاحظات داخلية', type: 'textarea' },
  ],
}

export const invoices: ModuleDef = {
  key: 'invoices',
  label: 'الفواتير',
  singular: 'فاتورة',
  newLabel: 'فاتورة جديدة',
  description: 'فواتير ضريبية متوافقة مع هيئة الزكاة والضريبة — مع رمز QR وطباعة A4.',
  icon: 'invoices',
  color: '#D98E04',
  titleField: 'number',
  subtitleField: 'client',
  statusField: 'status',
  numberPrefix: 'INV',
  defaultSort: { key: 'issueDate', dir: 'desc' },
  views: ['table', 'board'],
  permissions: { read: STAFF_ROLES, write: STAFF_ROLES },
  nav: true,
  fields: [
    { key: 'number', label: 'رقم الفاتورة', type: 'text', readonly: true, table: true, search: true },
    { key: 'client', label: 'العميل', type: 'relation', relation: 'clients', required: true, table: true, half: true },
    { key: 'project', label: 'المشروع', type: 'relation', relation: 'projects', half: true },
    { key: 'status', label: 'الحالة', type: 'select', required: true, default: 'draft', table: true, options: [
      { value: 'draft', label: 'مسودة', color: '#6B7A99' },
      { value: 'sent', label: 'مرسلة', color: '#4C63C7' },
      { value: 'paid', label: 'مدفوعة', color: '#2E9E6B' },
      { value: 'overdue', label: 'متأخرة', color: '#C4504A' },
      { value: 'void', label: 'ملغاة', color: '#8A8F9E' },
    ] },
    { key: 'issueDate', label: 'تاريخ الإصدار', type: 'date', required: true, half: true, table: true },
    { key: 'dueDate', label: 'تاريخ الاستحقاق', type: 'date', half: true, table: true },
    { key: 'items', label: 'البنود', type: 'items', required: true },
    { key: 'discount', label: 'خصم (ر.س)', type: 'money', half: true, min: 0, default: 0 },
    { key: 'vatRate', label: 'ضريبة القيمة المضافة %', type: 'percent', half: true, default: 15, min: 0, max: 100 },
    { key: 'paymentMethod', label: 'طريقة الدفع', type: 'select', options: PAYMENT_METHODS, half: true, default: 'bank' },
    { key: 'paidAt', label: 'تاريخ السداد', type: 'date', half: true },
    { key: 'notes', label: 'ملاحظات تظهر على الفاتورة', type: 'textarea' },
  ],
}

export const expenses: ModuleDef = {
  key: 'expenses',
  label: 'المصروفات',
  singular: 'مصروف',
  newLabel: 'مصروف جديد',
  description: 'مصاريف الإنتاج والاشتراكات والإعلانات — لتعرف الربح الحقيقي لكل مشروع.',
  icon: 'expenses',
  color: '#C4504A',
  titleField: 'title',
  subtitleField: 'category',
  statusField: 'category',
  defaultSort: { key: 'date', dir: 'desc' },
  views: ['table'],
  permissions: { read: STAFF_ROLES, write: STAFF_ROLES },
  nav: true,
  fields: [
    { key: 'title', label: 'البيان', type: 'text', required: true, table: true, search: true },
    { key: 'amount', label: 'المبلغ (ر.س)', type: 'money', required: true, half: true, table: true, min: 0 },
    { key: 'date', label: 'التاريخ', type: 'date', required: true, half: true, table: true },
    { key: 'category', label: 'التصنيف', type: 'select', required: true, default: 'production', table: true, options: [
      { value: 'production', label: 'إنتاج وتصوير', color: '#B0589E' },
      { value: 'ads', label: 'ميزانية إعلانات', color: '#4C63C7' },
      { value: 'software', label: 'اشتراكات وبرامج', color: '#1F8FB8' },
      { value: 'freelance', label: 'مستقلون', color: '#C47A4A' },
      { value: 'influencers', label: 'مدونون ومؤثرون', color: '#D98E04' },
      { value: 'office', label: 'تشغيلية', color: '#6B7A99' },
      { value: 'other', label: 'أخرى', color: '#8A8F9E' },
    ] },
    { key: 'project', label: 'المشروع', type: 'relation', relation: 'projects', half: true, table: true },
    { key: 'client', label: 'العميل', type: 'relation', relation: 'clients', half: true },
    { key: 'vendor', label: 'الجهة / المورد', type: 'text', half: true, search: true },
    { key: 'paymentMethod', label: 'طريقة الدفع', type: 'select', options: PAYMENT_METHODS, half: true },
    { key: 'receiptUrl', label: 'رابط الإيصال', type: 'url' },
    { key: 'notes', label: 'ملاحظات', type: 'textarea' },
  ],
}

export const team: ModuleDef = {
  key: 'team',
  label: 'الفريق',
  singular: 'عضو',
  newLabel: 'عضو جديد',
  description: 'أعضاء الفريق وصلاحياتهم — من يرى ماذا، ومن يعدّل ماذا.',
  icon: 'team',
  color: '#1F8FB8',
  titleField: 'name',
  subtitleField: 'title',
  statusField: 'role',
  defaultSort: { key: 'name', dir: 'asc' },
  views: ['table'],
  permissions: { read: ALL_ROLES, write: ADMIN_ONLY },
  nav: true,
  fields: [
    { key: 'name', label: 'الاسم', type: 'text', required: true, table: true, search: true },
    { key: 'email', label: 'البريد الإلكتروني (لتسجيل الدخول)', type: 'email', required: true, table: true, search: true },
    { key: 'role', label: 'الصلاحية', type: 'select', required: true, default: 'member', table: true, options: [
      { value: 'admin', label: 'مدير — كل شيء', color: '#C4504A' },
      { value: 'manager', label: 'مشرف — كل شيء عدا الإعدادات والفريق', color: '#D98E04' },
      { value: 'member', label: 'عضو — المشاريع والمهام والمحتوى', color: '#4C63C7' },
    ] },
    { key: 'title', label: 'المسمى الوظيفي', type: 'text', half: true, table: true, placeholder: 'مثال: مصمم جرافيك' },
    { key: 'phone', label: 'الجوال', type: 'phone', half: true },
    { key: 'active', label: 'الحساب مفعّل', type: 'boolean', half: true, default: true, table: true },
    { key: 'color', label: 'لون العضو', type: 'color', half: true, default: '#4C63C7' },
    { key: 'password', label: 'كلمة المرور', type: 'password', help: 'اتركها فارغة عند التعديل للإبقاء على كلمة المرور الحالية.' },
  ],
}

export const modules: ModuleDef[] = [clients, projects, tasks, content, invoices, expenses, team]

export const moduleMap: Record<string, ModuleDef> = Object.fromEntries(modules.map(m => [m.key, m]))

export function getModule(key: string): ModuleDef | undefined {
  return moduleMap[key]
}
