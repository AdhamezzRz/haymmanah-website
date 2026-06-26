import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow?: string
  children: React.ReactNode
  sub?: string
  className?: string
  level?: 1 | 2 | 3
  gold?: boolean
}

export function SectionHeading({
  eyebrow,
  children,
  sub,
  className,
  level = 2,
  gold = false,
}: SectionHeadingProps) {
  const Tag = `h${level}` as const

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {eyebrow && (
        <p
          style={{
            fontFamily: 'var(--font-role-heading)',
            fontSize: 'var(--text-eyebrow)',
            color: 'var(--gold)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          {eyebrow}
        </p>
      )}
      <Tag
        className={gold ? 'text-gold-grad' : ''}
        style={{
          fontFamily: level === 1 ? 'var(--font-role-display)' : 'var(--font-role-heading)',
          fontSize: level === 1 ? 'var(--text-h1)' : 'var(--text-h2)',
          color: gold ? undefined : 'var(--ivory)',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
        }}
      >
        {children}
      </Tag>
      {sub && (
        <p
          style={{
            fontFamily: 'var(--font-role-body)',
            fontSize: 'var(--text-body)',
            color: 'var(--muted)',
            maxWidth: '60ch',
            lineHeight: 1.7,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  )
}
