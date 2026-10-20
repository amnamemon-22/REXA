import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { NavGroup } from '@/types'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface SidebarNavProps {
  groups: NavGroup[]
  collapsed?: boolean
  onNavigate?: () => void
}

export function SidebarNav({
  groups,
  collapsed = false,
  onNavigate,
}: SidebarNavProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-5">
          {groups.map((group, groupIndex) => (
            <div key={group.label ?? groupIndex}>
              {group.label && !collapsed && (
                <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/45">
                  {group.label}
                </p>
              )}
              <ul className="flex flex-col gap-1.5">
                {group.items.map((item) => {
                  const link = (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        cn(
                          'group relative flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sidebar-ring',
                          isActive
                            ? 'bg-sidebar-accent text-sidebar-foreground shadow-sm ring-1 ring-sidebar-primary/15'
                            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/75 hover:text-sidebar-accent-foreground',
                          item.disabled && 'pointer-events-none opacity-50',
                          collapsed && 'justify-center px-2',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span
                              aria-hidden="true"
                              className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-sidebar-primary"
                            />
                          )}
                          <item.icon
                            className={cn(
                              'h-[18px] w-[18px] shrink-0 transition-colors',
                              isActive
                                ? 'text-sidebar-primary'
                                : 'text-current group-hover:text-sidebar-primary',
                            )}
                            aria-hidden="true"
                          />
                          {!collapsed && (
                            <>
                              <span className="flex-1 truncate">{item.title}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="ml-auto text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </NavLink>
                  )

                  if (collapsed) {
                    return (
                      <li key={item.href}>
                        <Tooltip>
                          <TooltipTrigger asChild>{link}</TooltipTrigger>
                          <TooltipContent side="right">{item.title}</TooltipContent>
                        </Tooltip>
                      </li>
                    )
                  }

                  return <li key={item.href}>{link}</li>
                })}
              </ul>
              {groupIndex < groups.length - 1 && !collapsed && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>
    </TooltipProvider>
  )
}
