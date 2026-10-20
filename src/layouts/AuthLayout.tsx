import { Outlet, Link } from 'react-router-dom'
import { ArrowLeft, Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTheme } from '@/hooks'
import { AuthVisualPanel } from '@/components/common/AuthVisualPanel'

export function AuthLayout() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && theme === 'dark'

  return (
    <div
      className="
        min-h-svh
        bg-[#032C25]
        p-0
        lg:p-0
        dark:bg-[#021F1A]
      "
    >
      <div
        className="
          grid
          min-h-svh
          w-full
          overflow-hidden
          rounded-none
          border-0
          bg-[#F7F5EF]
          shadow-none
          lg:grid-cols-[58%_42%]
          dark:bg-[#062C26]
        "
      >

        {/* =====================================================
            LEFT — RExA VISUAL PANEL
           ===================================================== */}

        <section className="relative hidden min-h-svh overflow-hidden lg:block">
          <AuthVisualPanel />
          {/* Bottom copyright */}
          <p
            className="
              absolute
              bottom-7
              left-12
              z-20
              text-[12px]
              font-medium
              tracking-wide
              text-white/90
            "
          >
            © {new Date().getFullYear()} RExA. All rights reserved.
          </p>
        </section>

        {/* =====================================================
            RIGHT — AUTHENTICATION
           ===================================================== */}

        <section
          className="
            relative
            flex
            min-h-svh
            flex-col
            bg-[#FBFAF6]
            dark:bg-[#062C26]
          "
        >

          {/* Top controls */}
          <div
            className="
              flex
              items-center
              justify-end
              gap-5
              px-8
              pt-7
              sm:px-10
              lg:px-12
            "
          >

            {/* Theme */}
            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-[#D8DDD8]
                bg-white
                text-[#173C34]
                shadow-sm
                transition
                hover:bg-[#F1F5F1]
                dark:border-white/15
                dark:bg-white/5
                dark:text-white
                dark:hover:bg-white/10
              "
            >
              {isDark ? (
                <Sun className="h-5 w-5" strokeWidth={1.7} />
              ) : (
                <Moon className="h-5 w-5" strokeWidth={1.7} />
              )}
            </button>

            <div className="h-7 w-px bg-[#D8DDD8] dark:bg-white/15" />

            {/* Back */}
            <Link
              to="/"
              className="
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-[#173C34]
                transition
                hover:text-[#087653]
                dark:text-white
                dark:hover:text-[#59D5A6]
              "
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>

          {/* Actual login page */}
          <main
            className="
              flex
              flex-1
              items-center
              justify-center
              px-8
              py-10
              sm:px-12
              lg:px-14
              xl:px-16
            "
          >
            <div className="w-full max-w-[500px]">
              <Outlet />
            </div>
          </main>
        </section>
      </div>
    </div>
  )
}
