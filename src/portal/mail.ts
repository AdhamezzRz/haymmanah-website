/**
 * Transactional email for the portal — server only.
 *
 * Enabled only when BOTH are set:
 *   RESEND_API_KEY      — already used by the website contact form
 *   PORTAL_MAIL_FROM    — a sender on a domain verified in Resend,
 *                         e.g. "نظام هيمنة <no-reply@himna.sa>"
 * (Resend's shared onboarding@resend.dev sender only delivers to the Resend
 * account owner, so it can't be used to email team members.)
 */
export function mailEnabled(): boolean {
  return !!(process.env.RESEND_API_KEY && process.env.PORTAL_MAIL_FROM)
}

export async function sendMail(to: string, subject: string, html: string): Promise<boolean> {
  if (!mailEnabled()) return false
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: process.env.PORTAL_MAIL_FROM, to: [to], subject, html }),
    })
    return res.ok
  } catch {
    return false
  }
}

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export function resetEmailHtml(name: string, url: string, hours: number): string {
  return `<!doctype html><html lang="ar" dir="rtl"><body style="margin:0;background:#EEF2FF;font-family:Tahoma,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
    <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:14px;border:1px solid #D9E1F7" cellpadding="0" cellspacing="0">
      <tr><td style="padding:28px 28px 8px;text-align:right">
        <div style="font-size:22px;font-weight:bold;color:#2E3373">هيمنة</div>
        <div style="font-size:12px;color:#6B7AA8;margin-top:2px">نظام إدارة الوكالة</div>
      </td></tr>
      <tr><td style="padding:8px 28px;text-align:right;color:#1B2140;font-size:15px;line-height:1.9">
        <p style="margin:0 0 12px">أهلاً ${esc(name)}،</p>
        <p style="margin:0 0 20px">وصلنا طلب لإعادة تعيين كلمة المرور لحسابك. اضغط الزر لاختيار كلمة مرور جديدة:</p>
        <p style="margin:0 0 24px;text-align:center"><a href="${esc(url)}" style="display:inline-block;background:#4C63C7;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:bold">اختيار كلمة مرور جديدة</a></p>
        <p style="margin:0 0 8px;font-size:13px;color:#5B678F">الرابط صالح لمدة ${hours} ساعة ويعمل مرة واحدة فقط.</p>
        <p style="margin:0 0 24px;font-size:13px;color:#5B678F">إذا لم تطلب ذلك فتجاهل الرسالة — كلمة مرورك الحالية لم تتغير.</p>
      </td></tr>
    </table>
  </td></tr></table></body></html>`
}
