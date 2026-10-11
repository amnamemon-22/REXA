import { useEffect, useMemo, useRef, useState } from 'react'
import { RexaAnalysisDashboard } from '@/components/common/RexaAnalysisDashboard'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertCircle, FileUp, Loader2, Sparkles } from 'lucide-react'
import type { AnalysisResult, Question } from '@/types'
import { analysisService, questionsService } from '@/services'
import { useAuth } from '@/hooks'
import { isStudentRole, isTeacherRole } from '@/lib/roles'
import { ROUTES } from '@/routes/paths'
import {
  EmptyState,
  PageHeader,
  ROLE_LABELS,
  ALL_ROLES,
  StarRating,
  TagInput,
} from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const analysisSchema = z
  .object({
    mode: z.enum(['bank', 'custom', 'pdf']),
    questionId: z.string().optional(),
    questionText: z.string().optional(),
    referenceAnswer: z.string().optional(),
    concepts: z.string().optional(),
    studentAnswer: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.mode === 'pdf') {
      return
    }
    if (!data.studentAnswer?.trim()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Student answer is required',
        path: ['studentAnswer'],
      })
    }
    if (data.mode === 'bank' && !data.questionId) {
      ctx.addIssue({
        code: 'custom',
        message: 'Select a question from the bank',
        path: ['questionId'],
      })
    }
    if (data.mode === 'custom') {
      if (!data.questionText?.trim()) {
        ctx.addIssue({
          code: 'custom',
          message: 'Question text is required',
          path: ['questionText'],
        })
      }
    }
  })

type AnalysisFormValues = z.infer<typeof analysisSchema>

type PdfExamView = {
  result: AnalysisResult
  questionText: string
  note?: string | null
}

const DRAFT_KEY = 'rexa-analysis-draft'

function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

function Counter({ text }: { text: string }) {
  return (
    <p className="text-xs text-muted-foreground">
      {countWords(text)} words · {text.length} characters
    </p>
  )
}

function coveragePercent(analysis: AnalysisResult): number | null {
  const items = analysis.conceptCoverage
  if (!items.length) return null
  return Math.round((100 * items.filter((item) => item.covered).length) / items.length)
}

