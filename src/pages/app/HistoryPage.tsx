import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock3 } from 'lucide-react'
import type { AnalysisResult } from '@/types'
import { analysisService } from '@/services'
import { EmptyState, LoadingSpinner, PageHeader, StarRating } from '@/components/common'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/routes/paths'
import { formatDate } from '@/utils'

export function HistoryPage() {
  const [items, setItems] = useState<AnalysisResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    analysisService.listAnalyses({ page: 1, pageSize: 100 })
      .then(result => { if (active) setItems(result.data) })
      .catch(err => { if (active) setError(err instanceof Error ? err.message : 'Could not load your history.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return <div>
    <PageHeader title="Your history" description="Review analysis results returned for your account." actions={<Button asChild><Link to={ROUTES.APP.PRACTICE}>Practice again</Link></Button>} />
    <main className="mx-auto max-w-5xl space-y-4 p-4 sm:p-6 lg:p-8">
      {loading ? <LoadingSpinner label="Loading your analysis history" /> :
        error ? <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert> :
        items.length === 0 ? <EmptyState title="No analyses yet" description="Completed analyses saved by the service will appear here." action={<Button asChild><Link to={ROUTES.APP.PRACTICE}>Choose a question</Link></Button>} /> :
        items.map(item => <Card key={item.id}>
          <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0">
            <div className="space-y-2"><CardTitle className="text-base leading-6">{item.questionText || 'Question unavailable'}</CardTitle><div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock3 className="h-3.5 w-3.5" />{formatDate(item.createdAt)}</div></div>
            <Badge variant="outline">Depth {Number.isFinite(item.reasoningDepth?.level) ? `${item.reasoningDepth.level}/5` : 'unavailable'}</Badge>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-3"><div><p className="mb-1 text-xs text-muted-foreground">Reasoning feedback</p><StarRating value={item.stars} size="sm" /></div><Button asChild variant="outline"><Link to={`${ROUTES.APP.REASONING}?id=${encodeURIComponent(item.id)}`}>Open feedback <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></CardContent>
        </Card>)
      }
    </main>
  </div>
}
