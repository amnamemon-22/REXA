import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Inbox, Loader2, Tags } from 'lucide-react'
import type {
  AnalysisResult,
  Annotation,
  ConceptCoverage,
  SentenceRole,
  SentenceRoleLabel,
} from '@/types'
import { analysisService, annotationsService } from '@/services'
import { EmptyState, HighlightedAnswer, PageHeader, ROLE_LABELS, StarRating } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { formatDate } from '@/utils'
import { Badge } from '@/components/ui/badge'

const ROLE_OPTIONS = Object.keys(ROLE_LABELS) as SentenceRoleLabel[]

export function AnnotationPage() {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([])
  const [annotatedIds, setAnnotatedIds] = useState<Set<string>>(new Set())
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [selectedAnnotationId, setSelectedAnnotationId] = useState('')
  const [selectedId, setSelectedId] = useState<string>('')
  const [isLoadingList, setIsLoadingList] = useState(true)
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false)

  const [sentenceRoles, setSentenceRoles] = useState<SentenceRole[]>([])
  const [conceptCoverage, setConceptCoverage] = useState<ConceptCoverage[]>([])
  const [depthLevel, setDepthLevel] = useState(3)
  const [stars, setStars] = useState(3)
  const [notes, setNotes] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    Promise.allSettled([
      analysisService.listAnalyses({ page: 1, pageSize: 50 }),
      annotationsService.listAnnotations({ page: 1, pageSize: 100 }),
    ])
      .then(([analysisResult, annotationResult]) => {
        if (analysisResult.status === 'fulfilled') {
          setAnalyses(analysisResult.value.data)
        } else {
          setError(analysisResult.reason instanceof Error ? analysisResult.reason.message : 'Failed to load analyses.')
        }
        if (annotationResult.status === 'fulfilled') {
          const saved = annotationResult.value.data ?? []
          setAnnotations(saved)
          setAnnotatedIds(new Set(saved.map((item) => item.analysisId).filter(Boolean)))
        } else {
          setError(annotationResult.reason instanceof Error ? annotationResult.reason.message : 'Failed to load saved annotations.')
        }
      })
      .finally(() => setIsLoadingList(false))
  }, [])

  const selectedAnnotation = annotations.find((item) => item.id === selectedAnnotationId)
  const selectedAnalysis = analyses.find((item) => item.id === selectedId)
    ?? analyses.find((item) => selectedAnnotation?.analysisId && item.submissionId === selectedAnnotation.analysisId)

  const annotationLabel = (annotation: Annotation) => {
    const analysis = analyses.find((item) => annotation.analysisId && item.submissionId === annotation.analysisId)
    const label = analysis
      ? [analysis.questionText, analysis.studentName, analysis.studentId].filter(Boolean).join(' · ')
      : annotation.analysisId || annotation.id
    return `${label} · ${formatDate(annotation.createdAt)}`
  }

  const selectAnalysis = (analysisId: string) => {
    const analysis = analyses.find((item) => item.id === analysisId)
    const savedAnnotation = analysis?.submissionId
      ? annotations.find((item) => item.analysisId === analysis.submissionId)
      : undefined
    if (savedAnnotation) {
      setSelectedAnnotationId(savedAnnotation.id)
      setSelectedId('')
    } else {
      setSelectedAnnotationId('')
      setSelectedId(analysisId)
    }
  }

  useEffect(() => {
    if (!selectedAnnotation) return
    setSentenceRoles(selectedAnnotation.sentenceRoles)
    setConceptCoverage(selectedAnnotation.conceptCoverage)
    setDepthLevel(selectedAnnotation.reasoningDepthLevel)
    setStars(selectedAnnotation.stars)
    setNotes(selectedAnnotation.notes ?? '')
    setError(null)
    setSuccessMessage(null)
  }, [selectedAnnotation])

  useEffect(() => {
    if (!selectedId) return
    setIsLoadingAnalysis(true)
    setError(null)
    setSuccessMessage(null)

    analysisService
      .getAnalysis(selectedId)
      .then((analysis) => {
        setSentenceRoles(analysis.sentenceRoles)
        setConceptCoverage(analysis.conceptCoverage)
        setDepthLevel(analysis.reasoningDepth.level)
        setStars(analysis.stars)
        setNotes('')
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : 'Failed to load analysis.',
        )
      })
      .finally(() => setIsLoadingAnalysis(false))
  }, [selectedId])

  const updateSentenceRole = (index: number, role: SentenceRoleLabel) => {
    setSentenceRoles((prev) =>
      prev.map((sentence) =>
        sentence.index === index ? { ...sentence, role } : sentence,
      ),
    )
  }

  const toggleConcept = (concept: string, covered: boolean) => {
    setConceptCoverage((prev) =>
      prev.map((item) =>
        item.concept === concept ? { ...item, covered } : item,
      ),
    )
  }

  const handleSubmit = async () => {
    if (!selectedId && !selectedAnnotation) return
    if (!Number.isInteger(depthLevel) || depthLevel < 1 || depthLevel > 5) {
      setError('Choose a reasoning depth from 1 to 5 before saving.')
      return
    }
    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const payload = {
        analysisId: selectedId || selectedAnnotation?.analysisId || '',
        sentenceRoles,
        conceptCoverage,
        reasoningDepthLevel: depthLevel,
        stars,
        notes: notes.trim() || undefined,
      }
      if (selectedAnnotation) {
        const updated = await annotationsService.updateAnnotation(selectedAnnotation.id, payload)
        setAnnotations((current) => current.map((item) => item.id === updated.id ? updated : item))
        setSuccessMessage('Annotation changes saved.')
      } else {
        const created = await annotationsService.createAnnotation(payload)
        setAnnotations((current) => [created, ...current])
        setSuccessMessage('Annotation saved successfully.')
        setAnnotatedIds((prev) => new Set(prev).add(created.analysisId))
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save annotation.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedAnnotation || !window.confirm('Delete this saved annotation? This cannot be undone.')) return
    setIsDeleting(true)
    setError(null)
    setSuccessMessage(null)
    try {
      await annotationsService.deleteAnnotation(selectedAnnotation.id)
      setAnnotations((current) => current.filter((item) => item.id !== selectedAnnotation.id))
      setSelectedAnnotationId('')
      setSentenceRoles([])
      setConceptCoverage([])
      setSuccessMessage('Annotation deleted.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete annotation.')
    } finally {
      setIsDeleting(false)
    }
  }

  const pending = useMemo(
    () => analyses.filter((analysis) => !annotatedIds.has(analysis.submissionId ?? analysis.id)),
    [analyses, annotatedIds],
  )

  return (
    <div>
      <PageHeader
        title="Annotation lab"
        description="Review RExA labels, correct sentence roles, and save gold annotations."
      />

      <div className="px-4 pt-4 sm:px-6 lg:px-8">
        <details className="group rounded-xl border bg-card px-4 sm:px-5">
          <summary className="cursor-pointer list-none py-4 text-sm font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
            Why review annotations? What do the labels mean?
          </summary>
          <div className="grid gap-4 border-t py-4 text-sm text-muted-foreground md:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-2">
              <h2 className="font-medium text-foreground">Sentence roles</h2>
              <p>Check REXA’s existing prediction against each sentence. Keep it when it fits; change it only when the answer supports another role.</p>
              <ul className="space-y-1">
                <li><strong className="text-foreground">Claim:</strong> the answer’s main point.</li>
                <li><strong className="text-foreground">Evidence:</strong> a fact, example, or support for a point.</li>
                <li><strong className="text-foreground">Reasoning:</strong> explains how or why support relates to the point.</li>
                <li><strong className="text-foreground">Elaboration:</strong> adds detail or develops an idea.</li>
                <li><strong className="text-foreground">Counterargument:</strong> presents a contrary view.</li>
                <li><strong className="text-foreground">Conclusion:</strong> closes or summarizes the answer.</li>
                <li><strong className="text-foreground">Irrelevant:</strong> does not address the question or reasoning.</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h2 className="font-medium text-foreground">Concept coverage and depth</h2>
              <p>Mark a concept covered only when the answer addresses it. Choose a 1–5 depth level based on the reasoning visible in the answer; this is the reviewer’s annotation.</p>
            </div>
            <div className="space-y-2">
              <h2 className="font-medium text-foreground">Save behavior</h2>
              <p>Save sends the annotation fields to the existing annotation API. A success message appears only after the API responds successfully. Saving records a review; it does not itself retrain the model.</p>
              <p>Optional notes are stored with the annotation. The displayed star label is read-only in this form.</p>
            </div>
          </div>
        </details>
      </div>

      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Pending queue</CardTitle>
            {!isLoadingList && (
              <div className="flex flex-wrap items-center gap-2" aria-label={`${pending.length} pending and ${analyses.length - pending.length} reviewed submissions`}>
                <Badge variant="secondary">{pending.length} pending</Badge>
                <Badge variant="outline">{analyses.length - pending.length} reviewed</Badge>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {annotations.length > 0 && (
              <div className="mb-4 space-y-2">
                <Label htmlFor="saved-annotation">Manage saved annotation</Label>
                <Select id="saved-annotation" value={selectedAnnotationId} onChange={(event) => {
                  setSelectedAnnotationId(event.target.value)
                  if (event.target.value) setSelectedId('')
                }}>
                  <option value="">Create a new annotation</option>
                  {annotations.map((item) => <option key={item.id} value={item.id}>{annotationLabel(item)}</option>)}
                </Select>
              </div>
            )}
            {isLoadingList ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading submissions…
              </div>
            ) : analyses.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title="No submissions in the queue"
                description="Run an analysis first. New results appear here so you can review sentence roles and concept coverage."
                className="border-0"
              />
            ) : (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="submission">Or pick from all analyses</Label>
                  <Select
                    id="submission"
                    value={selectedAnalysis?.id ?? ''}
                    onChange={(event) => selectAnalysis(event.target.value)}
                  >
                    <option value="">Select a submission…</option>
                    {analyses.map((analysis) => (
                      <option key={analysis.id} value={analysis.id}>
                        {annotatedIds.has(analysis.submissionId ?? analysis.id) ? 'Reviewed · ' : 'Pending · '}
                        {analysis.questionText} — {formatDate(analysis.createdAt)}
                      </option>
                    ))}
                  </Select>
                </div>
                {pending.length > 0 ? (
                  <ul className="divide-y rounded-md border">
                    {pending.slice(0, 8).map((analysis) => (
                      <li key={analysis.id}>
                        <button
                          type="button"
                          onClick={() => selectAnalysis(analysis.id)}
                          className={cn(
                            'flex w-full items-start gap-3 p-3 text-left text-sm hover:bg-muted/50',
                            selectedId === analysis.id && 'bg-primary/5',
                          )}
                        >
                          <span className="min-w-0">
                            <span className="line-clamp-2 font-medium">
                              {analysis.questionText}
                            </span>
                            <span className="mt-1 block text-xs text-muted-foreground">
                              {formatDate(analysis.createdAt)}
                              {analysis.studentName
                                ? ` · ${analysis.studentName}`
                                : ''}
                            </span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Queue is clear. Use the dropdown if you want to reopen a
                    reviewed submission.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {successMessage && (
          <Alert variant="success">
            <CheckCircle2 />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {isLoadingAnalysis && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {!isLoadingAnalysis && !selectedId && !selectedAnnotation && analyses.length > 0 && (
          <EmptyState
            icon={Tags}
            title="Select a submission to review"
            description="Open an item from the pending queue. You can then correct sentence roles, mark concepts, and save a gold annotation."
          />
        )}

        {!isLoadingAnalysis && (selectedId || selectedAnnotation) && sentenceRoles.length > 0 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Color-coded preview</CardTitle>
              </CardHeader>
              <CardContent>
                <HighlightedAnswer sentences={sentenceRoles} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sentence roles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sentenceRoles.map((sentence) => (
                  <div
                    key={sentence.index}
                    className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center"
                  >
                    <p className="flex-1 text-sm">{sentence.text}</p>
                    <Select
                      className="sm:w-48"
                      value={sentence.role}
                      onChange={(event) =>
                        updateSentenceRole(
                          sentence.index,
                          event.target.value as SentenceRoleLabel,
                        )
                      }
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <option key={role} value={role}>
                          {ROLE_LABELS[role]}
                        </option>
                      ))}
                    </Select>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Concept coverage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {conceptCoverage.map((concept) => (
                  <label
                    key={concept.concept}
                    className="flex items-center gap-3 rounded-md border p-3 text-sm"
                  >
                    <Checkbox
                      checked={concept.covered}
                      onCheckedChange={(checked) =>
                        toggleConcept(concept.concept, checked)
                      }
                    />
                    {concept.concept}
                  </label>
                ))}
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Reasoning depth</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Label htmlFor="depthLevel">Depth level (1–5)</Label>
                  <Select
                    id="depthLevel"
                    value={String(depthLevel)}
                    onChange={(event) =>
                      setDepthLevel(Number(event.target.value))
                    }
                  >
                    {[1, 2, 3, 4, 5].map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Overall stars</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <StarRating value={stars} size="lg" />
                  <p className="text-sm font-medium">{stars.toFixed(1)} / 5</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedAnnotation
                      ? 'Saved annotation label. This field is read-only here.'
                      : 'Assigned by RExA from this answer. Stars cannot be edited.'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Optional notes for other annotators or reviewers…"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                <Button onClick={handleSubmit} disabled={isSaving || isDeleting}>
                  {isSaving && <Loader2 className="animate-spin" />}
                  {selectedAnnotation ? 'Save changes' : 'Save annotation'}
                </Button>
                {selectedAnnotation && <Button type="button" variant="destructive" onClick={handleDelete} disabled={isSaving || isDeleting}>{isDeleting && <Loader2 className="animate-spin" />}Delete annotation</Button>}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
