import type { AnalysisResult } from '@/types'
import {
  DimensionBars,
  StarRating,
  ThresholdPanel,
} from '@/components/common'
import { RexaAnalysisDashboard } from '@/components/common/RexaAnalysisDashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/utils'

export function TeacherReasoningWorkspace({
  analysis,
}: {
  analysis: AnalysisResult
}) {
  const dimensions = analysis.dimensions.filter(
    (dimension) => !/star/i.test(`${dimension.key} ${dimension.label}`),
  )

  return (
    <div className="mx-auto min-w-0 w-full space-y-5">
      <section className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="min-w-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Overall score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <StarRating value={analysis.stars} size="lg" />
              <p className="mt-2 text-3xl font-bold tabular-nums">
                {analysis.stars.toFixed(1)}{' '}
                <span className="text-base font-medium text-muted-foreground">/ 5</span>
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {analysis.reasoningDepth.label}
            </Badge>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Dimension scores</CardTitle>
          </CardHeader>
          <CardContent>
            <DimensionBars dimensions={dimensions} />
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Review status</CardTitle>
          </CardHeader>
          <CardContent>
            <ThresholdPanel analysis={analysis} />
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Answer information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid min-w-0 gap-x-4 gap-y-3 text-sm sm:grid-cols-[7rem_minmax(0,1fr)]">
              <InfoRow label="Question" value={analysis.questionText} />
              <InfoRow label="Student" value={analysis.studentName || 'Not available'} />
              <InfoRow label="Student ID" value={analysis.studentId || 'Not available'} />
              <InfoRow label="Date" value={formatDate(analysis.createdAt)} />
              <InfoRow label="Analysis ID" value={analysis.id} />
            </dl>
          </CardContent>
        </Card>
      </section>

      <RexaAnalysisDashboard
        key={analysis.id}
        analysis={analysis}
        isTeacher
        isStudent={false}
      />
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words">{value}</dd>
    </>
  )
}
