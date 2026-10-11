import { Menu, PanelTop } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { navbarLinks } from '@/routes/navigation'
import { ROUTES } from '@/routes/paths'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'
import { Button } from '@/components/ui/button'

interface AppNavbarProps {
  variant?: 'marketing' | 'app'
  onMenuClick?: () => void
  className?: string
}

export function AppNavbar({
  variant = 'marketing',
  onMenuClick,
  className,
}: AppNavbarProps) {
  if (variant === 'app') {
    return (
      <header
        className={cn(
          'sticky top-0 z-40 h-16 shrink-0',
          'border-b border-border/70',
          'bg-background/90 backdrop-blur-xl',
          className,
        )}
      >
        <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-7">
          <div className="flex items-center gap-3">
            {onMenuClick && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl lg:hidden"
                onClick={onMenuClick}
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}

            <div className="hidden items-center gap-2.5 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <PanelTop className="h-4 w-4" strokeWidth={1.8} />
              </div>

              <div className="leading-none">
                <p className="text-xs font-semibold text-foreground">
                  REXA Workspace
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Reasoning analysis
                </p>
              </div>
            </div>

            {onMenuClick && (
              <div className="sm:hidden">
                <Logo />
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </header>
    )
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b border-border/70',
        'bg-background/90 backdrop-blur-xl',
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMenuClick}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          <Logo />
        </div>

        <nav className="hidden items-center gap-7 md:flex">
          {navbarLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.title}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Button size="sm" variant="ghost" asChild>
            <Link to={ROUTES.AUTH.REGISTER}>Sign up</Link>
          </Button>

          <Button size="sm" asChild>
            <Link to={ROUTES.AUTH.LOGIN}>Sign in</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}