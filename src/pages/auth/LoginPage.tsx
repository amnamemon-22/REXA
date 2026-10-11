import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  UserRound,
  Loader2,
} from 'lucide-react'

import { useAuth } from '@/hooks'
import { loginSchema, type LoginFormValues } from '@/utils'
import { canAccessPath, homePathForRole } from '@/lib/roles'
import { ROUTES } from '@/routes/paths'
import { FormField } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'student',
    },
    mode: 'onBlur',
  })

  const role = watch('role')

  const from =
    (location.state as { from?: Location } | null)?.from?.pathname ?? null

  const onSubmit = async (values: LoginFormValues) => {
    setError(null)

    try {
      const user = await login(values)

      const next =
        from && canAccessPath(user.role, from)
          ? from
          : homePathForRole(user.role)

      navigate(next, { replace: true })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to sign in. Please check your credentials.',
      )
    }
  }

  return (
    <div className="w-full">

      {/* =====================================================
          HEADER
         ===================================================== */}

      <div className="mb-8">

        <p
          className="
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.28em]
            text-[#087653]
            dark:text-[#59D5A6]
          "
        >
          Welcome to RExA
        </p>

        <h1
          className="
            mt-3
            font-serif
            text-[42px]
            font-semibold
            leading-[1.05]
            tracking-[-0.035em]
            text-[#102D3D]
            dark:text-white
            sm:text-[46px]
          "
        >
          Sign in to continue
        </h1>

        <p
          className="
            mt-3
            text-[15px]
            leading-relaxed
            text-[#66716E]
            dark:text-[#B8CCC5]
          "
        >
          Access your RExA account as a student or instructor.
        </p>
      </div>

      {/* =====================================================
          ERROR
         ===================================================== */}

      {error && (
        <Alert
          variant="destructive"
          className="mb-6"
        >
          <AlertCircle />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* =====================================================
          FORM
         ===================================================== */}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        noValidate
      >

        {/* ROLE SELECTION */}

        <div className="grid grid-cols-2 gap-4">

          {/* STUDENT */}

          <button
            type="button"
            onClick={() =>
              setValue('role', 'student', {
                shouldValidate: true,
              })
            }
            className={cn(
              `
                flex
                h-[66px]
                items-center
                justify-between
                rounded-xl
                border
                px-5
                text-left
                transition-all
              `,
              role === 'student'
                ? `
                    border-[#087653]
                    bg-[#EAF6F0]
                    text-[#173C34]
                    shadow-sm
                    dark:border-[#27B985]
                    dark:bg-[#0B5141]
                    dark:text-white
                  `
                : `
                    border-[#D9DED9]
                    bg-transparent
                    text-[#26332F]
                    hover:border-[#087653]/50
                    dark:border-white/15
                    dark:text-white
                    dark:hover:border-[#27B985]/50
                  `,
            )}
          >
            <span className="flex items-center gap-3">
              <GraduationCap
                className="h-6 w-6"
                strokeWidth={1.7}
              />

              <span className="text-[15px] font-medium">
                Student
              </span>
            </span>

            <span
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded-full border',
                role === 'student'
                  ? 'border-[#087653] dark:border-[#59D5A6]'
                  : 'border-[#AEB8B3] dark:border-white/30',
              )}
            >
              {role === 'student' && (
                <span className="h-2.5 w-2.5 rounded-full bg-[#087653] dark:bg-[#59D5A6]" />
              )}
            </span>
          </button>

          {/* INSTRUCTOR */}

          <button
            type="button"
            onClick={() =>
              setValue('role', 'teacher', {
                shouldValidate: true,
              })
            }
            className={cn(
              `
                flex
                h-[66px]
                items-center
                justify-between
                rounded-xl
                border
                px-5
                text-left
                transition-all
              `,
              role === 'teacher'
                ? `
                    border-[#087653]
                    bg-[#EAF6F0]
                    text-[#173C34]
                    shadow-sm
                    dark:border-[#27B985]
                    dark:bg-[#0B5141]
                    dark:text-white
                  `
                : `
                    border-[#D9DED9]
                    bg-transparent
                    text-[#26332F]
                    hover:border-[#087653]/50
                    dark:border-white/15
                    dark:text-white
                    dark:hover:border-[#27B985]/50
                  `,
            )}
          >
            <span className="flex items-center gap-3">
              <UserRound
                className="h-6 w-6"
                strokeWidth={1.7}
              />

              <span className="text-[15px] font-medium">
                Instructor
              </span>
            </span>

            <span
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded-full border',
                role === 'teacher'
                  ? 'border-[#087653] dark:border-[#59D5A6]'
                  : 'border-[#AEB8B3] dark:border-white/30',
              )}
            >
              {role === 'teacher' && (
                <span className="h-2.5 w-2.5 rounded-full bg-[#087653] dark:bg-[#59D5A6]" />
              )}
            </span>
          </button>
        </div>

        {/* EMAIL */}

        <FormField
          control={control}
          name="email"
          label="Email address"
        >
          {(field) => (
            <div className="relative">
              <Mail
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  z-10
                  h-5
                  w-5
                  -translate-y-1/2
                  text-[#66716E]
                  dark:text-[#9FB7AF]
                "
                strokeWidth={1.7}
              />

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                name={field.name}
                onChange={field.onChange}
                onBlur={field.onBlur}
                value={(field.value as string) ?? ''}
                className="
                  h-[58px]
                  rounded-xl
                  border-[#D7DDD8]
                  bg-transparent
                  pl-12
                  text-[15px]
                  shadow-none
                  focus-visible:border-[#087653]
                  focus-visible:ring-[#087653]/20
                  dark:border-white/15
                  dark:bg-white/[0.03]
                  dark:text-white
                  dark:placeholder:text-white/35
                "
              />
            </div>
          )}
        </FormField>

        {/* PASSWORD */}

        <FormField
          control={control}
          name="password"
          label="Password"
        >
          {(field) => (
            <div className="relative">

              <LockKeyhole
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  z-10
                  h-5
                  w-5
                  -translate-y-1/2
                  text-[#66716E]
                  dark:text-[#9FB7AF]
                "
                strokeWidth={1.7}
              />

              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                name={field.name}
                onChange={field.onChange}
                onBlur={field.onBlur}
                value={(field.value as string) ?? ''}
                className="
                  h-[58px]
                  rounded-xl
                  border-[#D7DDD8]
                  bg-transparent
                  pl-12
                  pr-12
                  text-[15px]
                  shadow-none
                  focus-visible:border-[#087653]
                  focus-visible:ring-[#087653]/20
                  dark:border-white/15
                  dark:bg-white/[0.03]
                  dark:text-white
                  dark:placeholder:text-white/35
                "
              />

              <button
                type="button"
                className="
                  absolute
                  inset-y-0
                  right-0
                  flex
                  items-center
                  px-4
                  text-[#71807A]
                  hover:text-[#173C34]
                  dark:text-[#9FB7AF]
                  dark:hover:text-white
                "
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
                onClick={() =>
                  setShowPassword((open) => !open)
                }
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          )}
        </FormField>

        {/* FORGOT PASSWORD */}

        <div className="-mt-1 flex justify-end">
          <Link
            to={ROUTES.AUTH.FORGOT_PASSWORD}
            className="
              text-sm
              font-medium
              text-[#087653]
              hover:underline
              dark:text-[#59D5A6]
            "
          >
            Forgot password?
          </Link>
        </div>

        {/* SIGN IN */}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="
            h-[60px]
            w-full
            rounded-xl
            bg-[#087653]
            text-[16px]
            font-semibold
            text-white
            shadow-none
            hover:bg-[#076447]
            dark:bg-[#07966E]
            dark:hover:bg-[#08A97D]
          "
        >
          {isSubmitting && (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          )}

          Sign in

          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        {/* DIVIDER */}

        <div className="flex items-center gap-4 py-1">
          <div className="h-px flex-1 bg-[#D9DED9] dark:bg-white/15" />

          <span
            className="
              text-[12px]
              font-medium
              uppercase
              tracking-[0.12em]
              text-[#8A9590]
              dark:text-[#849D95]
            "
          >
            Or continue with
          </span>

          <div className="h-px flex-1 bg-[#D9DED9] dark:bg-white/15" />
        </div>

        {/* GOOGLE */}

        <Button
          type="button"
          variant="outline"
          className="
            h-[58px]
            w-full
            rounded-xl
            border-[#D9DED9]
            bg-transparent
            text-[15px]
            font-medium
            text-[#173C34]
            hover:bg-[#F1F4F0]
            dark:border-white/15
            dark:bg-white/[0.03]
            dark:text-white
            dark:hover:bg-white/10
          "
        >
          <span className="mr-3 text-lg font-bold">
            G
          </span>

          Continue with Google
        </Button>
      </form>

      {/* REGISTER */}

      <p
        className="
          mt-7
          text-center
          text-sm
          text-[#71807A]
          dark:text-[#9FB7AF]
        "
      >
        New here?{' '}

        <Link
          to={ROUTES.AUTH.REGISTER}
          className="
            font-medium
            text-[#087653]
            hover:underline
            dark:text-[#59D5A6]
          "
        >
          Create an account
        </Link>
      </p>
    </div>
  )
}
