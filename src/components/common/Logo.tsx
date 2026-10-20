import { useId } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useSplashTransition } from './SplashNavigationContext'

interface RexaLogoArtworkProps {
  className?: string
  tone?: 'auto' | 'light' | 'dark'
  showTagline?: boolean
  markOnly?: boolean
}

/** The shared REXA mark and wordmark, drawn as inline SVG for crisp scaling. */
export function RexaLogoArtwork({
  className,
  tone = 'auto',
  showTagline = true,
  markOnly = false,
}: RexaLogoArtworkProps) {
  const gradientId = `rexa-mark-gradient-${useId().replace(/:/g, '')}`
  const wordmarkClass =
    tone === 'dark'
      ? 'text-white'
      : tone === 'light'
        ? 'text-sidebar'
        : 'text-sidebar dark:text-white'
  const taglineClass =
    tone === 'dark'
      ? 'text-[#B8E6C6]'
      : tone === 'light'
        ? 'text-[#286A56]'
        : 'text-[#286A56] dark:text-[#8AD5B6]'

  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <svg
        aria-hidden="true"
        viewBox="0 0 70 70"
        className="h-full w-auto shrink-0"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--sidebar-primary)" />
            <stop offset="1" stopColor="var(--sidebar-accent)" />
          </linearGradient>
        </defs>
        <path
          fill={`url(#${gradientId})`}
          fillRule="evenodd"
          d="M2 7h37c15 0 25 8 25 21 0 11-7 19-19 22l23 19H43L25 49H18v20H2V7Zm0 14v14h37c6 0 9-2 9-7s-3-7-9-7H2Z"
        />
      </svg>
      {!markOnly && <span className="flex min-w-0 flex-col justify-center leading-none">
        <span className={cn('text-[1.55em] font-extrabold tracking-[-0.045em]', wordmarkClass)}>
          REXA
        </span>
        {showTagline && (
          <span className={cn('mt-[0.28em] whitespace-nowrap text-[0.7em] font-medium tracking-[0.005em]', taglineClass)}>
            Understand. Analyze. Improve.
          </span>
        )}
      </span>}
    </span>
  )
}

interface LogoProps {
  className?: string
  showText?: boolean
  collapsed?: boolean
  transitionOnNavigate?: boolean
  tone?: 'auto' | 'light' | 'dark'
}

export function Logo({
  className,
  showText = true,
  collapsed = false,
  transitionOnNavigate = false,
  tone = 'auto',
}: LogoProps) {
  const navigateWithSplash = useSplashTransition()

  return (
    <Link
      to="/"
      onClick={(event) => {
        if (!transitionOnNavigate || !navigateWithSplash || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        event.preventDefault()
        navigateWithSplash('/')
      }}
      aria-label="REXA home"
      className={cn('flex items-center gap-2.5 transition-opacity hover:opacity-85', className)}
    >
      {showText && !collapsed ? (
        <div className="flex h-9 items-center text-[11px]">
          <RexaLogoArtwork className="h-8" tone={tone} />
        </div>
      ) : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-sidebar-primary/15 p-1 text-sidebar-primary ring-1 ring-sidebar-primary/10">
          <RexaLogoArtwork className="h-7 w-7" tone="dark" markOnly />
        </div>
      )}
    </Link>
  )
}
