import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Database,
  FileText,
  Target,
  TrendingUp,
} from 'lucide-react'
import type { AnalysisResult } from '@/types'
import { analysisService } from '@/services'
import { EmptyState, LoadingSpinner, PageHeader } from '@/components/common'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/routes/paths'
import { formatDate } from '@/utils'

function coverageOf(item: AnalysisResult): number | null {
  const concepts = item.conceptCoverage
  if (!concepts?.length) return null
  return Math.round(concepts.filter(concept => concept.covered).length * 100 / concepts.length)
}

function depthTrendPaths(values: number[]): { line: string; area: string; endpoint: { x: number; y: number } } | null {
  if (values.length < 2) return null
  const points = values.map((value, index) => ({
    x: 4 + index * 92 / (values.length - 1),
    y: 44 - Math.min(5, Math.max(0, value)) / 5 * 34,
  }))
  const line = points.slice(1).reduce((path, point, index) => {
    const previous = points[index]
    const controlOffset = (point.x - previous.x) / 3
    return `${path} C ${previous.x + controlOffset} ${previous.y}, ${point.x - controlOffset} ${point.y}, ${point.x} ${point.y}`
  }, `M ${points[0].x} ${points[0].y}`)
  const area = `${line} L ${points[points.length - 1].x} 52 L ${points[0].x} 52 Z`
  return { line, area, endpoint: points[points.length - 1] }
}

function depthBadgeClass(level: number): string {
  const tone = Math.max(1, Math.min(5, Math.ceil(level)))
  const tones = [
    'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-100',
    'border-emerald-200 bg-emerald-100 text-emerald-950 dark:border-emerald-700 dark:bg-emerald-950/75 dark:text-emerald-100',
    'border-emerald-300 bg-emerald-100 text-emerald-950 dark:border-emerald-600 dark:bg-emerald-900/70 dark:text-emerald-100',
    'border-emerald-300 bg-emerald-200/80 text-emerald-950 dark:border-emerald-600 dark:bg-emerald-900/80 dark:text-emerald-100',
    'border-emerald-400 bg-emerald-200 text-emerald-950 dark:border-emerald-500 dark:bg-emerald-800 dark:text-emerald-50',
  ]
  return tones[tone - 1]
}

