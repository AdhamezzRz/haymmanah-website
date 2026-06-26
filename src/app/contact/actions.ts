'use server'

export interface ContactFormState {
  status: 'idle' | 'success' | 'error'
  message?: string
}

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name    = (formData.get('name')    as string)?.trim()
  const company = (formData.get('company') as string)?.trim()
  const email   = (formData.get('email')   as string)?.trim()
  const phone   = (formData.get('phone')   as string)?.trim()
  const service = (formData.get('service') as string)?.trim()
  const message = (formData.get('message') as string)?.trim()

  if (!name || !email || !message) {
    return { status: 'error', message: 'يرجى ملء جميع الحقول المطلوبة.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { status: 'error', message: 'البريد الإلكتروني غير صحيح.' }
  }

  const RESEND_KEY = process.env.RESEND_API_KEY

  if (RESEND_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'هيمنة — الموقع <onboarding@resend.dev>',
          to: ['RH-2025@outlook.sa'],
          subject: `رسالة جديدة من ${name}${company ? ` — ${company}` : ''}`,
          html: `
            <div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px">
              <h2 style="color:#c9a14a">رسالة جديدة من موقع هيمنة</h2>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">الاسم</td><td style="padding:8px;border-bottom:1px solid #eee">${name}</td></tr>
                ${company ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">الشركة</td><td style="padding:8px;border-bottom:1px solid #eee">${company}</td></tr>` : ''}
                <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">البريد</td><td style="padding:8px;border-bottom:1px solid #eee">${email}</td></tr>
                ${phone ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">الهاتف</td><td style="padding:8px;border-bottom:1px solid #eee">${phone}</td></tr>` : ''}
                ${service ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">الخدمة</td><td style="padding:8px;border-bottom:1px solid #eee">${service}</td></tr>` : ''}
                <tr><td style="padding:8px;font-weight:bold;vertical-align:top">الرسالة</td><td style="padding:8px">${message.replace(/\n/g, '<br>')}</td></tr>
              </table>
            </div>
          `,
        }),
      })
      if (!res.ok) throw new Error('Resend error')
    } catch {
      return { status: 'error', message: 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مجدداً.' }
    }
  }

  return { status: 'success' }
}
