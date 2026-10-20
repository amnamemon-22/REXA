
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ArrowRight,
  Waypoints,
  CheckCircle2,
  FileText,
  Gauge,
  GitBranch,
  Layers3,
  Target,
  Users,
} from 'lucide-react'

import { useAuth } from '@/hooks'
import { isStudentRole } from '@/lib/roles'
import type {
  AnalysisResult,
  DashboardData,
  SentenceRoleLabel,
} from '@/types'
import { analysisService, analyticsService } from '@/services'
import { ROUTES } from '@/routes/paths'
import { LoadingSpinner } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { formatDate } from '@/utils'

const ROLE_LABELS: Record<SentenceRoleLabel, string> = {
  claim: 'Claim',
  evidence: 'Evidence',
  reasoning: 'Explanation',
  elaboration: 'Elaboration',
  counterargument: 'Counterargument',
  conclusion: 'Conclusion',
  irrelevant: 'Other',
}

const ROLE_COLORS: Record<SentenceRoleLabel, string> = {
  claim: '#187653',
  evidence: '#D8A43D',
  reasoning: '#568BD7',
  elaboration: '#9278CD',
  counterargument: '#D96767',
  conclusion: '#85B94D',
  irrelevant: '#8C9A93',
}

const DEPTH_COLORS = [
  '#D9E8DF',
  '#AFD1BC',
  '#75B891',
  '#32845F',
  '#124B37',
]

const DEPTH_LABELS = [
  'Very limited',
  'Emerging',
  'Basic',
  'Developing',
  'Deep',
]

function Panel({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`min-w-0 rounded-2xl border border-border/80 bg-card shadow-[0_2px_8px_rgba(20,50,35,0.035)] ${className}`}
    >
      {children}
    </section>
  )
}

function PanelHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/80 px-5 py-4">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.16em] text-primary">
            {eyebrow}
          </p>
        )}
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: typeof Waypoints
  label: string
  value: string
  detail: string
  tone: 'green' | 'gold' | 'blue' | 'purple'
}) {
  const tones = {
    green: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    gold: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    blue: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
    purple: 'bg-violet-500/10 text-violet-700 dark:text-violet-300',
  }

  return (
    <section className="rounded-2xl border border-border/80 bg-card p-4 transition-shadow duration-200 hover:shadow-md sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-[17px] w-[17px]" />
        </span>
      </div>

      <p className="mt-4 text-[29px] font-semibold leading-none tracking-[-0.04em] text-foreground">
        {value}
      </p>
      <p className="mt-2 text-[10px] leading-4 text-muted-foreground">
        {detail}
      </p>
    </section>
  )
}

function EmptyState({
  icon: Icon,
  message,
}: {
  icon: typeof Waypoints
  message: string
}) {
  return (
    <div className="flex min-h-[210px] flex-col items-center justify-center gap-3 px-6 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <p className="max-w-xs text-xs leading-5 text-muted-foreground">
        {message}
      </p>
    </div>
  )
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{
    name?: string
    value?: number
    color?: string
    payload?: { label?: string }
  }>
  label?: string
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2.5 shadow-lg">
      {label && (
        <p className="mb-1.5 text-xs font-medium text-foreground">{label}</p>
      )}
      {payload.map((item, index) => (
        <div key={`${item.name}-${index}`} className="flex items-center gap-2 text-xs">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: item.color }}
          />
          <span className="text-muted-foreground">
            {item.name ?? item.payload?.label ?? 'Results'}
          </span>
          <span className="ml-3 font-semibold tabular-nums text-foreground">
            {item.value ?? 0}
          </span>
        </div>
      ))}
    </div>
  )
}

