/**
 * Sample data — server only.
 *
 * Loads a small, clearly fictional agency ("تجريبي") so every chart, alert and
 * view has something to show while the team learns the system. Every record is
 * flagged `demo: true` and removed in one click; real data is never touched.
 */
import { store } from './store'
import { dayKey } from './format'
import { modules } from './modules'
import type { PortalUser } from './auth'

const DAY = 86400000
const d = (offset: number) => dayKey(new Date(Date.now() + offset * DAY))
const at = (offset: number, hour = 12) => `${d(offset)}T${String(hour).padStart(2, '0')}:00:00+03:00`
const iso = (offset: number) => new Date(Date.now() + offset * DAY).toISOString()
const TAG = ' (تجريبي)'

export async function demoCount(): Promise<number> {
  let n = 0
  for (const m of modules) n += (await store.list(m.key)).filter(r => r.demo === true).length
  return n
}

export async function clearDemo(): Promise<number> {
  let n = 0
  for (const m of modules) {
    for (const r of await store.list(m.key)) {
      if (r.demo === true) { await store.remove(m.key, r.id); n++ }
    }
  }
  return n
}

export async function seedDemo(user: PortalUser): Promise<number> {
  let n = 0
  const add = async (collection: string, data: Record<string, unknown>) => {
    n++
    return store.insert(collection, { ...data, demo: true, createdBy: user.id })
  }

  // Two sample teammates so the scoreboard has people to compare. They cannot log in.
  const sara = await add('team', { name: `سارة${TAG}`, email: `demo-sara-${Date.now()}@example.invalid`, role: 'manager', title: 'مديرة حسابات', active: true, color: '#B0589E', passwordHash: 'disabled' })
  const fahad = await add('team', { name: `فهد${TAG}`, email: `demo-fahad-${Date.now()}@example.invalid`, role: 'member', title: 'مصمم ومونتير', active: true, color: '#2E9E6B', passwordHash: 'disabled' })
  const me = user.id

  /* ── Clients ── */
  const diwan = await add('clients', { name: `مطعم الديوان${TAG}`, sector: 'مطاعم', status: 'active', tier: 'vip', source: 'referral', retainer: 12000, startDate: d(-240), owner: sara.id, contactName: 'أبو خالد', phone: '0500000001', city: 'الرياض', color: '#5a1a2e', lastContactAt: iso(-3), nextFollowUp: d(2) })
  const nokhba = await add('clients', { name: `عيادات النخبة${TAG}`, sector: 'عيادات', status: 'proposal', tier: 'core', source: 'instagram', owner: sara.id, contactName: 'د. ريم', phone: '0500000002', city: 'الرياض', color: '#5a2438', lastContactAt: iso(-6), nextFollowUp: d(0) })
  const masar = await add('clients', { name: `معرض المسار للسيارات${TAG}`, sector: 'سيارات', status: 'active', tier: 'core', source: 'google', retainer: 8500, startDate: d(-150), owner: me, contactName: 'م. سعود', phone: '0500000003', color: '#1a4a42', lastContactAt: iso(-41) })
  const harf = await add('clients', { name: `كوفي حرف${TAG}`, sector: 'كافيهات', status: 'lead', tier: 'small', source: 'tiktok', owner: me, contactName: 'نورة', phone: '0500000004', color: '#5a3a1e', nextFollowUp: d(-2) })
  const bina = await add('clients', { name: `مؤسسة البناء الحديث${TAG}`, sector: 'مقاولات', status: 'lead', tier: 'core', source: 'website', contactName: 'م. فيصل', phone: '0500000005', color: '#3a3028' })
  const rawabi = await add('clients', { name: `شقق الروابي${TAG}`, sector: 'عقارات', status: 'paused', tier: 'small', source: 'event', owner: sara.id, retainer: 5000, color: '#3d2a10', lastContactAt: iso(-70) })

  /* ── Deals across the whole pipeline ── */
  const dl = async (title: string, client: string, value: number, stage: string, extra: Record<string, unknown> = {}) =>
    add('deals', { title: `${title}${TAG}`, client, value, stage, owner: me, ...extra })
  await dl('باقة ريلز شهرية', harf.id, 6000, 'new', { source: 'tiktok', expectedClose: d(25), nextFollowUp: d(-2) })
  await dl('هوية بصرية كاملة', bina.id, 22000, 'contacted', { source: 'website', expectedClose: d(30), nextFollowUp: d(1), owner: sara.id })
  await dl('إدارة حسابات — ٦ أشهر', nokhba.id, 54000, 'proposal', { source: 'instagram', expectedClose: d(10), nextFollowUp: d(0), owner: sara.id })
  await dl('حملة افتتاح الفرع الجديد', diwan.id, 18000, 'negotiation', { source: 'referral', expectedClose: d(5), nextFollowUp: d(1), owner: sara.id })
  await dl('تصوير منيو الشتاء', diwan.id, 7500, 'meeting', { source: 'referral', expectedClose: d(14) })
  await dl('موقع إلكتروني للمعرض', masar.id, 28000, 'meeting', { source: 'google', expectedClose: d(-4), nextFollowUp: d(3) })
  await dl('إدارة حسابات المعرض', masar.id, 51000, 'won', { source: 'google', closedAt: d(-12), stageChangedAt: iso(-12) })
  await dl('حملة اليوم الوطني', diwan.id, 15000, 'won', { source: 'referral', closedAt: d(-48), stageChangedAt: iso(-48), owner: sara.id })
  await dl('هوية مطعم الديوان', diwan.id, 24000, 'won', { source: 'referral', closedAt: d(-200), stageChangedAt: iso(-200), owner: sara.id })
  await dl('إدارة حسابات الشقق', rawabi.id, 30000, 'lost', { source: 'event', lostReason: 'price', closedAt: d(-20), stageChangedAt: iso(-20), owner: sara.id })
  await dl('فيديو تعريفي', bina.id, 9000, 'lost', { source: 'outbound', lostReason: 'no-response', closedAt: d(-35), stageChangedAt: iso(-35) })

  /* ── Conversations ── */
  await add('interactions', { subject: `اتصال متابعة عرض السعر${TAG}`, type: 'call', at: at(-6, 11), client: nokhba.id, outcome: 'positive', by: sara.id, details: 'موافقة مبدئية، تريد تعديل عدد المنشورات.', nextAction: 'إرسال العرض المعدّل', nextDate: d(0) })
  await add('interactions', { subject: `اجتماع تخطيط نوفمبر${TAG}`, type: 'meeting', at: at(-3, 14), client: diwan.id, outcome: 'positive', by: sara.id, details: 'اعتماد خطة المحتوى وعروض نهاية الأسبوع.', nextAction: 'مشاركة التقويم', nextDate: d(2) })
  await add('interactions', { subject: `واتساب: استفسار عن الأسعار${TAG}`, type: 'whatsapp', at: at(-9, 16), client: harf.id, outcome: 'neutral', by: me, nextAction: 'اتصال هاتفي', nextDate: d(-2) })
  await add('interactions', { subject: `اتصال — لم يرد${TAG}`, type: 'call', at: at(-41, 10), client: masar.id, outcome: 'no-answer', by: me })

  /* ── Projects ── */
  const pDiwan = await add('projects', { title: `إدارة حسابات الديوان — هذا الشهر${TAG}`, client: diwan.id, owner: sara.id, status: 'active', priority: 'high', services: ['تصوير', 'مونتاج وفيديو'], startDate: d(-12), dueDate: d(18), budget: 12000 })
  const pMasar = await add('projects', { title: `إطلاق الموديلات الجديدة${TAG}`, client: masar.id, owner: me, status: 'review', priority: 'normal', services: ['هوية بصرية وجرافيك'], startDate: d(-20), dueDate: d(3), budget: 8500 })

  /* ── Tasks: open, overdue, in review, and rated history ── */
  const task = (title: string, extra: Record<string, unknown>) => add('tasks', { title: `${title}${TAG}`, priority: 'normal', project: pDiwan.id, client: diwan.id, ...extra })
  await task('تصوير أطباق الشتاء', { status: 'doing', assignee: fahad.id, priority: 'high', dueDate: d(1), assignedAt: iso(-1), assignedBy: sara.id, checklist: [{ text: 'تجهيز قائمة اللقطات', done: true }, { text: 'التصوير في الموقع', done: false }, { text: 'فرز وتعديل الصور', done: false }] })
  await task('مونتاج ريل الافتتاح', { status: 'todo', assignee: fahad.id, dueDate: d(3) })
  await task('كتابة كابشنات الأسبوع', { status: 'review', assignee: sara.id, dueDate: d(0), statusChangedAt: iso(-0.2) })
  await task('اعتماد بوستر الموديل الجديد', { status: 'review', assignee: me, priority: 'urgent', dueDate: d(-2), project: pMasar.id, client: masar.id, statusChangedAt: iso(-1) })
  await task('مراجعة تقويم الأسبوع القادم', { status: 'todo', assignee: me, dueDate: d(0) })
  await task('تجهيز عرض السعر لعيادات النخبة', { status: 'todo', assignee: me, priority: 'high', dueDate: d(1), project: '', client: nokhba.id })
  await task('تسليم ملفات الهوية النهائية', { status: 'done', assignee: fahad.id, dueDate: d(-1), completedAt: iso(-1.2), project: pMasar.id, client: masar.id })
  // rated history across the last 8 weeks
  const history: [string, string, number, number, number, string][] = [
    ['ريل عروض الخميس', fahad.id, -5, -6, 5, 'إخراج ممتاز وسُلّم قبل الموعد.'],
    ['تصميم منيو رمضان', fahad.id, -12, -11, 4, ''],
    ['فيديو كواليس التصوير', fahad.id, -19, -17, 3, 'جيد لكن تأخر يومين.'],
    ['بوستر عرض نهاية الشهر', fahad.id, -26, -27, 5, ''],
    ['تقرير نتائج الشهر', sara.id, -8, -9, 5, 'واضح ومختصر — أعجب العميل.'],
    ['خطة محتوى الربع القادم', sara.id, -15, -15, 4, ''],
    ['جدولة منشورات الأسبوع', sara.id, -22, -23, 5, ''],
    ['تحديث صفحة قوقل', sara.id, -33, -30, 3, ''],
    ['مراجعة الحملة الممولة', me, -10, -10, 4, ''],
    ['اجتماع انطلاق المشروع', me, -24, -25, 5, ''],
    ['كتابة سكربت الفيديو', me, -40, -38, 2, 'يحتاج إعادة صياغة.'],
    ['تصوير المعرض', fahad.id, -45, -46, 4, ''],
  ]
  for (const [title, who, due, done, rating, note] of history) {
    await task(title, { status: 'done', assignee: who, dueDate: d(due), completedAt: iso(done), rating, ratingNote: note, ratedAt: iso(done + 0.5), ratedBy: who === me ? sara.id : me })
  }

  /* ── Content calendar ── */
  const post = (title: string, extra: Record<string, unknown>) => add('content', { title: `${title}${TAG}`, client: diwan.id, format: 'reel', ...extra })
  await post('ريل: عروض الخميس', { platform: 'instagram', status: 'design', publishAt: at(2, 19), assignee: fahad.id })
  await post('كاروسيل: ٥ أطباق لازم تجربها', { platform: 'instagram', format: 'carousel', status: 'approved', publishAt: at(4, 18) })
  await post('تيك توك: جولة في المطعم', { platform: 'tiktok', status: 'scheduled', publishAt: at(5, 20) })
  await post('سناب: كواليس المطبخ', { platform: 'snapchat', format: 'story', status: 'writing', publishAt: at(0, 17), assignee: sara.id })
  await post('بوستر الموديل الجديد', { platform: 'instagram', format: 'post', status: 'review', publishAt: at(1, 12), client: masar.id })
  await post('منشور: تقييمات العملاء', { platform: 'google', format: 'post', status: 'published', publishAt: at(-2, 11) })
  await post('فيديو يوتيوب: قصة المطعم', { platform: 'youtube', format: 'video', status: 'idea', publishAt: at(9, 15) })

  /* ── Invoices + expenses over six months ── */
  const inv = async (client: string, amount: number, status: string, issue: number, due: number, paid?: number) => {
    n++
    return store.insert('invoices', { demo: true, createdBy: user.id, number: await store.nextNumber('DEMO'), client, status, issueDate: d(issue), dueDate: d(due), paidAt: paid !== undefined ? d(paid) : '', items: [{ description: 'خدمات تسويقية (تجريبي)', qty: 1, price: amount }], discount: 0, vatRate: 15, paymentMethod: 'bank' })
  }
  for (let m = 5; m >= 1; m--) {
    await inv(diwan.id, 12000, 'paid', -30 * m - 5, -30 * m + 10, -30 * m + 4)
    if (m <= 4) await inv(masar.id, 8500 + (m % 2) * 1500, 'paid', -30 * m - 2, -30 * m + 13, -30 * m + 9)
  }
  await inv(diwan.id, 12000, 'paid', -8, 7, -3)
  await inv(masar.id, 8500, 'sent', -6, 9)
  await inv(rawabi.id, 5000, 'overdue', -45, -30)

  const exp = (title: string, amount: number, category: string, offset: number, extra: Record<string, unknown> = {}) =>
    add('expenses', { title: `${title}${TAG}`, amount, category, date: d(offset), paymentMethod: 'bank', ...extra })
  for (let m = 5; m >= 0; m--) {
    await exp('اشتراكات البرامج', 950, 'software', -30 * m - 2)
    await exp('ميزانية إعلانات العملاء', 3000 + m * 250, 'ads', -30 * m - 4, { client: diwan.id })
    if (m % 2 === 0) await exp('استوديو ومعدات تصوير', 1800, 'production', -30 * m - 6, { project: pDiwan.id })
    if (m % 3 === 0) await exp('مستقل — موشن جرافيك', 2200, 'freelance', -30 * m - 9)
  }
  await exp('تغطية مدونين', 4000, 'influencers', -15, { client: diwan.id })
  await exp('مصاريف مكتبية', 600, 'office', -11)

  return n
}
