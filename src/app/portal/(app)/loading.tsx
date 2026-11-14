export default function PortalLoading() {
  return (
    <div className="pt-empty" style={{ paddingTop: '6rem' }} aria-busy="true" aria-live="polite">
      <svg viewBox="0 0 24 24" width={30} height={30} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'pt-spin 0.8s linear infinite' }}>
        <path d="M12 3a9 9 0 1 0 9 9" />
      </svg>
      <style>{`@keyframes pt-spin { to { transform: rotate(360deg) } }`}</style>
      <span>جارٍ التحميل…</span>
    </div>
  )
}
