import { useMemo, useState } from 'react'
import {
  Activity,
  Award,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Crown,
  FileText,
  Flame,
  LockKeyhole,
  ShieldCheck,
  Star,
  Target,
  Users,
  type LucideIcon,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PageHeader } from '@/components/common'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type AchievementStatus = 'earned' | 'in-progress' | 'locked'
type Filter = 'all' | AchievementStatus

type Achievement = {
  id: string
  title: string
  description: string
  icon: LucideIcon
  status: AchievementStatus
  progress?: number
  target?: number
  date?: string
}

// TEMPORARY DEMO DATA: illustrative UI only; not connected to a user's account.
// TODO: Replace with real backend achievement definitions and per-user progress.
const achievements: Achievement[] = [
  { id: 'first-analysis', title: 'First Analysis', description: 'Complete your first text analysis', icon: FileText, status: 'earned', date: 'Sep 1, 2026' },
  { id: 'deep-reasoner', title: 'Deep Reasoner', description: 'Achieve 5+ depth in an analysis', icon: Star, status: 'earned', date: 'Aug 28, 2026' },
  { id: 'consistent-practice', title: 'Consistent Practice', description: 'Practice for 7 days in a row', icon: CalendarDays, status: 'in-progress', progress: 5, target: 7 },
  { id: 'evidence-builder', title: 'Evidence Builder', description: 'Use strong evidence in your answers', icon: ShieldCheck, status: 'in-progress', progress: 3, target: 5 },
  { id: 'critical-thinker', title: 'Critical Thinker', description: 'Reach 10 analysis depth average', icon: Target, status: 'locked' },
  { id: 'high-performer', title: 'High Performer', description: 'Maintain a 4.0+ average for 10 analyses', icon: BarChart3, status: 'locked' },
  { id: 'subject-explorer', title: 'Subject Explorer', description: 'Analyze questions from 3 different subjects', icon: Users, status: 'locked' },
  { id: 'top-learner', title: 'Top Learner', description: 'Complete 50 analyses', icon: Crown, status: 'locked' },
]

const journey = [
  { week: 'Week 1', progress: 28 },
  { week: 'Week 2', progress: 44 },
  { week: 'Week 3', progress: 60 },
  { week: 'Week 4', progress: 71 },
  { week: 'Week 5', progress: 84 },
]

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'earned', label: 'Earned' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'locked', label: 'Locked' },
]

function StatusLabel({ status }: { status: AchievementStatus }) {
  if (status === 'earned') return <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300"><CheckCircle2 className="h-4 w-4" />Earned · demo</span>
  if (status === 'in-progress') return <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">In Progress · demo</span>
  return <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><LockKeyhole className="h-3.5 w-3.5" />Locked · demo</span>
}