function RoleDistribution({
  distribution,
}: {
  distribution: DashboardData['roleDistribution']
}) {
  const rows = useMemo(
    () => [...distribution]
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count),
    [distribution],
  )

  const total = rows.reduce((sum, item) => sum + item.count, 0)

  return (
    <Panel>
      <PanelHeader
        eyebrow="Sentence analysis"
        title="Sentence roles"
        description="How sentences are classified across available results."
      />

      {total === 0 ? (
        <EmptyState
          icon={Waypoints}
          message="Sentence-role results will appear here when available."
        />
      ) : (
        <div className="grid items-center gap-3 px-4 py-4 sm:grid-cols-[minmax(150px,0.85fr)_minmax(0,1.15fr)] sm:gap-5 sm:px-5">
          <div className="relative mx-auto h-[185px] w-full max-w-[210px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rows}
                  dataKey="count"
                  nameKey="role"
                  innerRadius={57}
                  outerRadius={81}
                  paddingAngle={3}
                  stroke="none"
                >
                  {rows.map((item) => (
                    <Cell
                      key={item.role}
                      fill={ROLE_COLORS[item.role]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[29px] font-semibold leading-none tracking-tight text-foreground">
                {total.toLocaleString()}
              </span>
              <span className="mt-1 text-[10px] text-muted-foreground">
                sentences
              </span>
            </div>
          </div>

          <div className="space-y-3 py-2">
            {rows.map((item) => {
              const percent = (item.count / total) * 100

              return (
                <div key={item.role}>
                  <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
                    <span className="flex min-w-0 items-center gap-2 font-medium text-foreground">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: ROLE_COLORS[item.role] }}
                      />
                      <span className="truncate">{ROLE_LABELS[item.role]}</span>
                    </span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      {item.count}
                      <span className="ml-1 text-[10px]">
                        ({percent.toFixed(0)}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${percent}%`,
                        background: ROLE_COLORS[item.role],
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </Panel>
  )
}

function ReasoningDepth({ analyses }: { analyses: AnalysisResult[] }) {
  const data = useMemo(() => {
    const counts = [0, 0, 0, 0, 0]

    analyses.forEach((analysis) => {
      const level = Number(analysis.reasoningDepth?.level)
      if (Number.isInteger(level) && level >= 1 && level <= 5) {
        counts[level - 1] += 1
      }
    })

    return counts.map((count, index) => ({
      level: index + 1,
      label: DEPTH_LABELS[index],
      count,
      fill: DEPTH_COLORS[index],
    }))
  }, [analyses])

  const validTotal = data.reduce((sum, item) => sum + item.count, 0)

  const average = validTotal
    ? data.reduce((sum, item) => sum + item.level * item.count, 0) / validTotal
    : null

  return (
    <Panel>
      <PanelHeader
        eyebrow="Reasoning progression"
        title="Reasoning depth"
        description="Distribution of valid returned depth levels."
        action={
          <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
            {validTotal} results
          </span>
        }
      />

      {validTotal === 0 ? (
        <EmptyState
          icon={GitBranch}
          message="Valid reasoning-depth results will appear here when available."
        />
      ) : (
        <div className="p-4 sm:px-5 sm:py-5">
          <div className="flex items-center gap-3 rounded-xl bg-muted/60 p-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card text-primary shadow-sm">
              <Waypoints className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] text-muted-foreground">
                Average returned level
              </p>
              <p className="mt-1 text-2xl font-semibold leading-none tracking-tight text-foreground">
                {average?.toFixed(1)}
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  / 5
                </span>
              </p>
            </div>
          </div>

          <div className="mt-4 h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 12, right: 8, left: 4, bottom: 0 }}
                barCategoryGap="32%"
              >
                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                  strokeDasharray="3 5"
                />
                <XAxis
                  dataKey="level"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                />
                <YAxis
                  width={25}
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                />
                <Tooltip
                  cursor={false}
                  content={<ChartTooltip />}
                  labelFormatter={(level) => `Reasoning depth ${level}`}
                />
                <Bar
                  dataKey="count"
                  name="Analyses"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={34}
                  activeBar={{ fill: 'var(--sidebar-primary)' }}
                >
                  {data.map((item) => (
                    <Cell key={item.level} fill={item.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-1 grid grid-cols-5 gap-1">
            {data.map((item) => (
              <div key={item.level} className="text-center">
                <div
                  className="mx-auto mb-1.5 h-1 w-6 rounded-full"
                  style={{ background: item.fill }}
                />
                <p className="text-[9px] leading-4 text-muted-foreground sm:text-[10px]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Panel>
  )
}

function RelationshipSummary({ analyses }: { analyses: AnalysisResult[] }) {
  const relations = useMemo(() => {
    const counts = {
      support: 0,
      contradiction: 0,
      neutral: 0,
    }

    analyses.forEach((analysis) => {
      analysis.supportPairs?.forEach((pair) => {
        if (pair.relation === 'support') counts.support += 1
        if (pair.relation === 'contradiction') counts.contradiction += 1
        if (pair.relation === 'neutral') counts.neutral += 1
      })
    })

    return {
      ...counts,
      total: counts.support + counts.contradiction + counts.neutral,
    }
  }, [analyses])

  const rows = [
    { key: 'support', label: 'Support', value: relations.support, color: '#278B65', icon: CheckCircle2 },
    { key: 'contradiction', label: 'Contradiction', value: relations.contradiction, color: '#D96767', icon: GitBranch },
    { key: 'neutral', label: 'Neutral', value: relations.neutral, color: '#8C9A93', icon: Layers3 },
  ]

  return (
    <Panel>
      <PanelHeader
        eyebrow="Statement relationships"
        title="Support & contradiction"
        description="Relationships returned by the loaded analyses."
      />

      {relations.total === 0 ? (
        <EmptyState
          icon={GitBranch}
          message="Statement relationship results will appear here when available."
        />
      ) : (
        <div className="space-y-5 p-5">
          {rows.map((item) => {
            const Icon = item.icon
            const percent = (item.value / relations.total) * 100

            return (
              <div key={item.key}>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2.5 text-xs font-medium text-foreground">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{
                        background: `${item.color}18`,
                        color: item.color,
                      }}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    {item.label}
                  </span>

                  <span className="text-right">
                    <span className="block text-sm font-semibold tabular-nums text-foreground">
                      {item.value.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {percent.toFixed(1)}%
                    </span>
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${percent}%`,
                      background: item.color,
                    }}
                  />
                </div>
              </div>
            )
          })}

          <p className="border-t border-border pt-3 text-[10px] leading-4 text-muted-foreground">
            {relations.total.toLocaleString()} relationships in the loaded records.
          </p>
        </div>
      )}
    </Panel>
  )
}

