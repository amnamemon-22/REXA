import { Link } from 'react-router-dom'
import { Waypoints } from 'lucide-react'
import { cn } from '@/lib/utils'
import { APP_NAME } from '@/routes/paths'

interface LogoProps {
  className?: string
  showText?: boolean
  collapsed?: boolean
}

export function Logo({ className, showText = true, collapsed = false }: LogoProps) {
  return (
    <Link to="/" className={cn('flex items-center gap-2.5 transition-opacity hover:opacity-85', className)}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary/15 text-sidebar-primary ring-1 ring-sidebar-primary/10">
        <Waypoints className="h-[18px] w-[18px]" aria-hidden="true" />
      </div>
      {showText && !collapsed && (
        <div className="flex flex-col leading-none">
          <span className="text-[17px] font-bold tracking-[-0.02em] text-sidebar-foreground">{APP_NAME}</span>
          <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.12em] text-sidebar-foreground/55">Reasoning analysis</span>
        </div>
      )}
    </Link>
  )
}
