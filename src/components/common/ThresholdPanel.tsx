import {
  AlertTriangle,
  BookOpen,
  ChartNoAxesColumnIncreasing,
  CheckCircle2,
  UsersRound,
  XCircle,
} from 'lucide-react'
import type { AnalysisResult } from '@/types'
import {
  STAR_WEIGHTS,
  CORE_ROLES,
  getReviewThresholds,
  overallStatus,
  toPercent,
} from '@/lib/grading'
import { ROLE_LABELS } from './RoleBadge'
import { MissingRolesList } from './HighlightedAnswer'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface ThresholdPanelProps {
  analysis: AnalysisResult
  className?: string
  presentation?: 'default' | 'reasoning-engine'
}

export function ThresholdPanel({
  analysis,
  className,
  presentation = 'default',
}: ThresholdPanelProps) {
  const { roles, concepts, passed, minStars } = overallStatus(analysis)
  const thresholds = getReviewThresholds(analysis.questionId)

  if (presentation === 'reasoning-engine') {
    const dimensionStyles: Record<string, { bar: string; track: string }> = {
      concept_coverage: { bar: 'bg-violet-500', track: 'bg-muted' },
      reasoning_depth: { bar: 'bg-orange-500', track: 'bg-muted' },
      role_structure: { bar: 'bg-emerald-600', track: 'bg-muted' },
      support_quality: { bar: 'bg-rose-600', track: 'bg-rose-100 dark:bg-rose-950/40' },
    }

    return (
      <div className={cn('space-y-5', className)}>
        <section className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={passed ? 'default' : 'outline'}
              className={
                passed
                  ? 'bg-emerald-600 text-white hover:bg-emerald-600'
                  : 'border-orange-400 text-orange-800 dark:text-orange-200'
              }
            >
              {passed ? <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> : <XCircle className="mr-1 h-3.5 w-3.5" />}
              {passed ? 'Meets review thresholds' : 'Flagged for review'}
            </Badge>
          </div>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Flags for a closer look when below {Math.round(thresholds.role * 100)}% role coverage, {Math.round(thresholds.concept * 100)}% concept coverage, or {minStars} stars on the diagnostic indicator. This is a triage aid, not an automatic grade.
          </p>
        </section>

        <section className="space-y-3 border-t border-border pt-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <UsersRound className="h-5 w-5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
              <h3 className="font-semibold">Role coverage</h3>
            </div>
            <span className="text-sm tabular-nums text-muted-foreground">
              {roles.percent}% · {roles.covered.length}/4 core roles
            </span>
          </div>
          <Progress
            value={roles.percent}
            className="h-2.5 bg-emerald-100 dark:bg-emerald-950/50"
            indicatorClassName={roles.passed ? 'bg-emerald-600' : 'bg-orange-500'}
            aria-label={`Role coverage ${roles.percent}%`}
          />
          <p className="text-sm text-muted-foreground">
            Threshold is {Math.round(thresholds.role * 100)}% (at least {Math.ceil(thresholds.role * 4)} of Claim, Evidence, Reasoning, Conclusion).
          </p>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {CORE_ROLES.map((role) => {
              const contributed = roles.covered.includes(role)
              return (
                <div
                  key={role}
                  className={cn(
                    'flex min-h-14 items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm',
                    contributed
                      ? 'border-emerald-200 bg-emerald-50/80 dark:border-emerald-900 dark:bg-emerald-950/30'
                      : 'border-dashed border-border bg-muted/30 text-muted-foreground',
                  )}
                >
                  {contributed ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  ) : (
                    <XCircle className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  )}
                  <span className="min-w-0">
                    <span className="block font-medium text-foreground">{ROLE_LABELS[role]}</span>
                    <span className="block text-xs text-muted-foreground">{contributed ? 'Contributed' : 'Missing'}</span>
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        <section className="space-y-3 border-t border-border pt-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-violet-700 dark:text-violet-400" aria-hidden="true" />
              <h3 className="font-semibold">Concept coverage</h3>
            </div>
            <span className="text-sm tabular-nums text-muted-foreground">
              {concepts.percent}% · {concepts.covered}/{concepts.total}
            </span>
          </div>
          <Progress
            value={concepts.percent}
            className="h-2.5 bg-violet-100 dark:bg-violet-950/50"
            indicatorClassName={concepts.passed ? 'bg-violet-600' : 'bg-orange-500'}
            aria-label={`Concept coverage ${concepts.percent}%`}
          />
        </section>

        <section className="space-y-2 border-t border-border pt-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="font-semibold">Missing core roles</h3>
              <p className="text-sm text-muted-foreground">Each missing role lowers the role-structure score.</p>
              {roles.missing.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {roles.missing.map((role) => (
                    <Badge key={role} variant="secondary" className="border border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-200">
                      {ROLE_LABELS[role]}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm font-medium text-emerald-700 dark:text-emerald-400">All four core roles contributed.</p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-muted/30 p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <ChartNoAxesColumnIncreasing className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="font-semibold">How the diagnostic indicator is calculated</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {STAR_WEIGHTS.map((item) => {
              const dimension = analysis.dimensions.find((entry) => entry.key === item.key)
              const percent = dimension ? toPercent(dimension.score) : null
              const styles = dimensionStyles[item.key] ?? { bar: 'bg-primary', track: 'bg-muted' }
              const width = percent === null ? 0 : Math.min(100, Math.max(0, Math.abs(percent)))
              const negative = percent !== null && percent < 0
              return (
                <div key={item.key} className="min-w-0 space-y-2 border-border sm:even:border-l sm:even:pl-4 xl:border-l xl:pl-4 xl:first:border-l-0 xl:first:pl-0">
                  <p className="min-h-10 text-sm font-medium leading-snug">
                    {item.label} <span className="text-muted-foreground">({Math.round(item.weight * 100)}%)</span>
                  </p>
                  <div className="flex justify-end text-sm font-semibold tabular-nums">
                    {percent === null ? 'Unavailable' : `${percent}%`}
                  </div>
                  <Progress
                    value={width}
                    className={cn('h-2.5', styles.track)}
                    indicatorClassName={negative ? 'bg-rose-600' : styles.bar}
                    aria-label={`${item.label}: ${percent === null ? 'unavailable' : `${percent}%`}`}
                  />
                </div>
              )
            })}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Weighted mix is mapped to 1–5 stars. Contradictions slightly reduce the support component.
          </p>
        </section>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant={passed ? 'default' : 'outline'}
          className={
            passed
              ? 'bg-emerald-600 hover:bg-emerald-600'
              : 'border-orange-400 text-orange-800 dark:text-orange-200'
          }
        >
          {passed ? (
            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
          ) : (
            <XCircle className="mr-1 h-3.5 w-3.5" />
          )}
          {passed ? 'Meets review thresholds' : 'Flagged for review'}
        </Badge>
        <span className="text-xs text-muted-foreground">
          Flags for a closer look when below ≥{Math.round(thresholds.role * 100)}%
          role coverage, ≥{Math.round(thresholds.concept * 100)}% concept
          coverage, or {minStars} stars on the diagnostic indicator — this is a
          triage aid, not an automatic grade.
        </span>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Role coverage</span>
            <span className="text-muted-foreground">
              {roles.percent}% · {roles.covered.length}/4 core roles
            </span>
          </div>
          <Progress
            value={roles.percent}
            indicatorClassName={roles.passed ? 'bg-emerald-500' : 'bg-orange-500'}
          />
          <p className="text-xs text-muted-foreground">
            Threshold is {Math.round(thresholds.role * 100)}% (at least{' '}
            {Math.ceil(thresholds.role * 4)} of Claim, Evidence, Reasoning,
            Conclusion).
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Concept coverage</span>
            <span className="text-muted-foreground">
              {concepts.percent}% · {concepts.covered}/{concepts.total || 0}
            </span>
          </div>
          <Progress
            value={concepts.percent}
            indicatorClassName={
              concepts.passed ? 'bg-indigo-500' : 'bg-orange-500'
            }
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {roles.covered.map((role) => (
          <Badge key={role} variant="secondary" className="capitalize">
            {ROLE_LABELS[role]} contributed
          </Badge>
        ))}
      </div>

      <MissingRolesList missing={roles.missing} />

      <div className="rounded-md border bg-muted/40 p-3 text-sm">
        <p className="mb-2 font-medium">How the diagnostic indicator is calculated</p>
        <ul className="space-y-1 text-muted-foreground">
          {STAR_WEIGHTS.map((item) => {
            const dim = analysis.dimensions.find((d) => d.key === item.key)
            const pct = dim ? toPercent(dim.score) : 0
            return (
              <li key={item.key} className="flex justify-between gap-3">
                <span>
                  {item.label} ({Math.round(item.weight * 100)}%)
                </span>
                <span className="tabular-nums text-foreground">{pct}%</span>
              </li>
            )
          })}
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">
          Weighted mix is mapped to 1–5 stars. Contradictions slightly reduce
          the support component.
        </p>
      </div>
    </div>
  )
}
