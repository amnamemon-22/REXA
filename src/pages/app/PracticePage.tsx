import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Search, Sparkles } from 'lucide-react'
import type { Question, QuestionDifficulty } from '@/types'
import { questionsService } from '@/services'
import { getPracticeProfile, savePracticeProfile, type PracticeProfile } from '@/services/mocks/practice-profile.mock'
import type { SkillLevel } from '@/types/practice.types'
import { ROUTES } from '@/routes/paths'
import { PageHeader, LoadingSpinner, EmptyState } from '@/components/common'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const levels = ['beginner', 'intermediate', 'advanced'] as const
const LEVEL_DIFFICULTY: Record<SkillLevel, QuestionDifficulty> = {
  beginner: 'easy',
  intermediate: 'medium',
  advanced: 'hard',
}

export function PracticePage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [subject, setSubject] = useState('all')
  const [profile, setProfile] = useState<PracticeProfile | null>(() => getPracticeProfile())

  useEffect(() => {
    let active = true
    questionsService.listQuestions({ pageSize: 100 })
      .then(page => { if (active) setQuestions(page.data) })
      .catch(err => { if (active) setError(err instanceof Error ? err.message : 'Could not load questions.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const subjects = useMemo(() => [...new Set(questions.map(q => q.subject?.trim()).filter((v): v is string => Boolean(v)))].sort(), [questions])
  const filtered = useMemo(() => questions.filter(q =>
    (subject === 'all' || q.subject?.trim() === subject) &&
    (!profile || q.difficulty === LEVEL_DIFFICULTY[profile.skillLevel]) &&
    (!search.trim() || q.text.toLowerCase().includes(search.trim().toLowerCase()) || (q.subject ?? '').toLowerCase().includes(search.trim().toLowerCase()))
  ), [questions, search, subject, profile])

  const chooseLevel = (level: typeof levels[number]) => {
    try { setProfile(savePracticeProfile(level)) }
    catch { setError('Your browser could not save this device-only preference.') }
  }

  const clearLevel = () => {
    try {
      localStorage.removeItem('rexa-practice-profile')
      setProfile(null)
    } catch {
      setError('Your browser could not clear this device-only preference.')
    }
  }

  const clearFilters = () => {
    setSearch('')
    setSubject('all')
    clearLevel()
  }

  const hasActiveFilters = Boolean(profile || search.trim() || subject !== 'all')

  return <div>
    <PageHeader title="Practice" description="Choose a question from the live question bank and explore how your answer is structured." />
    <main className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader><CardTitle className="text-base">Choose a practice level <Badge variant="outline" className="ml-2">Optional</Badge></CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">This optional preference is saved only in this browser and filters practice questions by their listed difficulty. It does not verify your ability or change the analysis model.</p>
          <div className="flex flex-wrap gap-2">{levels.map(level => <Button key={level} type="button" variant={profile?.skillLevel === level ? 'default' : 'outline'} onClick={() => chooseLevel(level)} className="capitalize">{level}</Button>)}
            {profile && <Button type="button" variant="ghost" onClick={clearLevel}>Clear</Button>}
          </div>
        </CardContent>
      </Card>
      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div><h2 className="text-xl font-semibold">Choose a question</h2><p className="text-sm text-muted-foreground">Questions and subjects come from your connected question bank.</p></div>
          <Button asChild variant="outline"><Link to={ROUTES.APP.HISTORY}>View your history <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
          <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search questions" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions or subjects" className="pl-9" /></div>
          <select aria-label="Filter by subject" value={subject} onChange={e => setSubject(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm"><option value="all">All subjects</option>{subjects.map(s => <option key={s} value={s}>{s}</option>)}</select>
        </div>
        {loading ? <LoadingSpinner label="Loading questions" /> : error ? <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert> : filtered.length === 0 ? <EmptyState
          title={questions.length ? 'No matching questions' : 'No questions available yet'}
          description={questions.length
            ? profile
              ? `No loaded questions match ${profile.skillLevel} (${LEVEL_DIFFICULTY[profile.skillLevel]}) and the current search/subject filters. Questions without a recognized difficulty are not included.`
              : 'No loaded questions match the current search and subject filters.'
            : 'The connected question bank returned no questions. Ask your instructor to add questions, then refresh this page.'}
          action={hasActiveFilters ? <Button type="button" variant="outline" onClick={clearFilters}>Clear filters</Button> : undefined}
        /> :
          <div className="grid gap-4 md:grid-cols-2">{filtered.map(question => <Card key={question.id} className="flex flex-col">
            <CardHeader className="space-y-3"><div className="flex items-start justify-between gap-3"><CardTitle className="text-base leading-6">{question.text}</CardTitle><BookOpen className="h-5 w-5 shrink-0 text-primary" /></div><div className="flex flex-wrap gap-2">{question.subject && <Badge variant="secondary">{question.subject}</Badge>}{question.difficulty && <Badge variant="outline" className="capitalize">{question.difficulty}</Badge>}</div></CardHeader>
            <CardContent className="mt-auto space-y-4"><p className="text-sm text-muted-foreground">{question.concepts.length ? `Concepts: ${question.concepts.join(', ')}` : 'Concept details are not available for this question.'}</p><Button asChild className="w-full"><Link to={`${ROUTES.APP.ANALYSIS}?questionId=${encodeURIComponent(question.id)}`}><Sparkles className="mr-2 h-4 w-4" />Write an answer<ArrowRight className="ml-2 h-4 w-4" /></Link></Button></CardContent>
          </Card>)}</div>}
      </section>
    </main>
  </div>
}
