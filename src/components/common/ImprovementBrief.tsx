import { CheckCircle2, Lightbulb, ListOrdered } from 'lucide-react'
import type { AnalysisResult } from '@/types'
import { buildImprovementBrief } from '@/lib/improvement-brief'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const PRIORITY_LABEL = {
  high: 'Do this first',
  medium: 'Then',
  low: 'Optional',
} as const

interface ImprovementBriefCardProps {
  analysis: AnalysisResult
  className?: string
  omitStars?: boolean
}

export function ImprovementBriefCard({
  analysis,
  className,
  omitStars = false,
}: ImprovementBriefCardProps) {
  const brief = buildImprovementBrief(analysis, { omitStars })

  return (
    <Card
      className={cn(
        'w-full overflow-hidden border-indigo-200 dark:border-indigo-900/60',
        className,
      )}
    >
      <CardHeader className="px-5 pb-4 pt-5">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 shrink-0 text-indigo-600" />

          <CardTitle className="text-lg font-semibold tracking-tight">
            How to make this answer better
          </CardTitle>
        </div>

        {brief.summary && (
          <p className="max-w-5xl text-sm leading-6 text-muted-foreground">
            {brief.summary}
          </p>
        )}
      </CardHeader>

      <CardContent className="px-5 pb-5">
        {/* =====================================================
            WHAT ALREADY WORKS
        ===================================================== */}
        {brief.strengths.length > 0 && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 dark:border-emerald-900/50 dark:bg-emerald-950/20">
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              What already works
            </p>

            <ul className="space-y-1.5">
              {brief.strengths.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm leading-5 text-emerald-800 dark:text-emerald-200"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* =====================================================
            WHAT TO CHANGE
        ===================================================== */}
        {brief.steps.length > 0 && (
          <div>
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <ListOrdered className="h-4 w-4" />
              What to change
            </p>

            {/* Horizontal recommendation cards */}
            <ol
  className={cn(
    'grid w-full gap-3',
    'grid-cols-1',
    'sm:grid-cols-2',
    'xl:grid-cols-5',
  )}
>
              {brief.steps.map((step, index) => {
                const priorityClass =
                  step.priority === 'high'
                    ? 'border-violet-200 bg-violet-50/70 dark:border-violet-900/60 dark:bg-violet-950/20'
                    : step.priority === 'medium'
                      ? 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/50 dark:bg-emerald-950/20'
                      : 'border-amber-200 bg-amber-50/60 dark:border-amber-900/50 dark:bg-amber-950/20'

                const numberClass =
                  step.priority === 'high'
                    ? 'bg-violet-600'
                    : step.priority === 'medium'
                      ? 'bg-emerald-600'
                      : 'bg-amber-500'

                return (
                  <li
                    key={`${step.title}-${index}`}
                    className={cn(
                      'flex min-w-0 flex-col rounded-2xl border p-3.5',
                      'transition-shadow hover:shadow-sm',
                      priorityClass,
                    )}
                  >
                    {/* Number + priority */}
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={cn(
                          'grid h-8 w-8 shrink-0 place-items-center rounded-full',
                          'text-sm font-semibold text-white',
                          numberClass,
                        )}
                      >
                        {index + 1}
                      </span>

                      <Badge
                        variant="secondary"
                        className={cn(
                          'shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium',
                          step.priority === 'high' &&
                            'bg-orange-100 text-orange-900 dark:bg-orange-500/20 dark:text-orange-100',
                          step.priority === 'medium' &&
                            'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200',
                          step.priority === 'low' &&
                            'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200',
                        )}
                      >
                        {PRIORITY_LABEL[step.priority]}
                      </Badge>
                    </div>

                    {/* Recommendation */}
                    <div className="mt-4 min-w-0">
                      <p className="text-sm font-semibold leading-5 text-foreground">
                        {step.title}
                      </p>

                      <p className="mt-2 text-[13px] leading-5 text-muted-foreground">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        )}

        {/* Empty state */}
        {brief.steps.length === 0 && brief.strengths.length === 0 && (
          <div className="rounded-xl border border-dashed p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No improvement recommendations returned.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}