import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { BookOpen, Loader2, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import type { Question } from '@/types'
import { questionsService } from '@/services'
import { EmptyState, FormField, LoadingSpinner, PageHeader } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const questionSchema = z.object({
  text: z.string().min(1, 'Question text is required'),
  referenceAnswer: z.string().optional(),
  concepts: z.string().min(1, 'Add at least one concept'),
  subject: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
})

type QuestionFormValues = z.infer<typeof questionSchema>

const DIFFICULTY_VARIANT: Record<string, 'secondary' | 'outline' | 'default'> = {
  easy: 'secondary',
  medium: 'outline',
  hard: 'default',
}

export function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [search, setSearch] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'az' | 'difficulty'>('newest')
  const [page, setPage] = useState(1)
  const pageSize = 8
  const [deletingQuestion, setDeletingQuestion] = useState<Question | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: '',
      referenceAnswer: '',
      concepts: '',
      subject: '',
      difficulty: 'medium',
    },
  })

  const loadQuestions = () => {
    setIsLoading(true)
    setError(null)
    questionsService
      .listQuestions({ pageSize: 100 })
      .then((response) => setQuestions(response.data))
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : 'Failed to load questions.',
        )
      })
      .finally(() => setIsLoading(false))
  }

  const filteredQuestions = useMemo(() => {
    let rows = [...questions]
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter(
        (item) =>
          item.text.toLowerCase().includes(q) ||
          (item.subject ?? '').toLowerCase().includes(q),
      )
    }
    if (difficultyFilter !== 'all') {
      rows = rows.filter((item) => (item.difficulty ?? 'medium') === difficultyFilter)
    }
    rows.sort((a, b) => {
      if (sortBy === 'az') return a.text.localeCompare(b.text)
      if (sortBy === 'difficulty') {
        const order = { easy: 0, medium: 1, hard: 2 }
        return (order[a.difficulty ?? 'medium'] ?? 1) - (order[b.difficulty ?? 'medium'] ?? 1)
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    return rows
  }, [questions, search, difficultyFilter, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / pageSize))
  const pagedQuestions = filteredQuestions.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    loadQuestions()
  }, [])

  const openCreateDialog = () => {
    setEditingQuestion(null)
    reset({
      text: '',
      referenceAnswer: '',
      concepts: '',
      subject: '',
      difficulty: 'medium',
    })
    setIsDialogOpen(true)
  }

  const openEditDialog = (question: Question) => {
    setEditingQuestion(question)
    reset({
      text: question.text,
      referenceAnswer: question.referenceAnswer ?? '',
      concepts: question.concepts.join(', '),
      subject: question.subject ?? '',
      difficulty: question.difficulty ?? 'medium',
    })
    setIsDialogOpen(true)
  }

  const onSubmit = async (values: QuestionFormValues) => {
    setIsSaving(true)
    setError(null)

    const payload = {
      text: values.text.trim(),
      referenceAnswer: values.referenceAnswer?.trim() ?? '',
      concepts: values.concepts
        .split(',')
        .map((concept) => concept.trim())
        .filter(Boolean),
      subject: values.subject?.trim() || undefined,
      difficulty: values.difficulty,
    }

    try {
      if (editingQuestion) {
        await questionsService.updateQuestion(editingQuestion.id, payload)
      } else {
        await questionsService.createQuestion(payload)
      }
      setIsDialogOpen(false)
      loadQuestions()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save question.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingQuestion) return
    setIsDeleting(true)
    try {
      await questionsService.deleteQuestion(deletingQuestion.id)
      setDeletingQuestion(null)
      loadQuestions()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete question.',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Question bank"
        description="Manage the questions, reference answers, and concepts used across analyses."
        actions={
          <Button onClick={openCreateDialog}>
            <Plus />
            New question
          </Button>
        }
      />

      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="border-border/80 bg-card shadow-sm">
          <CardContent className="grid gap-3 p-3 sm:grid-cols-[minmax(0,1.35fr)_minmax(180px,1fr)_minmax(160px,1fr)] sm:p-4">
            <div className="relative">
              <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search questions…"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                aria-label="Search questions"
                className="h-11 pl-9"
              />
            </div>
            <Select
              value={difficultyFilter}
              onChange={(event) => {
                setDifficultyFilter(event.target.value as typeof difficultyFilter)
                setPage(1)
              }}
              aria-label="Filter by difficulty"
              className="h-11"
            >
              <option value="all">All difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Select>
            <Select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
              aria-label="Sort questions"
              className="h-11"
            >
              <option value="newest">Newest</option>
              <option value="az">A–Z</option>
              <option value="difficulty">Difficulty</option>
            </Select>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/80 shadow-sm">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <LoadingSpinner size="lg" label="Loading questions…" />
              </div>
            ) : filteredQuestions.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="No questions yet"
                description="Create your first question to start running analyses."
                className="border-0"
                action={<Button onClick={openCreateDialog}>New question</Button>}
              />
            ) : (
              <Table>
                <TableHeader className="bg-muted/45">
                  <TableRow>
                    <TableHead className="min-w-[320px] py-3.5">Question</TableHead>
                    <TableHead className="min-w-[150px] py-3.5">Subject</TableHead>
                    <TableHead className="min-w-[125px] py-3.5">Difficulty</TableHead>
                    <TableHead className="min-w-[120px] py-3.5">Concepts</TableHead>
                    <TableHead className="min-w-[110px] py-3.5 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedQuestions.map((question) => (
                    <TableRow key={question.id} className="group">
                      <TableCell className="max-w-[440px] py-4 font-medium leading-6">
                        <button
                          type="button"
                          className="line-clamp-2 rounded-sm text-left transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          title={question.text}
                          onClick={() => setPreviewQuestion(question)}
                        >
                          {question.text}
                        </button>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {question.subject ?? '—'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            DIFFICULTY_VARIANT[question.difficulty ?? 'medium']
                          }
                          className={question.difficulty === 'hard'
                            ? 'rounded-full border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-800 capitalize hover:bg-rose-100 dark:border-rose-900/70 dark:bg-rose-950/35 dark:text-rose-200 dark:hover:bg-rose-950/55'
                            : question.difficulty === 'easy'
                              ? 'rounded-full border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 capitalize hover:bg-emerald-100 dark:border-emerald-900/70 dark:bg-emerald-950/35 dark:text-emerald-200 dark:hover:bg-emerald-950/55'
                              : 'rounded-full border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900 capitalize hover:bg-amber-100 dark:border-amber-900/70 dark:bg-amber-950/35 dark:text-amber-200 dark:hover:bg-amber-950/55'}
                        >
                          {question.difficulty ?? 'medium'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {question.concepts.length} concept
                        {question.concepts.length === 1 ? '' : 's'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Edit question: ${question.text}`}
                            title="Edit question"
                            className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground"
                            onClick={() => openEditDialog(question)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Delete question: ${question.text}`}
                            title="Delete question"
                            className="h-9 w-9 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => setDeletingQuestion(question)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {!isLoading && filteredQuestions.length > 0 && (
          <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground">
              {filteredQuestions.length} question
              {filteredQuestions.length === 1 ? '' : 's'} · page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingQuestion ? 'Edit question' : 'New question'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={control} name="text" label="Question">
              {(field) => (
                <Textarea
                  name={field.name}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  value={(field.value as string) ?? ''}
                  placeholder="What causes the seasons on Earth?"
                />
              )}
            </FormField>

            <FormField
              control={control}
              name="referenceAnswer"
              label="Reference answer (optional) — used only for baseline comparison"
            >
              {(field) => (
                <Textarea
                  name={field.name}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  value={(field.value as string) ?? ''}
                  placeholder="The tilt of Earth's axis…"
                />
              )}
            </FormField>

            <FormField
              control={control}
              name="concepts"
              label="Key concepts"
              description="Comma separated list of concepts to check coverage for."
            >
              {(field) => (
                <Input
                  name={field.name}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  value={(field.value as string) ?? ''}
                  placeholder="axial tilt, orbit, solar angle"
                />
              )}
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={control} name="subject" label="Subject">
                {(field) => (
                  <Input
                    name={field.name}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    value={(field.value as string) ?? ''}
                    placeholder="Earth science"
                  />
                )}
              </FormField>

              <FormField control={control} name="difficulty" label="Difficulty">
                {(field) => (
                  <Select
                    name={field.name}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    value={(field.value as string) ?? 'medium'}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </Select>
                )}
              </FormField>
            </div>

            {(errors.text || errors.concepts) && (
              <Alert variant="destructive">
                <AlertDescription>
                  Please fix the highlighted fields above.
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="animate-spin" />}
                {editingQuestion ? 'Save changes' : 'Create question'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(previewQuestion)}
        onOpenChange={(open) => !open && setPreviewQuestion(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Question</DialogTitle>
            <DialogDescription>
              {previewQuestion?.subject ?? 'Bank question'} ·{' '}
              {previewQuestion?.difficulty ?? 'medium'}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm">{previewQuestion?.text}</p>
          {previewQuestion?.concepts.length ? (
            <p className="text-xs text-muted-foreground">
              Concepts: {previewQuestion.concepts.join(', ')}
            </p>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewQuestion(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(deletingQuestion)}
        onOpenChange={(open) => !open && setDeletingQuestion(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete this question?</DialogTitle>
            <DialogDescription>
              This permanently removes the question from the bank. Analyses
              already saved are not deleted.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            &ldquo;{deletingQuestion?.text}&rdquo;
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingQuestion(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting && <Loader2 className="animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
