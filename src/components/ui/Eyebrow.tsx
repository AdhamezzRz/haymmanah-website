import { cn } from '@/lib/utils'

interface EyebrowProps {
  children: React.ReactNode
  className?: string
}

export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <p
      className={cn(className)}
      style={{
        fontFamily: 'var(--font-role-heading)',
        fontSize: 'var(--text-eyebrow)',
        color: 'var(--gold)',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        fontWeight: 600,
      }}
    >
      {children}
    </p>
  )
}