function RecentAnalyses({
  analyses,
  student,
}: {
  analyses: AnalysisResult[]
  student: boolean
}) {
  const recent = analyses.slice(0, 5)

  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border/80 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            {student ? 'Recent answers' : 'Recent analyses'}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Open a result to inspect its reasoning details.
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="shrink-0 rounded-lg">
          <Link to={ROUTES.APP.ANALYSIS}>
            All analyses <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      {recent.length === 0 ? (
        <EmptyState
          icon={FileText}
          message="Your analyses will appear here after results are available."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[590px] text-left">
            <thead className="bg-muted/35 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-semibold">Question</th>
                {student ? (
                  <th className="px-3 py-3 font-semibold">Depth</th>
                ) : (
                  <>
                    <th className="px-3 py-3 font-semibold">Stars</th>
                    <th className="px-3 py-3 font-semibold">Depth</th>
                  </>
                )}
                <th className="px-5 py-3 text-right font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recent.map((analysis) => (
                <tr
                  key={analysis.id}
                  className="group transition-colors hover:bg-muted/30"
                >
                  <td className="max-w-[420px] px-5 py-3.5">
                    <Link
                      to={`${ROUTES.APP.REASONING}?id=${analysis.id}`}
                      className="flex min-w-0 items-center gap-3"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-primary">
                        <FileText className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-medium text-foreground group-hover:text-primary sm:text-sm">
                          {analysis.questionText || 'Untitled question'}
                        </span>
                        {!student && analysis.studentName && (
                          <span className="mt-1 block text-[10px] text-muted-foreground">
                            {analysis.studentName}
                          </span>
                        )}
                      </span>
                    </Link>
                  </td>
                  {student ? (
                    <td className="whitespace-nowrap px-3 py-3.5 text-xs text-muted-foreground">
                      {analysis.reasoningDepth?.level != null
                        ? `${analysis.reasoningDepth.level}/5 · ${analysis.reasoningDepth.label}`
                        : '—'}
                    </td>
                  ) : (
                    <>
                      <td className="whitespace-nowrap px-3 py-3.5 text-xs font-semibold tabular-nums text-foreground">
                        {Number.isFinite(analysis.stars)
                          ? `${analysis.stars.toFixed(1)}/5`
                          : '—'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3.5 text-xs text-muted-foreground">
                        {analysis.reasoningDepth?.label ?? '—'}
                      </td>
                    </>
                  )}
                  <td className="whitespace-nowrap px-5 py-3.5 text-right text-[10px] text-muted-foreground">
                    {formatDate(analysis.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  )
}

export function DashboardPage() {
  const { user } = useAuth()
  const student = isStudentRole(user?.role)

  const [data, setData] = useState<DashboardData | null>(null)
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    Promise.all([
      analyticsService.getDashboard(),
      analysisService.listAnalyses({ page: 1, pageSize: 100 }),
    ])
      .then(([dashboard, page]) => {
        if (!mounted) return
        setData(dashboard)
        setAnalyses(page.data)
      })
      .catch((err) => {
        if (!mounted) return
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load dashboard data.',
        )
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const averageDepth = useMemo(() => {
    const levels = analyses
      .map((analysis) => Number(analysis.reasoningDepth?.level))
      .filter((level) => Number.isInteger(level) && level >= 1 && level <= 5)

    return levels.length
      ? levels.reduce((sum, level) => sum + level, 0) / levels.length
      : null
  }, [analyses])

  if (isLoading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <LoadingSpinner size="lg" label="Loading dashboard…" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!data) return null

  const total = Number(data.stats.totalAnalyses ?? 0)
  const coverage = Number(data.stats.avgCoverage ?? 0)
  const stars = Number(data.stats.avgStars ?? 0)

  return (
    <div className="min-h-full bg-background text-foreground">
      <main className="mx-auto w-full max-w-[1500px] space-y-5 px-4 py-5 sm:px-6 sm:py-6 xl:px-8">
        {/* Compact welcome header: the data remains the focus. */}
        <header className="relative overflow-hidden rounded-2xl bg-sidebar px-5 py-5 text-white sm:px-7 sm:py-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full border border-white/[0.09]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-1 -top-8 h-32 w-32 rounded-full border border-white/[0.09]"
          />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#A9E3C4]">
                REXA / REASONING ANALYSIS
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-[-0.035em] sm:text-[30px]">
                {student ? 'Your answer workspace' : 'Reasoning at a glance'}
              </h1>
              <p className="mt-1.5 max-w-xl text-xs leading-5 text-emerald-50/75 sm:text-sm">
                Explore sentence roles, concept coverage, and reasoning depth.
              </p>
            </div>

            <Button
              asChild
              className="h-10 shrink-0 rounded-xl bg-[#C3EBD2] px-4 font-semibold text-sidebar shadow-none hover:bg-white"
            >
              <Link to={student ? ROUTES.APP.PRACTICE : ROUTES.APP.ANALYSIS}>
                <FileText className="mr-2 h-4 w-4" />
                {student ? 'Start practicing' : 'Open analysis'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </header>

        {/* Four compact, relevant metrics */}
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-foreground">
              Overview
            </h2>
            <span className="text-[10px] text-muted-foreground">
              Dashboard data
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              icon={Users}
              label={student ? 'Your analyses' : 'Total analyses'}
              value={total.toLocaleString()}
              detail="Reported by the dashboard API"
              tone="green"
            />
            <MetricCard
              icon={Target}
              label="Concept coverage"
              value={`${Math.round(coverage)}%`}
              detail="Average reported by the dashboard API"
              tone="gold"
            />
            <MetricCard
              icon={Waypoints}
              label="Average reasoning depth"
              value={averageDepth === null ? '—' : averageDepth.toFixed(1)}
              detail="Valid returned levels in loaded results, out of 5"
              tone="purple"
            />
            {!student && (
              <MetricCard
                icon={Gauge}
                label="Average star prediction"
                value={stars > 0 ? `${stars.toFixed(1)}/5` : '—'}
                detail="Average reported by the dashboard API"
                tone="blue"
              />
            )}
            {student && (
              <MetricCard
                icon={Gauge}
                label="Your average depth"
                value={
                  averageDepth === null ? '—' : `${averageDepth.toFixed(1)}/5`
                }
                detail="From your loaded analysis results"
                tone="blue"
              />
            )}
          </div>
        </section>

        {/* Main visual analysis */}
        <section className="grid gap-4 xl:grid-cols-2">
          <RoleDistribution distribution={data.roleDistribution} />
          <ReasoningDepth analyses={analyses} />
        </section>

        {/* Relationship data, not a decorative promotional card */}
        <section className="grid gap-4 xl:grid-cols-2">
          <RelationshipSummary analyses={analyses} />

          <Panel>
            <PanelHeader
              eyebrow="Analysis workflow"
              title="Inspect an answer"
              description="Open a result to see its available reasoning details."
              action={
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <GitBranch className="h-4 w-4" />
                </span>
              }
            />
            <div className="grid grid-cols-3 gap-2 p-4 sm:p-5">
              {[
                { number: '01', label: 'Sentence roles', icon: FileText },
                { number: '02', label: 'Concept coverage', icon: Target },
                { number: '03', label: 'Reasoning depth', icon: Waypoints },
              ].map((step) => {
                const Icon = step.icon
                return (
                  <div
                    key={step.number}
                    className="rounded-xl border border-border/80 bg-muted/25 p-3"
                  >
                    <span className="text-[9px] font-semibold tracking-widest text-primary">
                      {step.number}
                    </span>
                    <Icon className="my-3 h-4 w-4 text-primary" />
                    <p className="text-[10px] font-medium leading-4 text-foreground sm:text-xs">
                      {step.label}
                    </p>
                  </div>
                )
              })}
            </div>
            <div className="px-4 pb-4 sm:px-5 sm:pb-5">
              <Button asChild variant="outline" className="w-full rounded-xl">
                <Link to={ROUTES.APP.REASONING}>
                  Explore reasoning results
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Panel>
        </section>

        <RecentAnalyses analyses={analyses} student={student} />

        <footer className="border-t border-border/70 pt-3 text-[10px] text-muted-foreground">
          REXA · Explainable Reasoning Analysis of Descriptive Answers
        </footer>
      </main>
    </div>
  )
}
