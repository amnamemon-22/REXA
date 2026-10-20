import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AppNavbar } from '@/components/common'

export function NavbarLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <AppNavbar variant="marketing" />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1"
      >
        <Outlet />
      </motion.main>

    </div>
  )
}
