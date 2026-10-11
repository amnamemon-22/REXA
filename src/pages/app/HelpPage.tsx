import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  ChevronDown,
  CircleHelp,
  FileSpreadsheet,
  LifeBuoy,
  Search,
  SearchX,
  Tags,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import { useAuth } from '@/hooks'
import { isTeacherRole } from '@/lib/roles'
import { ROUTES } from '@/routes/paths'
import { REPORT_BANNER_SURFACE } from '@/lib/report-theme'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface HelpFaq {
  question: string
  answer: string
}

interface HelpCategory {
  title: string
  icon: LucideIcon
  faqs: HelpFaq[]
}

export function HelpPage() {
  const { user } = useAuth()
  const teacher = isTeacherRole(user?.role)
  const [searchText, setSearchText] = useState('')
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = useMemo<HelpCategory[]>(() => {
    const common: HelpCategory[] = [
      {
        title: 'Getting Started',
        icon: CircleHelp,
        faqs: [
          {
            question: 'How do I sign in?',
            answer: 'Use the email address registered to your account and select the role that matches it. If access is denied, check the selected role and ask your instructor or project administrator to confirm your account access.',
          },
          {
            question: 'What does REXA analyze?',
            answer: 'REXA analyzes descriptive answers and presents the reasoning details returned by its analysis service, such as sentence roles, concept coverage, reasoning depth, and supporting relationships when available.',
          },
        ],
      },
      {
        title: 'Questions & Analysis',
        icon: BookOpen,
        faqs: teacher
          ? [
              {
                question: 'How do I manage questions?',
                answer: 'Open Questions to review the question bank. Check each prompt, reference answer, and listed concepts before using it for analysis.',
              },
              {
                question: 'What should I check if analysis fails?',
                answer: 'Read the error shown by the page, confirm the correct question is selected, and retry when the backend service is available. A result is shown only after the service returns it.',
              },
            ]
          : [
              {
                question: 'How do I submit an answer?',
                answer: 'Choose a practice question, enter your answer in the Reasoning Console, and submit it. Wait for the analysis service to return feedback before leaving the page.',
              },
              {
                question: 'Why is some feedback unavailable?',
                answer: 'The interface shows analysis details only when they are included in the response. An unavailable detail is not a zero score.',
              },
              {
                question: 'Where can I reopen an earlier result?',
                answer: 'Open History to find saved submissions and return to their available reasoning feedback.',
              },
            ],
      },
      {
        title: 'Account & Password',
        icon: UserRound,
        faqs: [
          {
            question: 'I forgot my password. Can REXA email me a reset link?',
            answer: 'No. A secure password-reset service is not configured, so REXA cannot send a reset email or change your password. Contact your instructor or project administrator through an institution-approved channel.',
          },
          {
            question: 'Can I edit my profile details?',
            answer: 'Profile details are currently displayed in Settings but cannot be edited from the frontend. Ask your project administrator through an approved channel if an account detail needs correction.',
          },
        ],
      },
    ]

    if (!teacher) return common

    return [
      common[0],
      common[1],
      {
        title: 'Class Excel & Reports',
        icon: FileSpreadsheet,
        faqs: [
          {
            question: 'Which files can I upload?',
            answer: 'Use a supported CSV or Excel export from your online test. If parsing fails, check that the file is valid and saved in a supported format.',
          },
          {
            question: 'How do I map spreadsheet columns?',
            answer: 'Map the student name, student ID, question, and student answer fields to the columns in your file. Check the preview and confirm the expected answers are ready before starting analysis.',
          },
          {
            question: 'Why are fewer answers ready than expected?',
            answer: 'Review the mapped answer column and preview for blank or incorrectly mapped values. Confirm that each row contains an answer before starting analysis.',
          },
          {
            question: 'Where do I view results and export reports?',
            answer: 'After class analysis completes, review the available results and student reasoning in the class workflow. Use the report page’s available export actions; a download is complete only when the file download actually begins.',
          },
        ],
      },
      {
        title: 'Annotation Lab',
        icon: Tags,
        faqs: [
          {
            question: 'Why are submissions reviewed?',
            answer: 'The Annotation Lab lets authorized reviewers check REXA’s predicted sentence roles and concept coverage and save annotation records through the existing annotations service.',
          },
          {
            question: 'Should I change every predicted label?',
            answer: 'No. Read each sentence and keep the prediction when it fits. Change it only when the answer provides evidence for a different label.',
          },
          {
            question: 'Does saving an annotation train the model?',
            answer: 'The frontend saves an annotation record. It does not start model training or claim that the model has been updated.',
          },
        ],
      },
      common[2],
    ]
  }, [teacher])

  const matchingFaqs = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    return categories.flatMap((category) => {
      if (selectedCategory && category.title !== selectedCategory) return []
      const faqs = category.faqs.filter((faq) =>
        !normalizedQuery || `${faq.question} ${faq.answer}`.toLocaleLowerCase().includes(normalizedQuery),
      )
      return faqs.map((faq) => ({ ...faq, category: category.title }))
    })
  }, [categories, query, selectedCategory])

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setQuery(searchText)
    setSelectedCategory(null)
  }

  const clearFilters = () => {
    setSearchText('')
    setQuery('')
    setSelectedCategory(null)
  }

  const resultCount = matchingFaqs.length

  return (
    <main className="mx-auto max-w-6xl space-y-9 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <section className={`relative overflow-hidden rounded-2xl border border-emerald-100/15 ${REPORT_BANNER_SURFACE} px-5 py-10 text-center text-white shadow-sm sm:px-8 sm:py-14`}>
        <div aria-hidden="true" className="pointer-events-none absolute -right-14 -top-20 h-64 w-64 rounded-full border border-emerald-100/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-10 h-72 w-72 rounded-full border border-emerald-100/10" />
        <div className="relative mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">REXA Help Center</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Hello, how can we help?</h1>
          <p className="mt-2 text-sm text-emerald-50/85 sm:text-base">Search answers for your {teacher ? 'teaching' : 'learning'} workspace.</p>
          <form onSubmit={handleSearch} className="mx-auto mt-7 flex max-w-2xl rounded-xl bg-background/95 p-1.5 shadow-md dark:bg-background/90">
            <label htmlFor="help-search" className="sr-only">Search help questions and answers</label>
            <Search className="ml-3 h-5 w-5 shrink-0 self-center text-muted-foreground" aria-hidden="true" />
            <Input
              id="help-search"
              type="search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Ask a question or search a topic..."
              className="h-11 border-0 bg-transparent text-foreground shadow-none focus-visible:ring-0"
            />
            <Button type="submit" className="h-11 shrink-0 rounded-lg px-5">Search</Button>
          </form>
          <p className="mt-2 min-h-4 text-xs text-emerald-100/75" aria-live="polite">
            {query ? `${resultCount} ${resultCount === 1 ? 'answer' : 'answers'} found` : 'Search FAQ titles and answers'}
          </p>
        </div>
      </section>

      <section aria-labelledby="help-categories-heading">
        <div className="mb-4 text-center">
          <h2 id="help-categories-heading" className="text-lg font-semibold text-foreground">Browse by category</h2>
          <p className="mt-1 text-sm text-muted-foreground">Choose a topic to find relevant answers</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => {
            const Icon = category.icon
            const selected = selectedCategory === category.title
            return (
              <button
                key={category.title}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setSelectedCategory(selected ? null : category.title)
                  setQuery('')
                  setSearchText('')
                }}
                className={`group flex min-h-28 flex-col items-center justify-center gap-3 rounded-xl border bg-card px-3 py-4 text-center shadow-sm transition-colors hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${selected ? 'border-primary bg-primary/5 text-primary' : 'border-border text-foreground'}`}
              >
                <Icon className={`h-5 w-5 ${selected ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} aria-hidden="true" />
                <span className="text-sm font-medium">{category.title}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section aria-labelledby="help-faq-heading" className="mx-auto max-w-4xl">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Help articles</p>
            <h2 id="help-faq-heading" className="mt-1 text-xl font-semibold text-foreground">
              {selectedCategory ?? 'Frequently Asked Questions'}
            </h2>
          </div>
          {(query || selectedCategory) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>View all topics</Button>
          )}
        </div>

        {matchingFaqs.length > 0 ? (
          <Card className="overflow-hidden">
            <div className="divide-y divide-border">
              {matchingFaqs.map((faq) => (
                <details key={`${faq.category}-${faq.question}`} className="group px-4 py-1 sm:px-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-base [&::-webkit-details-marker]:hidden">
                    <span>
                      {faq.question}
                      {query && <span className="ml-2 align-middle text-xs font-normal text-muted-foreground">{faq.category}</span>}
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="max-w-3xl pb-4 pr-8 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center py-12 text-center">
              <SearchX className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold">No answers found</h3>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">Try another search phrase or browse a different help category.</p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>Clear search</Button>
            </CardContent>
          </Card>
        )}
      </section>

      <Card className="mx-auto max-w-4xl border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><LifeBuoy className="h-5 w-5" aria-hidden="true" /></span>
            <div>
              <h2 className="font-semibold text-foreground">Contact Support</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">REXA has no configured support email or in-app support endpoint. Contact your instructor or project administrator through an institution-approved channel. Do not send passwords or access tokens.</p>
            </div>
          </div>
          <Button asChild variant="outline" className="shrink-0"><Link to={ROUTES.AUTH.FORGOT_PASSWORD}>Password reset help</Link></Button>
        </CardContent>
      </Card>
    </main>
  )
}
