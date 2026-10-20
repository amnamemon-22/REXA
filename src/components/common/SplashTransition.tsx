import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { Link, useNavigate, type LinkProps } from 'react-router-dom'
import { Logo } from './Logo'
import { APP_FULL_NAME } from '@/routes/paths'
import { SplashNavigationProvider, type SplashNavigate, useSplashTransition } from './SplashNavigationContext'

function SplashScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setProgress(100))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Opening the requested REXA page"
      className="fixed inset-0 z-[100] flex min-h-svh items-center justify-center overflow-hidden bg-sidebar px-6 text-sidebar-foreground"
      style={{
        backgroundImage:
          'radial-gradient(circle at 22% 24%, color-mix(in srgb, var(--sidebar-primary) 15%, transparent), transparent 34%), radial-gradient(circle at 80% 78%, color-mix(in srgb, var(--sidebar-primary) 10%, transparent), transparent 30%), linear-gradient(140deg, var(--sidebar-accent), var(--sidebar))',
      }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 1280 760"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full text-sidebar-primary/25"
      >
        <g fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M-20 130 190 300 390 190 590 330 790 150 1010 280 1300 90" />
          <path d="M-30 580 190 300 350 560 590 330 730 610 1010 280 1310 590" />
          <path d="M90 -20 190 300 390 190 470 -30M390 190 730 610 790 150 1120 -20M590 330 350 560 790 720 1010 280" />
          <path d="M-10 130 590 330 1300 90M-30 580 730 610 1310 590M190 300 1010 280 790 720" />
        </g>
        <g fill="currentColor">
          <circle cx="190" cy="300" r="3" />
          <circle cx="390" cy="190" r="3" />
          <circle cx="590" cy="330" r="3" />
          <circle cx="790" cy="150" r="3" />
          <circle cx="1010" cy="280" r="3" />
          <circle cx="350" cy="560" r="3" />
          <circle cx="730" cy="610" r="3" />
          <circle cx="1120" cy="-10" r="3" />
          <circle cx="790" cy="720" r="3" />
        </g>
      </svg>

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
        <div className="scale-125 sm:scale-150">
          <Logo className="pointer-events-none" tone="dark" />
        </div>
        <p className="mt-9 max-w-md text-sm leading-relaxed text-sidebar-foreground/75 sm:text-base">
          {APP_FULL_NAME}
        </p>
        <div
          className="mt-10 h-1.5 w-64 max-w-[75vw] overflow-hidden rounded-full bg-sidebar-foreground/15 sm:w-72"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-sidebar-primary shadow-[0_0_18px_color-mix(in_srgb,var(--sidebar-primary)_55%,transparent)]"
            style={{
              width: `${progress}%`,
              transition: 'width 650ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />
        </div>
        <p className="mt-3 text-xs text-sidebar-foreground/70 sm:text-sm">
          Preparing your next page…
        </p>
      </div>
    </div>
  )
}

interface SplashTransitionProviderProps {
  children: ReactNode
}

export function SplashTransitionProvider({ children }: SplashTransitionProviderProps) {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const activeRef = useRef(false)
  const timersRef = useRef<number[]>([])

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer))
    },
    [],
  )

  const navigateWithSplash = useCallback<SplashNavigate>(
    (to, options) => {
      if (activeRef.current) return

      activeRef.current = true
      setIsVisible(true)
      timersRef.current.push(
        window.setTimeout(() => navigate(to, options), 650),
        window.setTimeout(() => {
          activeRef.current = false
          setIsVisible(false)
          timersRef.current = []
        }, 820),
      )
    },
    [navigate],
  )

  return (
    <SplashNavigationProvider value={navigateWithSplash}>
      {children}
      {isVisible && <SplashScreen />}
    </SplashNavigationProvider>
  )
}

export function SplashLink({
  to,
  replace,
  state,
  target,
  reloadDocument,
  onClick,
  ...props
}: LinkProps) {
  const navigateWithSplash = useSplashTransition()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      (target && target !== '_self') ||
      reloadDocument ||
      !navigateWithSplash
    ) {
      return
    }

    event.preventDefault()
    navigateWithSplash(to, { replace, state })
  }

  return (
    <Link
      {...props}
      to={to}
      replace={replace}
      state={state}
      target={target}
      reloadDocument={reloadDocument}
      onClick={handleClick}
    />
  )
}
