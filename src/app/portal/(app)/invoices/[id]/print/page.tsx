import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getCurrentUser, canRead } from '@/portal/auth'
import { invoices as invoicesDef, PAYMENT_METHODS } from '@/portal/modules'
import { store } from '@/portal/store'
import { getSettings } from '@/portal/settings'
import { invoiceTotals, zatcaPayload, zatcaQrSvg } from '@/portal/zatca'
import { fmtMoney, fmtDate, fmtHijri } from '@/portal/format'
import { optionLabel, fieldByKey, type LineItem } from '@/portal/schema'
import { Icon } from '@/components/portal/Icon'
import { PrintButton } from '@/components/portal/PrintButton'

export const dynamic = 'force-dynamic'

export default async function InvoicePrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) redirect('/portal/login')
  if (!canRead(user.role, invoicesDef)) redirect('/portal')
  const inv = await store.get('invoices', id)
  if (!inv) notFound()
  const [client, settings, project] = await Promise.all([
    inv.client ? store.get('clients', String(inv.client)) : undefined,
    getSettings(),
    inv.project ? store.get('projects', String(inv.project)) : undefined,
  ])
  const items = (inv.items as LineItem[]) ?? []
  const t = invoiceTotals(items, inv.discount, inv.vatRate)
  const issued = new Date(`${String(inv.issueDate)}T12:00:00+03:00`)
  const payload = zatcaPayload({ sellerName: String(settings.companyName), vatNumber: String(settings.vatNumber ?? ''), timestamp: issued.toISOString(), total: t.total, vat: t.vat })
  const qr = await zatcaQrSvg(payload)
  const statusLabel = optionLabel(fieldByKey(invoicesDef, 'status'), inv.status)
  const isSimplified = !client?.vatNumber

  return (
    <div>
      <div className="pt-no-print" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <Link href={`/portal/invoices/${id}`} className="pt-btn pt-btn-ghost"><Icon name="arrowLeft" style={{ transform: 'scaleX(-1)' }} /> رجوع للفاتورة</Link>
        <PrintButton />
        <span className="pt-dim" style={{ fontSize: '0.78rem' }}>للحفظ كـ PDF: اطبع واختر «حفظ كـ PDF».</span>
        {!settings.vatNumber && <span className="pt-banner" style={{ margin: 0, padding: '0.5rem 0.8rem' }}><Icon name="alert" size={14} /> أضف الرقم الضريبي في الإعدادات ليكتمل رمز QR.</span>}
      </div>

      <article className="inv" dir="rtl">
        <style>{`
          .inv { background: #fff; color: #14173A; width: min(210mm, 100%); margin: 0 auto; padding: 18mm 16mm; border-radius: 6px; box-shadow: 0 20px 60px rgba(0,0,0,0.35); font-family: var(--font-role-heading); font-size: 12.5px; line-height: 1.6; position: relative; overflow: hidden; }
          .inv * { box-sizing: border-box; }
          .inv-band { position: absolute; inset-inline: 0; top: 0; height: 8px; background: linear-gradient(90deg, #33449E, #4C63C7, #8CA6E5); }
          .inv-head { display: flex; justify-content: space-between; gap: 2rem; align-items: flex-start; margin-bottom: 1.75rem; }
          .inv-brand { font-family: var(--font-role-display); font-size: 2rem; line-height: 1; color: #2E3373; }
          .inv-sub { color: #5B678F; font-size: 11px; margin-top: 0.35rem; }
          .inv-title { text-align: end; }
          .inv-title h1 { margin: 0; font-size: 1.35rem; color: #2E3373; }
          .inv-title .num { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 1rem; color: #33449E; direction: ltr; display: inline-block; }
          .inv-status { display: inline-block; margin-top: 0.4rem; padding: 0.15rem 0.6rem; border-radius: 20px; font-size: 10.5px; background: #EBF4FB; color: #33449E; border: 1px solid #D9EAF8; }
          .inv-meta { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.25rem; padding: 1rem 1.25rem; background: #F4F8FD; border-radius: 10px; margin-bottom: 1.5rem; }
          .inv-meta h4 { margin: 0 0 0.35rem; font-size: 10px; letter-spacing: 0.08em; color: #8A93B5; text-transform: uppercase; }
          .inv-meta div { font-size: 12px; }
          .inv-meta .ltr { direction: ltr; text-align: end; font-variant-numeric: tabular-nums; }
          .inv table { width: 100%; border-collapse: collapse; margin-bottom: 1.25rem; }
          .inv th { text-align: start; font-weight: 700; font-size: 11px; color: #5B678F; padding: 0.6rem 0.75rem; border-bottom: 2px solid #2E3373; }
          .inv td { padding: 0.65rem 0.75rem; border-bottom: 1px solid #E6ECF6; vertical-align: top; }
          .inv td.n, .inv th.n { text-align: end; font-variant-numeric: tabular-nums; white-space: nowrap; }
          .inv-totals { display: flex; justify-content: space-between; gap: 2rem; align-items: flex-start; }
          .inv-sum { min-width: 280px; }
          .inv-sum div { display: flex; justify-content: space-between; padding: 0.4rem 0; border-bottom: 1px dashed #E6ECF6; font-variant-numeric: tabular-nums; }
          .inv-sum .grand { border-bottom: 0; border-top: 2px solid #2E3373; margin-top: 0.3rem; padding-top: 0.6rem; font-size: 1.05rem; font-weight: 800; color: #2E3373; }
          .inv-qr { display: flex; gap: 1rem; align-items: center; }
          .inv-qr svg { width: 112px; height: 112px; }
          .inv-qr p { margin: 0; font-size: 10.5px; color: #5B678F; max-width: 200px; }
          .inv-foot { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #E6ECF6; display: flex; justify-content: space-between; gap: 2rem; font-size: 10.5px; color: #5B678F; }
          .inv-notes { white-space: pre-wrap; }
          @media print {
            @page { size: A4; margin: 10mm; }
            html, body { background: #fff !important; }
            .portal { display: block !important; background: #fff !important; min-height: 0 !important; }
            .pt-side, .pt-top, .pt-banner, .pt-toasts { display: none !important; }
            .pt-main { padding: 0 !important; }
            .inv { box-shadow: none; border-radius: 0; width: 100%; padding: 6mm 4mm; }
          }
        `}</style>
        <div className="inv-band" />
        <header className="inv-head">
          <div>
            <div className="inv-brand">{String(settings.companyName)}</div>
            <div className="inv-sub">{String(settings.companyNameEn ?? '')}</div>
            <div className="inv-sub">{String(settings.address ?? '')}</div>
            <div className="inv-sub" dir="ltr" style={{ textAlign: 'end' }}>{[settings.phone, settings.email].filter(Boolean).join(' · ')}</div>
          </div>
          <div className="inv-title">
            <h1>{isSimplified ? 'فاتورة ضريبية مبسطة' : 'فاتورة ضريبية'}</h1>
            <div className="inv-sub">{isSimplified ? 'Simplified Tax Invoice' : 'Tax Invoice'}</div>
            <span className="num">{String(inv.number)}</span>
            <div><span className="inv-status">{statusLabel}</span></div>
          </div>
        </header>

        <section className="inv-meta">
          <div>
            <h4>العميل · Bill to</h4>
            <div><strong>{client ? String(client.name) : '—'}</strong></div>
            {client?.brandEn ? <div style={{ color: '#5B678F' }}>{String(client.brandEn)}</div> : null}
            {client?.vatNumber ? <div className="ltr">VAT {String(client.vatNumber)}</div> : null}
            {client?.crNumber ? <div className="ltr">CR {String(client.crNumber)}</div> : null}
            {client?.city ? <div>{String(client.city)}</div> : null}
          </div>
          <div>
            <h4>التواريخ</h4>
            <div>الإصدار: {fmtDate(inv.issueDate)}</div>
            <div style={{ color: '#5B678F', fontSize: 11 }}>{fmtHijri(issued)}</div>
            {inv.dueDate ? <div>الاستحقاق: {fmtDate(inv.dueDate)}</div> : null}
            {project ? <div style={{ color: '#5B678F' }}>المشروع: {String(project.title)}</div> : null}
          </div>
          <div>
            <h4>بيانات البائع</h4>
            <div className="ltr">VAT {String(settings.vatNumber ?? '—')}</div>
            {settings.crNumber ? <div className="ltr">CR {String(settings.crNumber)}</div> : null}
            <div>الدفع: {optionLabel({ key: 'pm', label: '', type: 'select', options: PAYMENT_METHODS }, inv.paymentMethod)}</div>
            {settings.iban ? <div className="ltr" style={{ fontSize: 11 }}>{String(settings.iban)}</div> : null}
          </div>
        </section>

        <table>
          <thead>
            <tr><th style={{ width: '4%' }}>#</th><th>البيان · Description</th><th className="n">الكمية</th><th className="n">سعر الوحدة</th><th className="n">الإجمالي</th></tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i}><td>{i + 1}</td><td>{it.description}</td><td className="n">{it.qty}</td><td className="n">{fmtMoney(it.price, { digits: 2 })}</td><td className="n">{fmtMoney(it.qty * it.price, { digits: 2 })}</td></tr>
            ))}
          </tbody>
        </table>

        <section className="inv-totals">
          <div className="inv-qr">
            <div dangerouslySetInnerHTML={{ __html: qr }} />
            <p>رمز الفاتورة الإلكترونية وفق متطلبات هيئة الزكاة والضريبة والجمارك (المرحلة الأولى). امسحه للتحقق من اسم البائع والرقم الضريبي والإجمالي.</p>
          </div>
          <div className="inv-sum">
            <div><span>المجموع قبل الضريبة · Subtotal</span><span>{fmtMoney(t.subtotal, { digits: 2 })}</span></div>
            {t.discount > 0 && <div><span>الخصم · Discount</span><span>− {fmtMoney(t.discount, { digits: 2 })}</span></div>}
            <div><span>الخاضع للضريبة · Taxable</span><span>{fmtMoney(t.taxable, { digits: 2 })}</span></div>
            <div><span>ضريبة القيمة المضافة {t.vatRate}٪ · VAT</span><span>{fmtMoney(t.vat, { digits: 2 })}</span></div>
            <div className="grand"><span>الإجمالي المستحق · Total</span><span>{fmtMoney(t.total, { digits: 2 })}</span></div>
          </div>
        </section>

        <footer className="inv-foot">
          <div className="inv-notes">{inv.notes ? String(inv.notes) : String(settings.invoiceFooter ?? '')}</div>
          <div style={{ textAlign: 'end', whiteSpace: 'nowrap' }}>{settings.bankName ? <div>{String(settings.bankName)}</div> : null}<div>صفحة ١ من ١</div></div>
        </footer>
      </article>
    </div>
  )
}