export function ProgressPage() {
  const [items, setItems] = useState<AnalysisResult[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    analysisService.listAnalyses({ page: 1, pageSize: 100 })
      .then(page => { if (active) { setItems(page.data); setTotal(page.total) } })
      .catch(err => { if (active) setError(err instanceof Error ? err.message : 'Could not load progress.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const ordered = useMemo(
    () => [...items].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [items],
  )
  const validDepths = ordered.filter(item => Number.isFinite(item.reasoningDepth?.level))
  const latest = ordered.at(-1)
  const previous = ordered.at(-2)
  const latestDepth = latest && Number.isFinite(latest.reasoningDepth?.level) ? latest.reasoningDepth.level : null
  const previousDepth = previous && Number.isFinite(previous.reasoningDepth?.level) ? previous.reasoningDepth.level : null
  const depthChange = latestDepth !== null && previousDepth !== null ? latestDepth - previousDepth : null
  const latestCoverage = latest ? coverageOf(latest) : null
  const previousCoverage = previous ? coverageOf(previous) : null
  const coverageChange = latestCoverage !== null && previousCoverage !== null ? latestCoverage - previousCoverage : null
  const depthIndicator = latestDepth === null ? 0 : Math.min(5, Math.max(0, latestDepth))
  const analysisBuckets = useMemo(() => {
    const counts = Array.from({ length: 6 }, () => 0)
    const timestamps = ordered.map(item => new Date(item.createdAt).getTime()).filter(Number.isFinite)
    if (timestamps.length === 0) return counts
    const first = Math.min(...timestamps)
    const last = Math.max(...timestamps)
    const span = last - first
    for (const timestamp of timestamps) {
      const bucket = span === 0 ? 5 : Math.min(5, Math.floor((timestamp - first) / span * 6))
      counts[bucket] += 1
    }
    return counts
  }, [ordered])
  const recentDepthValues = validDepths.slice(-8).map(item => item.reasoningDepth!.level)
  const depthTrend = depthTrendPaths(recentDepthValues)
  const maxAnalysisBucket = Math.max(1, ...analysisBuckets)

  return <div>
    <PageHeader
      title="Your progress"
      description="A summary based on analysis results saved for your account."
      actions={<Button asChild><Link to={ROUTES.APP.PRACTICE}>Practice again</Link></Button>}
    />
    <main className="mx-auto max-w-6xl space-y-5 p-4 sm:p-6 lg:p-8">
      {loading ? <LoadingSpinner label="Loading saved progress" /> : error ? <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert> : items.length === 0 ? <EmptyState title="No progress data yet" description="After you complete and save an analysis, its returned reasoning details can appear here." action={<Button asChild><Link to={ROUTES.APP.PRACTICE}>Choose a question</Link></Button>} /> : <>
        <p className="text-sm text-muted-foreground">These comparisons use the latest two saved analyses when the relevant values are present. They are descriptive and do not represent a separate model prediction.</p>

        <div className="grid items-stretch gap-4 lg:grid-cols-2">
          <Card className="flex h-full min-h-40 items-stretch border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="flex w-full items-center gap-3 p-5 sm:gap-4 sm:p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-800 dark:bg-emerald-300/10 dark:text-emerald-300">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-sm font-semibold">Saved analyses</CardTitle>
                <p className="mt-1.5 text-3xl font-semibold tracking-tight tabular-nums">{total}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Total analyses reported by your history service</p>
              </div>
              <div className="hidden shrink-0 items-end gap-1.5 sm:flex" role="img" aria-label={`Loaded analysis counts across six chronological groups: ${analysisBuckets.join(', ')}`}>
                {analysisBuckets.map((count, index) => <span key={index} className="flex h-11 w-2.5 items-end overflow-hidden rounded-full bg-emerald-900/10 dark:bg-emerald-100/10">
                  <span className="block w-full rounded-full bg-emerald-700/75 dark:bg-emerald-300/75" style={{ height: `${count / maxAnalysisBucket * 100}%` }} />
                </span>)}
              </div>
            </CardContent>
          </Card>

          <Card className="flex h-full min-h-40 items-stretch border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="flex w-full items-center justify-between gap-3 p-5 sm:gap-4 sm:p-6">
              <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-800 dark:bg-emerald-300/10 dark:text-emerald-300">
                  <TrendingUp className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-sm font-semibold">Reasoning depth</CardTitle>
                  <p className="mt-1.5 text-3xl font-semibold tracking-tight tabular-nums">{latestDepth === null ? 'Unavailable' : `${latestDepth}/5`}</p>
                  <p className="mt-1.5 flex min-h-4 flex-wrap items-center gap-1 text-xs leading-relaxed text-muted-foreground">
                    {depthChange === null ? 'Need two results with depth values to compare' : <>
                      {depthChange > 0 ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" /> : depthChange < 0 ? <ArrowDownRight className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" aria-hidden="true" /> : null}
                      {depthChange > 0 ? '+' : ''}{depthChange} since previous available result
                    </>}
                  </p>
                </div>
              </div>
              {latestDepth !== null && <div className="hidden shrink-0 items-end gap-1.5 sm:flex" role="img" aria-label={`Reasoning depth ${latestDepth} out of 5`}>
                {Array.from({ length: 5 }, (_, index) => {
                  const fill = Math.min(1, Math.max(0, depthIndicator - index))
                  return <span key={index} className="flex h-10 w-2.5 items-end overflow-hidden rounded-full bg-muted">
                    <span className="block w-full rounded-full bg-emerald-700 dark:bg-emerald-400" style={{ height: `${fill * 100}%` }} />
                  </span>
                })}
              </div>}
            </CardContent>
          </Card>

          <Card className="flex h-full min-h-40 items-stretch border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="flex w-full items-center justify-between gap-3 p-5 sm:gap-4 sm:p-6">
              <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-800 dark:bg-emerald-300/10 dark:text-emerald-300">
                  <Target className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-sm font-semibold">Concept coverage</CardTitle>
                  <p className="mt-1.5 text-3xl font-semibold tracking-tight tabular-nums">{latestCoverage === null ? 'Unavailable' : `${latestCoverage}%`}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {coverageChange === null ? 'Coverage comparison needs two results with concepts' : `${coverageChange > 0 ? '+' : ''}${coverageChange} percentage points since previous result`}
                  </p>
                </div>
              </div>
              {latestCoverage !== null && <div className="relative h-16 w-16 shrink-0 sm:h-[4.5rem] sm:w-[4.5rem]" role="meter" aria-label="Latest concept coverage" aria-valuemin={0} aria-valuemax={100} aria-valuenow={latestCoverage}>
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="11" className="text-muted" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="11" strokeLinecap="round" strokeDasharray={`${latestCoverage * 2.388} 238.8`} className="text-emerald-700 dark:text-emerald-400" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold tabular-nums">{latestCoverage}%</span>
              </div>}
            </CardContent>
          </Card>

          <Card className="flex h-full min-h-40 items-stretch border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="flex w-full items-center justify-between gap-3 p-5 sm:gap-4 sm:p-6">
              <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-800 dark:bg-emerald-300/10 dark:text-emerald-300">
                  <Database className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-sm font-semibold">Available depth records</CardTitle>
                  <p className="mt-1.5 text-3xl font-semibold tracking-tight tabular-nums">{validDepths.length}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Records with depth among the latest 100 loaded results</p>
                </div>
              </div>
              {depthTrend ? <svg viewBox="0 0 100 52" preserveAspectRatio="none" className="hidden h-12 w-24 shrink-0 overflow-visible text-emerald-700 dark:text-emerald-400 sm:block" role="img" aria-label={`Recent reasoning depth values, oldest to newest: ${recentDepthValues.join(', ')}`}>
                <defs>
                  <linearGradient id="depthTrendFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.24" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <path d={depthTrend.area} fill="url(#depthTrendFill)" />
                <path d={depthTrend.line} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx={depthTrend.endpoint.x} cy={depthTrend.endpoint.y} r="3" className="fill-current" />
              </svg> : recentDepthValues.length === 1 ? <div className="hidden h-12 w-24 shrink-0 items-center justify-center sm:flex" role="img" aria-label="One depth record available; a trend needs at least two records">
                <span className="relative h-px w-16 bg-emerald-900/15 dark:bg-emerald-100/20"><span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-600/60 dark:bg-emerald-300/60" /></span>
              </div> : null}
            </CardContent>
          </Card>
        </div>

        {items.length < 2 && <Alert><AlertDescription>One saved analysis is available. A change over time will appear after another analysis with comparable values is saved.</AlertDescription></Alert>}

        <Card className="overflow-hidden border-border/70 shadow-sm">
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle className="flex items-center gap-2 text-base"><Clock3 className="h-4 w-4 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            <div className="hidden grid-cols-[minmax(0,1fr)_auto] gap-4 rounded-md bg-muted/60 px-3 py-2 text-xs font-medium text-muted-foreground sm:grid">
              <span>Question</span>
              <div className="grid grid-cols-[6.5rem_6.5rem] items-center gap-4">
                <span>Depth</span><span className="text-right">Action</span>
              </div>
            </div>
            <div className="divide-y divide-border/70">
              {[...ordered].reverse().slice(0, 8).map(item => (
                <div key={item.id} className="grid gap-2.5 px-3 py-2.5 transition-colors hover:bg-accent/40 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-5">{item.questionText || 'Question unavailable'}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(item.createdAt)}</p>
                  </div>
                  <div className="flex min-w-0 items-center justify-between gap-3 sm:justify-end sm:gap-6">
                    <div className="shrink-0">
                      {Number.isFinite(item.reasoningDepth?.level) ? <Badge className={`${depthBadgeClass(item.reasoningDepth.level)} rounded-full`}>Depth {item.reasoningDepth.level}/5</Badge> : <Badge variant="secondary">Depth unavailable</Badge>}
                    </div>
                    <Button asChild size="sm" variant="ghost" className="h-8 px-2">
                      <Link to={`${ROUTES.APP.REASONING}?id=${encodeURIComponent(item.id)}`}>Feedback<ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </>}
    </main>
  </div>
}
