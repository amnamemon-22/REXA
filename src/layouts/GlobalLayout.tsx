import { Outlet } from 'react-router-dom'
import { AuthProvider, ThemeProvider } from '@/context'
import { ErrorBoundary } from '@/components/common'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SplashTransitionProvider } from '@/components/common/SplashTransition'

export function GlobalLayout() {
  return (
    <ThemeProvider defaultTheme="system">
      <AuthProvider>
        <TooltipProvider>
          <SplashTransitionProvider>
            <ErrorBoundary>
              <div className="relative min-h-svh bg-background">
                <Outlet />
              </div>
            </ErrorBoundary>
          </SplashTransitionProvider>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
