import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, MailQuestion } from 'lucide-react'
import { ROUTES } from '@/routes/paths'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [showUnavailable, setShowUnavailable] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setShowUnavailable(false)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email address.')
      return
    }
    setShowUnavailable(true)
  }

  return (
    <div className="space-y-6 text-center sm:text-left">
      <div className="flex justify-center sm:justify-start">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <MailQuestion className="h-6 w-6 text-primary" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Forgot your password?
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your account email. Self-service password reset is not connected yet.
        </p>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit} noValidate>
        {error && <Alert variant="destructive"><AlertCircle /><AlertDescription>{error}</AlertDescription></Alert>}
        {showUnavailable && <Alert><AlertDescription>No reset request was sent. Contact your administrator; the backend does not provide a password-reset service yet.</AlertDescription></Alert>}
        <label htmlFor="reset-email" className="block text-sm font-medium">Email address</label>
        <Input id="reset-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
        <Button type="submit" className="w-full sm:w-auto">Check reset availability</Button>
      </form>

      <Button asChild className="w-full sm:w-auto">
        <Link to={ROUTES.AUTH.LOGIN}>Back to sign in</Link>
      </Button>
    </div>
  )
}
