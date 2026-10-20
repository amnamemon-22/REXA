import { PanelLeftClose, PanelLeftOpen, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks'
import { getSidebarNavigation } from '@/routes/navigation'
import { ROUTES } from '@/routes/paths'
import { getInitials } from '@/utils'
import { roleLabel } from '@/lib/roles'
import { Logo } from './Logo'
import { SidebarNav } from './SidebarNav'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface AppSidebarProps {
  collapsed?: boolean
  onToggle?: () => void
  onNavigate?: () => void
  className?: string
}

export function AppSidebar({ collapsed = false, onToggle, onNavigate, className }: AppSidebarProps) {
  const { user } = useAuth()
  const groups = getSidebarNavigation(user?.role)

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-300',
        collapsed ? 'w-[68px]' : 'w-64',
        className,
      )}
    >
      <div className={cn('flex h-[76px] items-center border-b border-sidebar-border px-5', collapsed ? 'justify-center px-2' : 'justify-between')}>
        <Logo collapsed={collapsed} showText={!collapsed} transitionOnNavigate tone="dark" />
        {onToggle && !collapsed && (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white" onClick={onToggle} aria-label="Collapse sidebar">
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        )}
      </div>

      {collapsed && onToggle && (
        <div className="flex justify-center border-b border-sidebar-border py-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-sidebar-foreground/70" onClick={onToggle} aria-label="Expand sidebar">
            <PanelLeftOpen className="h-4 w-4" />
          </Button>
        </div>
      )}

      <SidebarNav groups={groups} collapsed={collapsed} onNavigate={onNavigate} />

      {user && (
        <div className="border-t border-sidebar-border p-3">
          <div className={cn('flex items-center gap-3 rounded-xl bg-sidebar-accent/60 p-2.5', collapsed && 'justify-center p-2')}>
            <Avatar className="h-9 w-9 shrink-0 ring-1 ring-sidebar-primary/20">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-sidebar-primary/15 text-xs font-semibold text-sidebar-primary">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-sidebar-foreground">{user.name}</p>
                <p className="mt-0.5 truncate text-[10px] text-sidebar-foreground/60">{roleLabel(user.role)}</p>
              </div>
            )}
            {!collapsed && (
              <Link to={ROUTES.APP.SETTINGS} className="rounded-lg p-1.5 text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-white" aria-label="Settings">
                <Settings className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      )}
    </aside>
  )
}