function AchievementCard({ item }: { item: Achievement }) {
  const Icon = item.icon
  const earned = item.status === 'earned'
  const progressing = item.status === 'in-progress'
  const percent = item.progress && item.target ? Math.round(item.progress / item.target * 100) : 0

  return (
    <article className={`rounded-xl border p-4 transition-shadow hover:shadow-sm sm:p-5 ${earned ? 'border-emerald-700/15 bg-emerald-500/[0.045]' : progressing ? 'border-amber-500/25 bg-amber-500/[0.035]' : 'border-border bg-muted/20'}`}>
      <div className="flex items-start gap-3">
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${earned ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : progressing ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300' : 'bg-muted text-muted-foreground'}`}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold leading-5">{item.title}</h3>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">{item.description}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <StatusLabel status={item.status} />
        {item.date && <span className="text-xs text-muted-foreground">{item.date}</span>}
        {progressing && <span className="text-xs tabular-nums text-muted-foreground">{item.progress} / {item.target}</span>}
      </div>
      {progressing && <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label={`${item.title} demo progress`} aria-valuenow={item.progress} aria-valuemin={0} aria-valuemax={item.target}>
        <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${percent}%` }} />
      </div>}
    </article>
  )
}

export function AchievementsPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const visibleAchievements = useMemo(
    () => filter === 'all' ? achievements : achievements.filter((item) => item.status === filter),
    [filter],
  )
  const earned = achievements.filter((item) => item.status === 'earned')
  const nextMilestone = achievements.find((item) => item.status === 'in-progress')!
  const MilestoneIcon = nextMilestone.icon

  return (
    <div className="min-h-full bg-background text-foreground">
      <PageHeader
        title="Achievements"
        description="Your milestones and progress."
        actions={(
          <Card className="w-full border-primary/15 bg-primary/[0.035] sm:w-[min(34rem,50vw)]">
            <CardContent className="flex items-center gap-4 p-3 sm:p-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><Award className="h-6 w-6" /></span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-semibold">Level 3 <Badge variant="outline" className="ml-1 align-middle">Demo</Badge></h2>
                  <span className="text-xs tabular-nums text-muted-foreground">480 / 1,000 XP</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="Demo XP progress" aria-valuenow={480} aria-valuemin={0} aria-valuemax={1000}>
                  <div className="h-full w-[48%] rounded-full bg-primary" />
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">Illustrative level and experience points</p>
              </div>
            </CardContent>
          </Card>
        )}
      />
      <main className="mx-auto w-full max-w-[1500px] space-y-4 px-4 py-5 sm:px-6 sm:py-6 xl:px-8">
        <Alert className="border-amber-500/30 bg-amber-500/[0.06]">
          <Award className="h-4 w-4 text-amber-700 dark:text-amber-300" />
          <AlertDescription><strong>Illustrative demo preview.</strong> All badges, XP, chart points, dates, and stats on this page are sample UI data, not achievements earned by your account. REXA does not currently provide an achievements API.</AlertDescription>
        </Alert>

        <Card>
          <CardHeader className="gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div><CardTitle className="text-lg">Achievement badges</CardTitle><p className="mt-1 text-xs text-muted-foreground">Sample badge states for layout preview</p></div>
            <div className="flex flex-wrap gap-2" aria-label="Filter achievements">
              {filters.map((item) => <Button key={item.id} size="sm" variant={filter === item.id ? 'default' : 'outline'} aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>{item.label}</Button>)}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {visibleAchievements.length ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{visibleAchievements.map((item) => <AchievementCard key={item.id} item={item} />)}</div> : <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">There are no demo achievements in this category.</p>}
          </CardContent>
        </Card>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(260px,0.95fr)_minmax(230px,0.8fr)]">
          <Card className="min-w-0">
            <CardHeader className="flex-row items-start justify-between gap-3 pb-2">
              <div><CardTitle className="text-base">Learning Journey</CardTitle><p className="mt-1 text-sm text-muted-foreground">Illustrative progress trend · demo data</p></div>
              <Badge variant="outline">5 weeks</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-[230px] w-full" aria-label="Demo learning journey chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={journey} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
                    <defs><linearGradient id="achievementJourneyFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.25} /><stop offset="95%" stopColor="var(--primary)" stopOpacity={0.02} /></linearGradient></defs>
                    <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                    <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Demo progress']} contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)', borderRadius: 10, color: 'var(--foreground)' }} />
                    <Area type="monotone" dataKey="progress" stroke="var(--primary)" strokeWidth={3} fill="url(#achievementJourneyFill)" activeDot={{ r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Next Milestone</CardTitle><p className="text-sm text-muted-foreground">Sample progress toward a badge</p></CardHeader>
            <CardContent>
              <div className="rounded-xl border border-primary/15 bg-primary/[0.035] p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><MilestoneIcon className="h-6 w-6" /></span>
                  <div><h3 className="font-semibold">{nextMilestone.title}</h3><p className="text-sm text-muted-foreground">{nextMilestone.description}</p></div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full w-[71%] rounded-full bg-primary" /></div>
                  <span className="text-xs tabular-nums">{nextMilestone.progress}/{nextMilestone.target}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Demo progress only; no account progress is stored.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Quick Stats</CardTitle><p className="text-sm text-muted-foreground">Example summary · demo data</p></CardHeader>
            <CardContent className="space-y-1">
              {[
                { label: 'Total analyses', value: '12', icon: FileText, color: 'text-primary' },
                { label: 'Average score', value: '3.8 / 5', icon: Star, color: 'text-amber-600 dark:text-amber-300' },
                { label: 'Current level', value: 'Level 3', icon: Activity, color: 'text-primary' },
                { label: 'Longest streak', value: '5 days', icon: Flame, color: 'text-orange-600 dark:text-orange-300' },
              ].map((stat) => { const Icon = stat.icon; return <div key={stat.label} className="flex items-center justify-between gap-3 border-b py-3 last:border-0"><span className="flex items-center gap-2 text-sm text-muted-foreground"><Icon className={`h-4 w-4 ${stat.color}`} />{stat.label}</span><strong className="text-sm">{stat.value}</strong></div> })}
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader className="flex-row items-start justify-between gap-3">
            <div><CardTitle className="text-base">Recent Achievements</CardTitle><p className="mt-1 text-sm text-muted-foreground">Example milestone activity · demo data</p></div>
            <Button size="sm" variant="ghost" onClick={() => setFilter('all')}>View all</Button>
          </CardHeader>
          <CardContent className="grid gap-3 pt-0 md:grid-cols-3">
            {earned.slice(0, 2).concat(achievements.filter((item) => item.status === 'in-progress').slice(0, 1)).map((item) => { const Icon = item.icon; return <div key={item.id} className="flex min-w-0 items-center gap-3 rounded-lg border p-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.title}</p><p className="truncate text-xs text-muted-foreground">{item.description}</p></div><span className="shrink-0 text-right"><span className="block text-[11px] text-muted-foreground">{item.date ?? 'In progress'}</span><span className="text-[10px] font-medium text-primary">{item.status === 'earned' ? 'Demo earned' : 'Demo progress'}</span></span></div> })}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