function RetrySnapshot({
  label,
  analysis,
}: {
  label: string
  analysis: AnalysisResult
}) {
  const roles = new Map<string, number>()

  for (const sentence of analysis.sentenceRoles) {
    roles.set(sentence.role, (roles.get(sentence.role) ?? 0) + 1)
  }

  const coverage = coveragePercent(analysis)

  const depthPercent = Math.min(
    100,
    Math.max(0, (analysis.reasoningDepth.level / 5) * 100),
  )

  const depthRadius = 32
  const depthCircumference = 2 * Math.PI * depthRadius
  const depthOffset =
    depthCircumference -
    (depthPercent / 100) * depthCircumference

  const coveragePercentValue = coverage ?? 0
  const coverageRadius = 32
  const coverageCircumference = 2 * Math.PI * coverageRadius
  const coverageOffset =
    coverageCircumference -
    (coveragePercentValue / 100) * coverageCircumference

  const roleStyles: Record<
    string,
    {
      dot: string
      bar: string
    }
  > = {
    claim: {
      dot: 'bg-emerald-400',
      bar: 'bg-emerald-400',
    },
    evidence: {
      dot: 'bg-blue-400',
      bar: 'bg-blue-400',
    },
    reasoning: {
      dot: 'bg-violet-500',
      bar: 'bg-violet-500',
    },
    elaboration: {
      dot: 'bg-amber-400',
      bar: 'bg-amber-400',
    },
    counterargument: {
      dot: 'bg-red-400',
      bar: 'bg-red-400',
    },
    conclusion: {
      dot: 'bg-pink-400',
      bar: 'bg-pink-400',
    },
    irrelevant: {
      dot: 'bg-slate-500',
      bar: 'bg-slate-500',
    },
  }

  const roleEntries = ALL_ROLES.filter((role) => roles.get(role)).map(
    (role) => ({
      role,
      count: roles.get(role) ?? 0,
    }),
  )

  const maxRoleCount = Math.max(
    1,
    ...roleEntries.map((item) => item.count),
  )

  const isNew = label.toLowerCase() === 'new'

  return (
    <div
      className={`
  rounded-2xl border p-4
        ${
          isNew
            ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/50 dark:bg-emerald-950/20'
            : 'bg-card'
        }
      `}
    >
      {/* Label */}
      <div className="mb-3">
        <span
          className={`
            inline-flex rounded-full px-4 py-1.5
            text-base font-semibold
            ${
              isNew
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                : 'bg-muted text-foreground'
            }
          `}
        >
          {label}
        </span>
      </div>

      {/* Reasoning depth */}
      <div className="flex items-center gap-5 border-b pb-5">
        <div className="relative h-[72px] w-[72px] shrink-0">
          <svg
            viewBox="0 0 80 80"
            className="h-full w-full -rotate-90"
            aria-label={`Reasoning depth ${analysis.reasoningDepth.level} out of 5`}
          >
            <circle
              cx="40"
              cy="40"
              r={depthRadius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted"
            />

            <circle
              cx="40"
              cy="40"
              r={depthRadius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={depthCircumference}
              strokeDashoffset={depthOffset}
              className="text-amber-500"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold">
              {analysis.reasoningDepth.level}/5
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">
            Reasoning depth
          </p>

          <p className="mt-1 text-lg font-semibold leading-snug">
            {analysis.reasoningDepth.level}/5 ·{' '}
            {analysis.reasoningDepth.label}
          </p>
        </div>
      </div>

      {/* Concept coverage */}
      <div className="flex items-center gap-4 border-b pb-3">
        <div className="relative h-[92px] w-[92px] shrink-0">
          <svg
            viewBox="0 0 80 80"
            className="h-full w-full -rotate-90"
            aria-label={`Concept coverage ${coverage ?? 0}%`}
          >
            <circle
              cx="40"
              cy="40"
              r={coverageRadius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted"
            />

            <circle
              cx="40"
              cy="40"
              r={coverageRadius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={coverageCircumference}
              strokeDashoffset={coverageOffset}
              className="text-emerald-500"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-semibold">
              {coverage == null ? '—' : `${coverage}%`}
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">
            Concept coverage
          </p>

          <p className="mt-1 text-lg font-semibold">
            {coverage == null
              ? 'No concept data'
              : `${coverage}%`}
          </p>

          {coverage != null && (
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{
                  width: `${coverage}%`,
                }}
              />
            </div>
          )}

          {coverage != null && (
            <p className="mt-1 text-right text-xs text-muted-foreground">
              {coverage}%
            </p>
          )}
        </div>
      </div>

      {/* Role distribution */}
      <div className="pt-5">
        <p className="mb-3 text-sm text-muted-foreground">
          Role distribution
        </p>

        {roleEntries.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No sentence-role data returned.
          </p>
        ) : (
          <div className="space-y-3">
            {roleEntries.map(({ role, count }) => {
              const style =
                roleStyles[role] ?? {
                  dot: 'bg-slate-400',
                  bar: 'bg-slate-400',
                }

              const percentage = Math.round(
                (count / maxRoleCount) * 100,
              )

              return (
                <div
                  key={role}
                  className="grid grid-cols-[180px_minmax(0,1fr)_32px] items-center gap-3"
                >
                  <span className="flex min-w-0 items-center gap-2 text-sm">
                    <span
                      className={`h-3 w-3 shrink-0 rounded-full ${style.dot}`}
                    />

                    <span className="truncate">
                      {ROLE_LABELS[role]}
                    </span>
                  </span>

                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${style.bar}`}
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <span className="text-right text-sm text-muted-foreground tabular-nums">
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export function AnalysisPage() {
  const { user } = useAuth()
  const isTeacher = isTeacherRole(user?.role)
  const isStudent = isStudentRole(user?.role)
  const [searchParams, setSearchParams] = useSearchParams()
  const examPdfInputRef = useRef<HTMLInputElement>(null)
  const referenceAnswerRef = useRef<HTMLTextAreaElement>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isExtractingPdf, setIsExtractingPdf] = useState(false)
  const [extractedPdfName, setExtractedPdfName] = useState<string | null>(null)
  const [pdfName, setPdfName] = useState<string | null>(null)
  const [pdfItems, setPdfItems] = useState<PdfExamView[]>([])
  const [activePdfIndex, setActivePdfIndex] = useState(0)
  const [previousResult, setPreviousResult] = useState<AnalysisResult | null>(
    null,
  )
  const [revisedAnswer, setRevisedAnswer] = useState('')
  const [conceptTags, setConceptTags] = useState<string[]>([])
  const [draftStatus, setDraftStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<AnalysisFormValues>({
    resolver: zodResolver(analysisSchema),
    defaultValues: {
      mode: 'bank',
      questionId: '',
      questionText: '',
      referenceAnswer: '',
      concepts: '',
      studentAnswer: '',
    },
  })

  const { ref: referenceRegisterRef, ...referenceRegister } =
    register('referenceAnswer')

  const mode = watch('mode')
  const questionId = watch('questionId')
  const questionText = watch('questionText') ?? ''
  const referenceAnswer = watch('referenceAnswer') ?? ''
  const studentAnswer = watch('studentAnswer') ?? ''

  useEffect(() => {
    let mounted = true
    questionsService
      .listQuestions({ pageSize: 100 })
      .then((response) => {
        if (!mounted) return
        setQuestions(response.data)
        const requestedId = searchParams.get('questionId')
        const requestedQuestion = response.data.find((item) => item.id === requestedId)
        if (requestedQuestion) {
          setValue('mode', 'bank')
          setValue('questionId', requestedQuestion.id)
        }
      })
      .catch(() => {
        if (mounted) setQuestions([])
      })
    return () => { mounted = false }
  }, [searchParams, setValue])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (!raw) return
      const draft = JSON.parse(raw) as Partial<AnalysisFormValues> & {
        conceptTags?: string[]
      }
      if (draft.mode && (isTeacher || draft.mode !== 'pdf')) {
        setValue('mode', draft.mode)
      }
      if (draft.questionId) setValue('questionId', draft.questionId)
      if (draft.questionText) setValue('questionText', draft.questionText)
      if (draft.referenceAnswer) setValue('referenceAnswer', draft.referenceAnswer)
      if (draft.studentAnswer) setValue('studentAnswer', draft.studentAnswer)
      if (draft.concepts) setValue('concepts', draft.concepts)
      if (draft.conceptTags?.length) {
        setConceptTags(draft.conceptTags)
        setValue('concepts', draft.conceptTags.join(','))
      }
      setDraftStatus('saved')
    } catch {
      // ignore corrupt drafts
    }
  }, [setValue, isTeacher])

  useEffect(() => {
    const beforeId = searchParams.get('before')
    const afterId = searchParams.get('after')
    if (!beforeId || !afterId || isTeacher) return
    let mounted = true
    Promise.all([
      analysisService.getAnalysis(beforeId),
      analysisService.getAnalysis(afterId),
    ])
      .then(([before, after]) => {
        if (!mounted) return
        setPreviousResult(before)
        setResult(after)
        setRevisedAnswer(after.studentAnswer)
        if (after.questionId) {
          setValue('mode', 'bank')
          setValue('questionId', after.questionId)
        } else if (after.questionText) {
          setValue('mode', 'custom')
          setValue('questionText', after.questionText)
        }
        if (after.studentAnswer) {
          setValue('studentAnswer', after.studentAnswer)
        }
      })
      .catch(() => {
        /* ignore stale compare links */
      })
    return () => {
      mounted = false
    }
  }, [searchParams, isTeacher, setValue])

  useEffect(() => {
    if (!isTeacher && mode === 'pdf') setValue('mode', 'bank')
  }, [isTeacher, mode, setValue])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDraftStatus('saving')
      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({
            mode,
            questionId,
            questionText,
            referenceAnswer,
            studentAnswer,
            concepts: conceptTags.join(','),
            conceptTags,
          }),
        )
        setDraftStatus('saved')
      } catch {
        setDraftStatus('idle')
      }
    }, 600)
    return () => window.clearTimeout(timer)
  }, [mode, questionId, questionText, referenceAnswer, studentAnswer, conceptTags])

  useEffect(() => {
    if (referenceAnswerRef.current) {
      referenceAnswerRef.current.scrollTop = 0
    }
  }, [referenceAnswer, questionId])

  const selectedQuestion = useMemo(
    () => questions.find((question) => question.id === questionId) ?? null,
    [questions, questionId],
  )

  const shownResult = pdfItems[activePdfIndex]?.result ?? result
  const shownPdf = pdfItems[activePdfIndex]

  const executeAnalysis = async (
    values: AnalysisFormValues,
    options: { retry?: boolean; answerOverride?: string } = {},
  ) => {
    if (values.mode === 'pdf') return

    const retry = Boolean(options.retry)
    const answerText = (options.answerOverride ?? values.studentAnswer ?? '').trim()
    if (!answerText) {
      setError('Student answer is required')
      return
    }

    setError(null)
    if (!retry) {
      setPreviousResult(null)
      setResult(null)
      setSearchParams({})
    }
    setPdfItems([])
    setExtractedPdfName(null)

    let payload: {
      questionId?: string
      questionText: string
      referenceAnswer?: string
      concepts?: string[]
      studentAnswer: string
    }

    if (values.mode === 'bank') {
      const question = questions.find((q) => q.id === values.questionId)
      if (!question) {
        setError('Please select a valid question from the bank.')
        return
      }
      payload = {
        questionId: question.id,
        questionText: question.text,
        studentAnswer: answerText,
      }
      if (isTeacher) {
        payload.referenceAnswer = question.referenceAnswer ?? ''
        payload.concepts = question.concepts
      }
    } else {
      payload = {
        questionText: values.questionText!.trim(),
        studentAnswer: answerText,
      }
      if (isTeacher) {
        payload.referenceAnswer = (values.referenceAnswer ?? '').trim()
        payload.concepts = values.concepts
          ? values.concepts
              .split(',')
              .map((concept) => concept.trim())
              .filter(Boolean)
          : conceptTags
      }
    }

    const before = retry ? result : null
    setIsAnalyzing(true)
    try {
      const analysis = await analysisService.analyze(payload)
      if (before) {
        setPreviousResult(before)
        setSearchParams({ before: before.id, after: analysis.id })
      }
      setResult(analysis)
      setRevisedAnswer(analysis.studentAnswer || answerText)
      setValue('studentAnswer', answerText)
      try {
        localStorage.removeItem(DRAFT_KEY)
      } catch {
        // ignore
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to run analysis.',
      )
    } finally {
      setIsAnalyzing(false)
    }
  }

  const onSubmit = async (values: AnalysisFormValues) => {
    await executeAnalysis(values)
  }

  const onRetry = () => {
    void handleSubmit((values) =>
      executeAnalysis(values, { retry: true, answerOverride: revisedAnswer }),
    )()
  }

  return (
    <div>
      <PageHeader
        title={isTeacher ? 'Run analysis' : 'Reasoning console'}
        description={
          isTeacher
            ? 'Paste an answer, or upload one exam PDF with questions and answers — RExA reads both and returns the same role, coverage, and explanation breakdown.'
            : 'Enter your own question or pick one from the bank, write an answer, then revise and compare runs.'
        }
      />

      
<div className="mx-auto w-full max-w-[1700px] px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-base">Question &amp; answer</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="relative space-y-5"
              aria-busy={isAnalyzing}
            >
              {isAnalyzing && (
                <div
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-lg bg-background/85 backdrop-blur-[1px]"
                  role="status"
                  aria-live="polite"
                >
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm font-medium">Analyzing answer…</p>
                  <p className="text-xs text-muted-foreground">
                    Scoring roles, coverage, and depth.
                  </p>
                </div>
              )}
              <Tabs
                value={mode}
                onValueChange={(value) =>
                  setValue('mode', value as 'bank' | 'custom' | 'pdf')
                }
              >
                <TabsList className="w-full">
                  <TabsTrigger value="bank">Question bank</TabsTrigger>
                  <TabsTrigger value="custom">
                    {isTeacher ? 'Custom' : 'Your question'}
                  </TabsTrigger>
                  {isTeacher && <TabsTrigger value="pdf">Exam PDF</TabsTrigger>}
                </TabsList>
              </Tabs>

              {mode === 'bank' && (
                <div className="space-y-2">
                  <Label htmlFor="questionId">Question</Label>
                  <Select id="questionId" {...register('questionId')}>
                    <option value="">Select a question…</option>
                    {questions.map((question) => (
                      <option key={question.id} value={question.id}>
                        {question.text}
                      </option>
                    ))}
                  </Select>
                  {errors.questionId && (
                    <p className="text-xs text-destructive" role="alert">
                      {errors.questionId.message}
                    </p>
                  )}
                  {selectedQuestion && (
                    <div className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">
                      {isTeacher ? (
                        selectedQuestion.referenceAnswer?.trim() ? (
                          <>
                            <p className="mb-1 font-medium text-foreground">
                              Reference answer (optional)
                            </p>
                            <p className="line-clamp-3">
                              {selectedQuestion.referenceAnswer}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="mb-1 font-medium text-foreground">
                              Question
                            </p>
                            <p className="line-clamp-4">
                              {selectedQuestion.text}
                            </p>
                          </>
                        )
                      ) : (
                        <>
                          <p className="mb-1 font-medium text-foreground">
                            Question
                          </p>
                          <p className="line-clamp-4">{selectedQuestion.text}</p>
                        </>
                      )}
                      {isTeacher && selectedQuestion.concepts.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {selectedQuestion.concepts.map((concept) => (
                            <Badge key={concept} variant="outline">
                              {concept}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {questions.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      {isTeacher ? (
                        <>
                          No questions in the bank yet. Add one from the{' '}
                          <Link
                            to={ROUTES.APP.QUESTIONS}
                            className="font-medium text-primary hover:underline"
                          >
                            Questions
                          </Link>{' '}
                          page, or switch to a custom question.
                        </>
                      ) : (
                        'No questions are available yet. Switch to Your question to enter one yourself, or ask your instructor to add one to the bank.'
                      )}
                    </p>
                  )}
                </div>
              )}

              {mode === 'custom' && (
                <div className="w-full space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="questionText">Question</Label>
                    <Textarea
                      id="questionText"
                      placeholder="What causes the seasons on Earth?"
                      {...register('questionText')}
                    />
                    <Counter text={questionText} />
                    {errors.questionText && (
                      <p className="text-xs text-destructive" role="alert">
                        {errors.questionText.message}
                      </p>
                    )}
                  </div>

                  {isTeacher && (
                    <>
                  <div className="space-y-2">
                    <Label htmlFor="referenceAnswer">
                      Reference answer (optional) — used only for baseline
                      comparison
                    </Label>
                    <Textarea
                      id="referenceAnswer"
                      placeholder="The tilt of Earth's axis relative to its orbit around the Sun…"
                      className="scroll-pt-0"
                      {...referenceRegister}
                      ref={(node) => {
                        referenceRegisterRef(node)
                        referenceAnswerRef.current = node
                        if (node) node.scrollTop = 0
                      }}
                    />
                    <Counter text={referenceAnswer} />
                    {errors.referenceAnswer && (
                      <p className="text-xs text-destructive" role="alert">
                        {errors.referenceAnswer.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="concepts">Key concepts</Label>
                    <TagInput
                      id="concepts"
                      value={conceptTags}
                      onChange={(tags) => {
                        setConceptTags(tags)
                        setValue('concepts', tags.join(','), {
                          shouldDirty: true,
                        })
                      }}
                      placeholder="Type a concept and press Enter"
                    />
                    <p className="text-xs text-muted-foreground">
                      Press Enter or comma to add a chip. These are checked
                      against the student answer.
                    </p>
                  </div>
                    </>
                  )}
                </div>
              )}

              {isTeacher && mode === 'pdf' && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Drop in a typed PDF that includes the questions and the
                    student answers. Headings such as{' '}
                    <span className="font-medium text-foreground">Question:</span> /{' '}
                    <span className="font-medium text-foreground">Answer:</span>{' '}
                    or numbered items like{' '}
                    <span className="font-medium text-foreground">1. … ?</span> work
                    best. RExA splits each pair and runs the full analysis.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Answer-only PDFs are fine too — pick the question below first.
                    Scanned handwriting usually cannot be read.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="pdfQuestionId">Question (optional)</Label>
                    <Select id="pdfQuestionId" {...register('questionId')}>
                      <option value="">Detect from the PDF / question bank</option>
                      {questions.map((question) => (
                        <option key={question.id} value={question.id}>
                          {question.text}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <Button
                    type="button"
                    className="w-full"
                    disabled={isAnalyzing}
                    onClick={() => examPdfInputRef.current?.click()}
                  >
                    {isAnalyzing ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <FileUp />
                    )}
                    Analyze exam PDF
                  </Button>
                  <input
                    ref={examPdfInputRef}
                    id="exam-pdf-input"
                    type="file"
                    accept="application/pdf,.pdf"
                    className="sr-only"
                    onChange={async (event) => {
                      const file = event.target.files?.[0]
                      event.target.value = ''
                      if (!file) return
                      setError(null)
                      setResult(null)
                      setPdfItems([])
                      setActivePdfIndex(0)
                      setIsAnalyzing(true)
                      try {
                        const data = await analysisService.analyzePdf(
                          file,
                          watch('questionId') || undefined,
                        )
                        const views: PdfExamView[] = data.items.map((item) => ({
                          result: item.result,
                          questionText: item.questionText,
                          note: item.note,
                        }))
                        setPdfName(data.filename)
                        setPdfItems(views)
                        setActivePdfIndex(0)
                        setResult(views[0].result)
                      } catch (err) {
                        setError(
                          err instanceof Error
                            ? err.message
                            : 'Could not analyze this PDF.',
                        )
                      } finally {
                        setIsAnalyzing(false)
                      }
                    }}
                  />
                  <a
                    href="/samples/rexa-exam-sample.pdf"
                    download
                    className="block text-center text-xs font-medium text-primary hover:underline"
                  >
                    Download a sample exam PDF
                  </a>
                </div>
              )}

              {mode !== 'pdf' && (
                <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="studentAnswer">
                    {isTeacher ? 'Student answer' : 'Your answer'}
                  </Label>
                  <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                    <FileUp className="h-3.5 w-3.5" />
                    {isExtractingPdf ? 'Reading PDF…' : 'Upload PDF'}
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      className="sr-only"
                      disabled={isExtractingPdf || isAnalyzing}
                      onChange={async (event) => {
                        const file = event.target.files?.[0]
                        event.target.value = ''
                        if (!file) return
                        setError(null)
                        setIsExtractingPdf(true)
                        try {
                          const extracted = await analysisService.extractPdf(file)
                          setValue('studentAnswer', extracted.text, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                          setExtractedPdfName(extracted.filename)
                        } catch (err) {
                          setError(
                            err instanceof Error
                              ? err.message
                              : 'Could not read this PDF.',
                          )
                        } finally {
                          setIsExtractingPdf(false)
                        }
                      }}
                    />
                  </label>
                </div>
                {extractedPdfName && (
                  <p className="text-xs text-muted-foreground">
                    Loaded from {extractedPdfName}. You can edit the text before running
                    analysis. Typed PDFs work; scanned photos of handwriting may
                    not.
                  </p>
                )}
                <Textarea
                  id="studentAnswer"
                  rows={6}
                  placeholder={
                    isTeacher
                      ? "Paste the student's answer, or upload a PDF…"
                      : 'Paste your answer…'
                  }
                  {...register('studentAnswer')}
                />
                <div className="flex items-center justify-between gap-2">
                  <Counter text={studentAnswer} />
                  <p className="text-xs text-muted-foreground" aria-live="polite">
                    {draftStatus === 'saving'
                      ? 'Saving draft…'
                      : draftStatus === 'saved'
                        ? 'Draft saved'
                        : ''}
                  </p>
                </div>
                {errors.studentAnswer && (
                  <p className="text-xs text-destructive" role="alert">
                    {errors.studentAnswer.message}
                  </p>
                )}
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {mode !== 'pdf' && (
                <Button type="submit" className="w-full" disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Sparkles />
                  )}
                  {isTeacher ? 'Run analysis' : 'Submit answer'}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 space-y-6">
          {!shownResult && !isAnalyzing && (
            <EmptyState
              icon={Sparkles}
              title="No analysis yet"
              description={
                isTeacher
                  ? 'Paste an answer or upload an exam PDF to see roles, coverage, stars, and explanations here.'
                  : 'Pick a question or write your own, then submit to see coverage, depth, and explanations here.'
              }
              className="h-full"
            />
          )}

          {isAnalyzing && (
            <EmptyState
              icon={Loader2}
              title="Analyzing…"
              description="REXA is reasoning through the answer. This usually takes a few seconds."
              className="h-full"
            />
          )}

          {shownResult && !isAnalyzing && (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  {isTeacher
                    ? 'Full breakdown below. Open reasoning engine for threshold review.'
                    : 'Your REXA breakdown is below. Open My feedback for sentence highlights and support pairs.'}
                </p>
                <Button asChild variant="outline" size="sm" className="shrink-0">
                  <Link
                    to={`${ROUTES.APP.REASONING}?id=${shownResult.id}`}
                  >
                    {isTeacher ? 'Open reasoning engine' : 'View full feedback'}
                  </Link>
                </Button>
              </div>

              {shownPdf?.note?.trim() && (
                <Alert>
                  <AlertDescription>{shownPdf.note}</AlertDescription>
                </Alert>
              )}

{isStudent &&
  previousResult &&
  previousResult.id !== shownResult.id && (
    <section className="w-full rounded-2xl border bg-card p-6 shadow-sm">
      {/* Section heading */}
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">
          Previous vs new
        </h2>
      </div>

      {/* Comparison */}
      <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)]">
        {/* Previous */}
        <RetrySnapshot
          label="Previous"
          analysis={previousResult}
        />

        {/* Arrow */}
        <div className="hidden items-center justify-center lg:flex">
          <div className="grid h-12 w-12 place-items-center rounded-full border bg-background text-2xl shadow-sm">
            →
          </div>
        </div>

        {/* New */}
        <RetrySnapshot
          label="New"
          analysis={shownResult}
        />
      </div>
    </section>
  )}
  
              {pdfItems.length > 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {pdfItems.length} questions in {pdfName ?? 'this PDF'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {pdfItems.map((item, index) => (
                      <button
                        key={item.result.id}
                        type="button"
                        onClick={() => {
                          setActivePdfIndex(index)
                          setResult(item.result)
                        }}
                        className={`w-full rounded-md border p-2.5 text-left text-sm transition-colors ${
                          index === activePdfIndex
                            ? 'border-primary bg-primary/5'
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">Q{index + 1}</span>
                          <StarRating value={item.result.stars} size="sm" />
                        </div>
                        <p className="mt-1 line-clamp-2 text-muted-foreground">
                          {item.questionText}
                        </p>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}

<RexaAnalysisDashboard
  analysis={shownResult}
  isTeacher={isTeacher}
  isStudent={isStudent}
/>
              {isStudent && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Revise and re-run</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Edit your answer and run it again. Both versions stay on
                      this page, including after a reload.
                    </p>
                    <Textarea
                      rows={6}
                      value={revisedAnswer}
                      onChange={(event) => setRevisedAnswer(event.target.value)}
                      aria-label="Revised answer"
                    />
                    <Button
                      type="button"
                      className="w-full"
                      disabled={isAnalyzing || !revisedAnswer.trim()}
                      onClick={onRetry}
                    >
                      {isAnalyzing ? <Loader2 className="animate-spin" /> : <Sparkles />}
                      Re-run analysis
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
