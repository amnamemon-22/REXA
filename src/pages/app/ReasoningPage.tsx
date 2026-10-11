import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Waypoints,
  BarChart3,
  CheckCircle2,
  ShieldCheck,
  Trophy,
  XCircle,
} from 'lucide-react'
import type { AnalysisResult } from '@/types'
import { analysisService } from '@/services'
import { useAuth } from '@/hooks'
import { isStudentRole, isTeacherRole } from '@/lib/roles'
import { ROUTES } from '@/routes/paths'
import { overallStatus } from '@/lib/grading'
import {
  ConceptCoverage as AnalysisConceptCoverage,
  Explanations as AnalysisExplanations,
  SupportAndContradiction as AnalysisSupportAndContradiction,
} from '@/components/common/RexaAnalysisDashboard'
import {
  DimensionBars,
  EmptyState,
  HighlightedAnswer,
  ImprovementBriefCard,
  LoadingSpinner,
  PageHeader,
  ThresholdPanel,
} from '@/components/common'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/utils'

function ScoreRing({ value }: { value: number }) {
  const safeValue = Number.isFinite(value)
    ? Math.min(5, Math.max(0, value))
    : null
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const progress = safeValue === null ? 0 : (safeValue / 5) * 100
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative h-28 w-28 shrink-0" role="img" aria-label={
      safeValue === null ? 'Overall score unavailable' : `Overall score ${value.toFixed(1)} out of 5`
    }>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
        {safeValue !== null && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="text-violet-500"
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold tabular-nums">
          {safeValue === null ? 'N/A' : value.toFixed(1)}
        </span>
        <span className="text-[10px] text-muted-foreground">out of 5</span>
      </div>
    </div>
  )
}

export function ReasoningPage() {
  const { user } = useAuth()
  const isTeacher = isTeacherRole(user?.role)
  const isStudent = isStudentRole(user?.role)
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setIsLoading(true)
    setError(null)

    const load = id
      ? analysisService.getAnalysis(id)
      : analysisService
          .listAnalyses({ page: 1, pageSize: 1 })
          .then((response) => response.data[0] ?? null)

    load
      .then((result) => {
        if (mounted) setAnalysis(result)
      })
      .catch((err) => {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : 'Failed to load analysis.',
          )
        }
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [id])

  const status = analysis ? overallStatus(analysis) : null

  return (
    <div>
      <PageHeader
        title={isTeacher ? 'Reasoning engine' : 'My feedback'}
        description={
          analysis
            ? `Deep dive into "${analysis.questionText}"`
            : isTeacher
              ? 'Deep dive into how REXA reasons about a submitted answer.'
              : 'See how RExA scored your latest answer.'
        }
        actions={
          analysis && (
            <span className="text-sm text-muted-foreground">
              {formatDate(analysis.createdAt)}
            </span>
          )
        }
      />

      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {isLoading && (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" label="Loading analysis…" />
          </div>
        )}

        {!isLoading && error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && !analysis && (
          <EmptyState
            icon={Waypoints}
            title="No analysis found"
            description={
              isTeacher
                ? 'Run an analysis first to explore its reasoning breakdown.'
                : 'Submit an answer first to see your explainable feedback.'
            }
            action={
              <Button asChild>
                <Link to={ROUTES.APP.ANALYSIS}>
                  {isTeacher ? 'Run analysis' : 'Submit answer'}
                </Link>
              </Button>
            }
          />
        )}

        {!isLoading && !error && analysis && status && (
          <>
            {isTeacher ? (
              <div className="grid min-w-0 items-stretch gap-4 md:grid-cols-2 xl:grid-cols-[1.05fr_1.2fr_0.85fr]">
                <Card className="min-w-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Trophy className="h-4 w-4 text-foreground" />
                      Overall score
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid min-w-0 items-center gap-4 sm:grid-cols-[auto_minmax(0,1fr)]">
                    <ScoreRing value={analysis.stars} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-2xl font-bold tabular-nums">
                          {Number.isFinite(analysis.stars) ? `${analysis.stars.toFixed(1)} / 5` : 'N/A'}
                        </span>
                        <Badge variant={status.passed ? 'default' : 'outline'}>
                          {status.passed ? 'Pass' : 'Needs work'}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm font-medium">
                        {analysis.reasoningDepth.label}
                      </p>
                      {(analysis.reasoningDepth.description || analysis.explanations[0]?.message) && (
                        <p className="mt-1 line-clamp-3 text-xs leading-5 text-muted-foreground">
                          {analysis.reasoningDepth.description || analysis.explanations[0]?.message}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="min-w-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BarChart3 className="h-4 w-4 text-foreground" />
                      Dimension scores
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DimensionBars dimensions={analysis.dimensions} className="space-y-2.5" />
                  </CardContent>
                </Card>

                <Card className="min-w-0 md:col-span-2 xl:col-span-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <ShieldCheck className="h-4 w-4 text-foreground" />
                      Review status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Badge
                      variant={status.passed ? 'default' : 'outline'}
                      className={status.passed
                        ? 'bg-emerald-600 hover:bg-emerald-600'
                        : 'border-orange-400 text-orange-800 dark:text-orange-200'}
                    >
                      {status.passed
                        ? <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                        : <XCircle className="mr-1 h-3.5 w-3.5" />}
                      {status.passed ? 'Meets review thresholds' : 'Flagged for review'}
                    </Badge>
                    <p className="text-sm leading-5 text-muted-foreground">
                      {status.passed
                        ? 'This analysis meets the configured review thresholds.'
                        : 'This analysis did not meet all configured review thresholds.'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid items-stretch gap-4 lg:grid-cols-3">
                <Card className="flex flex-col lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">Dimension scores</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold">
                        {analysis.reasoningDepth.label}
                      </span>
                    </div>
                    <DimensionBars
                      dimensions={analysis.dimensions.filter(
                        (item) => !/star/i.test(`${item.key} ${item.label}`),
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-base">Reasoning depth</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        {analysis.reasoningDepth.level}/5
                      </span>
                      <Badge variant="secondary">
                        {analysis.reasoningDepth.label}
                      </Badge>
                    </div>
                    <Progress
                      value={(analysis.reasoningDepth.level / 5) * 100}
                      indicatorClassName="bg-violet-500"
                    />
                    {analysis.reasoningDepth.description && (
                      <p className="text-sm text-muted-foreground">
                        {analysis.reasoningDepth.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Sentence-by-sentence breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HighlightedAnswer sentences={analysis.sentenceRoles} />
              </CardContent>
            </Card>

            <div className="grid items-stretch gap-4 lg:grid-cols-2">
              {isTeacher && (
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-base">
                    Thresholds &amp; review logic
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <ThresholdPanel analysis={analysis} presentation="reasoning-engine" />
                </CardContent>
              </Card>
              )}

              <AnalysisConceptCoverage analysis={analysis} />
            </div>

            <div className="grid min-w-0 gap-5 md:grid-cols-2 xl:grid-cols-2">
              <AnalysisSupportAndContradiction
                analysis={analysis}
                showAll
                showReferenceText={isTeacher}
              />
              <AnalysisExplanations analysis={analysis} isStudent={isStudent} />
            </div>

            <ImprovementBriefCard analysis={analysis} omitStars={isStudent} />
          </>
        )}
      </div>
    </div>
  )
}
