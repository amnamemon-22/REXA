import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, GraduationCap, Loader2, UserRound } from 'lucide-react'
import { useAuth } from '@/hooks'
import { registerSchema, type RegisterFormValues } from '@/utils'
import { homePathForRole } from '@/lib/roles'
import { ROUTES } from '@/routes/paths'
import { FormField } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

const inputClassName = `
  h-[58px]
  rounded-xl
  border-[#D7DDD8]
  bg-transparent
  text-[15px]
  shadow-none
  focus-visible:border-[#087653]
  focus-visible:ring-[#087653]/20
  dark:border-white/15
  dark:bg-white/[0.03]
  dark:text-white
  dark:placeholder:text-white/35
`

const roleOptionClassName = (selected: boolean) =>
  cn(
    'flex h-[58px] items-center justify-between rounded-xl border px-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087653]/30',
    selected
      ? 'border-[#087653] bg-[#EAF6F0] text-[#173C34] shadow-sm dark:border-[#27B985] dark:bg-[#0B5141] dark:text-white'
      : 'border-[#D9DED9] bg-transparent text-[#26332F] hover:border-[#087653]/50 dark:border-white/15 dark:text-white dark:hover:border-[#27B985]/50',
  )

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'student',
      rollNumber: '',
      institutionCode: '',
    },
  })

  const role = watch('role')

  const onSubmit = async (values: RegisterFormValues) => {
    setError(null)
    try {
      const user = await register(values)
      navigate(homePathForRole(user.role), { replace: true })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to create your account. Please try again.',
      )
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#087653] dark:text-[#59D5A6]">
          Welcome to RExA
        </p>
        <h1 className="mt-3 font-serif text-[38px] font-semibold leading-[1.05] tracking-[-0.035em] text-[#102D3D] dark:text-white sm:text-[42px]">
          Create your account
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#66716E] dark:text-[#B8CCC5]">
          Instructors grade answers. Students write, see the reasoning map, and
          revise.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="space-y-2">
          <p className="text-sm font-medium text-[#26332F] dark:text-white">I am a</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              aria-pressed={role === 'student'}
              className={roleOptionClassName(role === 'student')}
              onClick={() => setValue('role', 'student', { shouldValidate: true })}
            >
              <span className="flex items-center gap-2.5">
                <GraduationCap className="h-5 w-5" strokeWidth={1.7} />
                <span className="text-sm font-medium">Student</span>
              </span>
              <span className={cn('flex h-5 w-5 items-center justify-center rounded-full border', role === 'student' ? 'border-[#087653] dark:border-[#59D5A6]' : 'border-[#AEB8B3] dark:border-white/30')}>
                {role === 'student' && <span className="h-2.5 w-2.5 rounded-full bg-[#087653] dark:bg-[#59D5A6]" />}
              </span>
            </button>
            <button
              type="button"
              aria-pressed={role === 'teacher'}
              className={roleOptionClassName(role === 'teacher')}
              onClick={() => setValue('role', 'teacher', { shouldValidate: true })}
            >
              <span className="flex items-center gap-2.5">
                <UserRound className="h-5 w-5" strokeWidth={1.7} />
                <span className="text-sm font-medium">Instructor</span>
              </span>
              <span className={cn('flex h-5 w-5 items-center justify-center rounded-full border', role === 'teacher' ? 'border-[#087653] dark:border-[#59D5A6]' : 'border-[#AEB8B3] dark:border-white/30')}>
                {role === 'teacher' && <span className="h-2.5 w-2.5 rounded-full bg-[#087653] dark:bg-[#59D5A6]" />}
              </span>
            </button>
          </div>
          {errors.role && (
            <p className="text-xs text-destructive" role="alert">
              {errors.role.message}
            </p>
          )}
        </div>

        <FormField control={control} name="name" label="Full name">
          {(field) => (
            <Input
              id="name"
              type="text"
              placeholder="Jane Doe"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              name={field.name}
              onChange={field.onChange}
              onBlur={field.onBlur}
              value={(field.value as string) ?? ''}
              className={inputClassName}
            />
          )}
        </FormField>

        <FormField control={control} name="email" label="Email">
          {(field) => (
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
              className={inputClassName}
            />
          )}
        </FormField>

        {role === 'student' && (
          <FormField control={control} name="rollNumber" label="Roll number">
            {(field) => (
              <Input
                id="rollNumber"
                type="text"
                placeholder="CS-2022-041"
                autoComplete="off"
                aria-invalid={Boolean(errors.rollNumber)}
                name={field.name}
                onChange={field.onChange}
                onBlur={field.onBlur}
                value={(field.value as string) ?? ''}
                className={inputClassName}
              />
            )}
          </FormField>
        )}

        {role === 'teacher' && (
          <FormField
            control={control}
            name="institutionCode"
            label="Institution code"
            description="Ask your department for the instructor sign-up code."
          >
            {(field) => (
              <Input
                id="institutionCode"
                type="text"
                placeholder="Institution code"
                autoComplete="off"
                aria-invalid={Boolean(errors.institutionCode)}
                name={field.name}
                onChange={field.onChange}
                onBlur={field.onBlur}
                value={(field.value as string) ?? ''}
                className={inputClassName}
              />
            )}
          </FormField>
        )}

        <FormField
          control={control}
          name="password"
          label="Password"
          description="At least 8 characters, one uppercase letter and one number."
        >
          {(field) => (
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              name={field.name}
              onChange={field.onChange}
              onBlur={field.onBlur}
              value={(field.value as string) ?? ''}
              className={inputClassName}
            />
          )}
        </FormField>

        <FormField control={control} name="confirmPassword" label="Confirm password">
          {(field) => (
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmPassword)}
              name={field.name}
              onChange={field.onChange}
              onBlur={field.onBlur}
              value={(field.value as string) ?? ''}
              className={inputClassName}
            />
          )}
        </FormField>

        <Button
          type="submit"
          className="h-[60px] w-full rounded-xl bg-[#087653] text-[16px] font-semibold text-white shadow-none hover:bg-[#076447] dark:bg-[#07966E] dark:hover:bg-[#08A97D]"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="animate-spin" />}
          Create account
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-[#71807A] dark:text-[#9FB7AF]">
        Already have an account?{' '}
        <Link
          to={ROUTES.AUTH.LOGIN}
          className="font-medium text-[#087653] hover:underline dark:text-[#59D5A6]"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
