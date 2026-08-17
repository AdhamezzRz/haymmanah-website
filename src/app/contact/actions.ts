'use server'

export interface ContactFormState {
  status: 'idle' | 'success' | 'error'
  message?: string
}

const DESTINATION_EMAIL = 'haymannah@gmail.com'

const budgetLabels: Record<string, string> = {
  'under-5k': 'أقل من ٥,٠٠٠ ريال / شهرياً',
  '5k-15k': '٥,٠٠٠ – ١٥,٠٠٠ ريال / شهرياً',
  '15k-30k': '١٥,٠٠٠ – ٣٠,٠٠٠ ريال / شهرياً',
  'over-30k': 'أكثر من ٣٠,٠٠٠ ريال / شهرياً',
  'not-set': 'غير محدد بعد',
}

const timelineLabels: Record<string, string> = {
  now: 'فوراً',
  month: 'خلال شهر',
  quarter: 'خلال ٣ أشهر',
  exploring: 'أستكشف الخيارات فقط',
}

const sourceLabels: Record<string, string> = {
  instagram: 'انستقرام',
  tiktok: 'تيك توك',
  google: 'جوجل / بحث',
  referral: 'توصية من صديق',
  other: 'أخرى',
}

const contactMethodLabels: Record<string, string> = {
  phone: 'مكالمة هاتفية',
  whatsapp: 'واتساب',
  email: 'بريد إلكتروني',
}

function row(label: string, value?: string) {
  if (!value) return ''
  return `<tr><td style="padding:10px 12px;border-bottom:1px solid #eee;font-weight:bold;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:10px 12px;border-bottom:1px solid #eee">${value}</td></tr>`
}

async function sendEmail(subject: string, html: string) {
  const RESEND_KEY = process.env.RESEND_API_KEY
  if (!RESEND_KEY) return true

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'هيمنة — الموقع <onboarding@resend.dev>',
      to: [DESTINATION_EMAIL],
      subject,
      html,
    }),
  })
  return res.ok
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name    = (formData.get('name')    as string)?.trim()
  const company = (formData.get('company') as string)?.trim()
  const email   = (formData.get('email')   as string)?.trim()
  const phone   = (formData.get('phone')   as string)?.trim()
  const services = formData.getAll('services') as string[]
  const budget  = (formData.get('budget')  as string)?.trim()
  const timeline = (formData.get('timeline') as string)?.trim()
  const source  = (formData.get('source')  as string)?.trim()
  const contactMethod = (formData.get('contactMethod') as string)?.trim()
  const message = (formData.get('message') as string)?.trim()

  if (!name || !email || !phone || !message) {
    return { status: 'error', message: 'يرجى ملء جميع الحقول المطلوبة.' }
  }
  if (!emailRegex.test(email)) {
    return { status: 'error', message: 'البريد الإلكتروني غير صحيح.' }
  }

  const html = `
    <div dir="rtl" style="font-family:Arial,sans-serif;max-width:640px">
      <h2 style="color:#4C63C7">استشارة جديدة من موقع هيمنة</h2>
      <table style="width:100%;border-collapse:collapse">
        ${row('الاسم', name)}
        ${row('الشركة', company)}
        ${row('البريد الإلكتروني', email)}
        ${row('رقم الهاتف', phone)}
        ${row('طريقة التواصل المفضلة', contactMethodLabels[contactMethod])}
        ${row('الخدمات المطلوبة', services.length ? services.join('، ') : undefined)}
        ${row('الميزانية الشهرية التقريبية', budgetLabels[budget])}
        ${row('الوقت المتوقع للبدء', timelineLabels[timeline])}
        ${row('كيف سمع عنّا', sourceLabels[source])}
        <tr><td style="padding:10px 12px;font-weight:bold;vertical-align:top">الرسالة</td><td style="padding:10px 12px">${message.replace(/\n/g, '<br>')}</td></tr>
      </table>
    </div>
  `

  try {
    const ok = await sendEmail(`استشارة جديدة من ${name}${company ? ` — ${company}` : ''}`, html)
    if (!ok) throw new Error('Resend error')
  } catch {
    return { status: 'error', message: 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مجدداً.' }
  }

  return { status: 'success' }
}

export interface CallbackFormState {
  status: 'idle' | 'success' | 'error'
  message?: string
}

export async function submitCallbackRequest(
  _prev: CallbackFormState,
  formData: FormData
): Promise<CallbackFormState> {
  const name  = (formData.get('name')  as string)?.trim()
  const phone = (formData.get('phone') as string)?.trim()
  const time  = (formData.get('time')  as string)?.trim()

  const timeLabels: Record<string, string> = {
    morning: 'صباحاً (٩ - ١٢)',
    afternoon: 'ظهراً (١٢ - ٤)',
    evening: 'مساءً (٤ - ٨)',
    anytime: 'أي وقت',
  }

  if (!name || !phone) {
    return { status: 'error', message: 'يرجى إدخال الاسم ورقم الهاتف.' }
  }

  const html = `
    <div dir="rtl" style="font-family:Arial,sans-serif;max-width:640px">
      <h2 style="color:#4C63C7">طلب اتصال سريع من موقع هيمنة</h2>
      <table style="width:100%;border-collapse:collapse">
        ${row('الاسم', name)}
        ${row('رقم الهاتف', phone)}
        ${row('الوقت المفضل', timeLabels[time] || 'أي وقت')}
      </table>
    </div>
  `

  try {
    const ok = await sendEmail(`طلب اتصال سريع — ${name}`, html)
    if (!ok) throw new Error('Resend error')
  } catch {
    return { status: 'error', message: 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مجدداً.' }
  }

  return { status: 'success' }
}
