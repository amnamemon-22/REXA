import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDownRight, ArrowRight, ArrowUpRight, TrendingUp } from 'lucide-react'
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

  const ordered = useMemo(() => [...items].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()), [items])
  const validDepths = ordered.filter(item => Number.isFinite(item.reasoningDepth?.level))
  const latest = ordered.at(-1)
  const previous = ordered.at(-2)
  const latestDepth = latest && Number.isFinite(latest.reasoningDepth?.level) ? latest.reasoningDepth.level : null
  const previousDepth = previous && Number.isFinite(previous.reasoningDepth?.level) ? previous.reasoningDepth.level : null
  const depthChange = latestDepth !== null && previousDepth !== null ? latestDepth - previousDepth : null
  const latestCoverage = latest ? coverageOf(latest) : null
  const previousCoverage = previous ? coverageOf(previous) : null
  const coverageChange = latestCoverage !== null && previousCoverage !== null ? latestCoverage - previousCoverage : null

  return <div>
    <PageHeader title="Your progress" description="A summary based on analysis results saved for your account." actions={<Button asChild><Link to={ROUTES.APP.PRACTICE}>Practice again</Link></Button>} />
    <main className="mx-auto max-w-5xl space-y-5 p-4 sm:p-6 lg:p-8">
      {loading ? <LoadingSpinner label="Loading saved progress" /> : error ? <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert> : items.length === 0 ? <EmptyState title="No progress data yet" description="After you complete and save an analysis, its returned reasoning details can appear here." action={<Button asChild><Link to={ROUTES.APP.PRACTICE}>Choose a question</Link></Button>} /> : <>
        <p className="text-sm text-muted-foreground">These comparisons use the latest two saved analyses when the relevant values are present. They are descriptive and do not represent a separate model prediction.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card><CardHeader><CardTitle className="text-sm font-medium">Saved analyses</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold">{total}</p><p className="mt-1 text-xs text-muted-foreground">Total analyses reported by your history service</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm font-medium">Reasoning depth</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold">{latestDepth === null ? 'Unavailable' : `${latestDepth}/5`}</p><p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">{depthChange === null ? 'Need two results with depth values to compare' : <><TrendingUp className="h-3.5 w-3.5" />{depthChange > 0 ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" /> : depthChange < 0 ? <ArrowDownRight className="h-3.5 w-3.5 text-amber-600" /> : null}{depthChange > 0 ? '+' : ''}{depthChange} since previous available result</>}</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm font-medium">Concept coverage</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold">{latestCoverage === null ? 'Unavailable' : `${latestCoverage}%`}</p><p className="mt-1 text-xs text-muted-foreground">{coverageChange === null ? 'Coverage comparison needs two results with concepts' : `${coverageChange > 0 ? '+' : ''}${coverageChange} percentage points since previous result`}</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm font-medium">Available depth records</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold">{validDepths.length}</p><p className="mt-1 text-xs text-muted-foreground">Records with depth among the latest 100 loaded results</p></CardContent></Card>
        </div>
        {items.length < 2 && <Alert><AlertDescription>One saved analysis is available. A change over time will appear after another analysis with comparable values is saved.</AlertDescription></Alert>}
        <Card><CardHeader><CardTitle className="text-base">Recent activity</CardTitle></CardHeader><CardContent className="space-y-3">{[...ordered].reverse().slice(0,8).map(item => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 last:border-0 last:pb-0"><div className="min-w-0"><p className="truncate text-sm font-medium">{item.questionText || 'Question unavailable'}</p><p className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</p></div><div className="flex items-center gap-2">{Number.isFinite(item.reasoningDepth?.level) ? <Badge variant="outline">Depth {item.reasoningDepth.level}/5</Badge> : <Badge variant="secondary">Depth unavailable</Badge>}<Button asChild size="sm" variant="ghost"><Link to={`${ROUTES.APP.REASONING}?id=${encodeURIComponent(item.id)}`}>Feedback<ArrowRight className="ml-1 h-3.5 w-3.5" /></Link></Button></div></div>)}</CardContent></Card>
      </>}
    </main>
  </div>
}
