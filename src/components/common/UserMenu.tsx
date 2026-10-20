import { LogOut, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks'
import { getInitials } from '@/utils'
import { roleLabel } from '@/lib/roles'
import { ROUTES } from '@/routes/paths'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useSplashTransition } from './SplashNavigationContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function UserMenu() {
  const { user, logout } = useAuth()
  const navigateWithSplash = useSplashTransition()

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 gap-2 rounded-xl px-1.5 pr-2.5 hover:bg-muted"
          aria-label="Account menu"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-left sm:block">
            <span className="block max-w-[150px] truncate text-xs font-semibold leading-tight text-foreground">
              {user.name}
            </span>
            <span className="mt-0.5 block text-[10px] leading-tight text-muted-foreground">
              {roleLabel(user.role)}
            </span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground">{roleLabel(user.role)}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={ROUTES.APP.SETTINGS}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            logout()
            if (navigateWithSplash) {
              navigateWithSplash(ROUTES.AUTH.LOGIN, { replace: true })
            } else {
              window.location.href = ROUTES.AUTH.LOGIN
            }
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
