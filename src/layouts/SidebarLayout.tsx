import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSidebar } from '@/hooks'
import { AppNavbar, AppSidebar } from '@/components/common'
import { Sheet, SheetContent } from '@/components/ui/sheet'

export function SidebarLayout() {
  const { isOpen, isCollapsed, isMobile, toggle, close } = useSidebar()

  return (
    <div className="rexa-app-shell flex h-dvh w-full overflow-hidden">
      {!isMobile && (
        <AppSidebar
          collapsed={isCollapsed}
          onToggle={toggle}
        />
      )}

      {isMobile && (
        <Sheet
          open={isOpen}
          onOpenChange={(open) => !open && close()}
        >
          <SheetContent
            side="left"
            className="h-dvh w-[264px] border-sidebar-border bg-sidebar p-0 text-sidebar-foreground"
          >
            <AppSidebar onNavigate={close} />
          </SheetContent>
        </Sheet>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <AppNavbar
          variant="app"
          onMenuClick={isMobile ? toggle : undefined}
        />

        <motion.main
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.25,
            ease: 'easeOut',
          }}
          className="rexa-main-surface rexa-scrollbar min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  )
}