import { cn } from '@/lib/utils'
import Link from 'next/link'

type ButtonVariant = 'primary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '0.5rem 1.25rem', fontSize: '0.875rem' },
  md: { padding: '0.75rem 1.75rem', fontSize: '1rem' },
  lg: { padding: '1rem 2.5rem', fontSize: '1.0625rem' },
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  className,
  onClick,
  type = 'button',
  disabled,
}: ButtonProps) {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontFamily: 'var(--font-role-heading)',
    fontWeight: 600,
    borderRadius: '4px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: `all var(--dur-micro) var(--ease-sovereign)`,
    textDecoration: 'none',
    ...sizeStyles[size],
  }

  const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      background: 'var(--gold-grad)',
      color: 'var(--on-gold)',
      border: 'none',
    },
    outline: {
      background: 'transparent',
      color: 'var(--gold)',
      border: '1px solid var(--gold)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--ivory)',
      border: 'none',
    },
  }

  const combined = { ...base, ...variantStyles[variant] }

  if (href) {
    return (
      <Link href={href} style={combined} className={cn('btn', className)}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={combined}
      className={cn('btn', className)}
    >
      {children}
    </button>
  )
}
