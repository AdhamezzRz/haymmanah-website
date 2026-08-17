'use client'

export const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--navy)',
  border: '1px solid rgba(76,99,199,0.25)',
  borderRadius: 6,
  padding: '0.875rem 1rem',
  fontFamily: 'var(--font-role-body)',
  fontSize: 'var(--text-body)',
  color: 'var(--ivory)',
  outline: 'none',
  transition: 'border-color 0.2s',
  direction: 'rtl',
}

export const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-role-heading)',
  fontSize: 'var(--text-eyebrow)',
  color: 'var(--gold)',
  letterSpacing: '0.1em',
  marginBottom: '0.5rem',
  textTransform: 'uppercase',
}

/* ── Checkbox pill (multi-select, e.g. services wanted) ── */
export function CheckboxPill({
  name, value, label, defaultChecked,
}: { name: string; value: string; label: string; defaultChecked?: boolean }) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.625rem',
        padding: '0.625rem 0.875rem',
        border: '1px solid rgba(76,99,199,0.2)',
        borderRadius: 6,
        cursor: 'pointer',
        fontFamily: 'var(--font-role-body)',
        fontSize: 'var(--text-small)',
        color: 'var(--ivory)',
        transition: 'border-color 0.2s, background 0.2s',
      }}
      className="choice-pill"
    >
      <input
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        style={{
          width: 16,
          height: 16,
          accentColor: 'var(--gold)',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      />
      {label}
    </label>
  )
}

/* ── Radio pill (single-select, e.g. budget / timeline) ── */
export function RadioPill({
  name, value, label, defaultChecked,
}: { name: string; value: string; label: string; defaultChecked?: boolean }) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.625rem',
        padding: '0.625rem 0.875rem',
        border: '1px solid rgba(76,99,199,0.2)',
        borderRadius: 6,
        cursor: 'pointer',
        fontFamily: 'var(--font-role-body)',
        fontSize: 'var(--text-small)',
        color: 'var(--ivory)',
        transition: 'border-color 0.2s, background 0.2s',
      }}
      className="choice-pill"
    >
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        style={{
          width: 16,
          height: 16,
          accentColor: 'var(--gold)',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      />
      {label}
    </label>
  )
}

export function FieldGroup({ children, columns = 2 }: { children: React.ReactNode; columns?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '0.625rem' }}>
      {children}
    </div>
  )
}
