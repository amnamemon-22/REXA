import * as React from 'react'
import type { ReactNode } from 'react'

import { ChevronRight, FileText, ListTree } from 'lucide-react'

import type {
  AnalysisResult,
  SentenceRoleLabel,
} from '@/types'

import {
  ImprovementBriefCard,
  StarRating,
} from '@/components/common'

type Props = {
  analysis: AnalysisResult
  isTeacher: boolean
  isStudent: boolean
}

const ROLE_LABELS: Record<SentenceRoleLabel, string> = {
  claim: 'Claim',
  evidence: 'Evidence',
  reasoning: 'Reasoning',
  elaboration: 'Elaboration',
  counterargument: 'Counterargument',
  conclusion: 'Conclusion',
  irrelevant: 'Irrelevant',
}

const ROLE_STYLES: Record<
  SentenceRoleLabel,
  {
    dot: string
    bg: string
    text: string
    border: string
    bar: string
  }
> = {
  claim: {
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
    bar: 'bg-emerald-500',
  },
  evidence: {
    dot: 'bg-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    bar: 'bg-blue-500',
  },
  reasoning: {
    dot: 'bg-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    text: 'text-violet-700 dark:text-violet-300',
    border: 'border-violet-200 dark:border-violet-800',
    bar: 'bg-violet-500',
  },
  elaboration: {
    dot: 'bg-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
    bar: 'bg-amber-500',
  },
  counterargument: {
    dot: 'bg-red-500',
    bg: 'bg-red-50 dark:bg-red-950/30',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-200 dark:border-red-800',
    bar: 'bg-red-500',
  },
 conclusion: {
  dot: 'bg-pink-500',
  bg: 'bg-pink-50 dark:bg-pink-950/30',
  text: 'text-pink-600 dark:text-pink-400',
  border: 'border-pink-200 dark:border-pink-800',
  bar: 'bg-pink-500',
},
  irrelevant: {
    dot: 'bg-slate-400',
    bg: 'bg-slate-50 dark:bg-slate-900/40',
    text: 'text-slate-600 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700',
    bar: 'bg-slate-400',
  },
}

function SectionTitle({
  icon,
  children,
}: {
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      {icon}

      <h3 className="text-sm font-semibold">
        {children}
      </h3>
    </div>
  )
}

function withoutStarMentions(explanations: AnalysisResult['explanations']) {
  return explanations.filter(
    (item) => !/\b(stars?|overall rating)\b/i.test(item.message),
  )
}

function getCoverage(analysis: AnalysisResult) {
  const total = analysis.conceptCoverage.length

  if (total === 0) {
    return {
      covered: 0,
      total: 0,
      percentage: null as number | null,
    }
  }

  const covered = analysis.conceptCoverage.filter(
    (item) => item.covered,
  ).length

  return {
    covered,
    total,
    percentage: Math.round((covered / total) * 100),
  }
}

function getRoleCounts(analysis: AnalysisResult) {
  const counts = new Map<SentenceRoleLabel, number>()

  analysis.sentenceRoles.forEach((sentence) => {
    counts.set(
      sentence.role,
      (counts.get(sentence.role) ?? 0) + 1,
    )
  })

  return counts
}

function getSupportStats(analysis: AnalysisResult) {
  let support = 0
  let contradiction = 0
  let neutral = 0

  analysis.supportPairs.forEach((pair) => {
    if (pair.relation === 'support') support += 1
    if (pair.relation === 'contradiction') contradiction += 1
    if (pair.relation === 'neutral') neutral += 1
  })

  return {
    support,
    contradiction,
    neutral,
    total: analysis.supportPairs.length,
  }
}

function Summary({
  analysis,
  isStudent,
}: {
  analysis: AnalysisResult
  isTeacher: boolean
  isStudent: boolean
}) {
  const coverage = getCoverage(analysis)
  const support = getSupportStats(analysis)
  const roleCounts = getRoleCounts(analysis)

  const roleEntries = Array.from(roleCounts.entries()).sort(
    (a, b) => b[1] - a[1],
  )

  const TOTAL_ROLE_TYPES = 7
  const rolesPresent = roleEntries.length

  const rolePresencePercentage =
    TOTAL_ROLE_TYPES > 0
      ? Math.round((rolesPresent / TOTAL_ROLE_TYPES) * 100)
      : 0

  const depthLevel = Math.max(
    1,
    Math.min(5, analysis.reasoningDepth.level),
  )

  const visualDepth =
    depthLevel <= 2 ? 1 : depthLevel === 3 ? 2 : 3

  const depthType =
    depthLevel <= 2
      ? 'shallow'
      : depthLevel === 3
        ? 'moderate'
        : 'deep'

  const depthColor =
    depthType === 'shallow'
      ? 'bg-amber-500'
      : depthType === 'moderate'
        ? 'bg-orange-500'
        : 'bg-emerald-500'
  return (
    <section className="rounded-xl border bg-card p-5 shadow-sm">
      {/* HEADER */}
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_270px]">
        <div className="min-w-0 pt-1">
          <h2 className="text-lg font-semibold tracking-tight">
            2. Analysis Result
          </h2>

          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-muted-foreground">
            {analysis.questionText}
          </p>
        </div>

        {isStudent ? (
          <div className="rounded-2xl border bg-card p-4">
            <p className="text-sm font-semibold">Reasoning depth</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">
              {analysis.reasoningDepth.level}/5
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {analysis.reasoningDepth.label}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border bg-card p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">Star Prediction</p>

                <div className="mt-2">
                  <StarRating value={analysis.stars} size="sm" />
                </div>
              </div>

              <div className="text-right">
                <p className="text-3xl font-bold tracking-tight">
                  {analysis.stars.toFixed(1)}
                </p>

                <p className="text-xs text-muted-foreground">/ 5</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DASHBOARD CARDS */}
      <div className="mt-5 grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-4">

        {/* =====================================================
            CONCEPT COVERAGE
        ===================================================== */}
        <div className="min-w-0 rounded-2xl border bg-card p-5">
          <p className="text-sm font-semibold">
            Concept Coverage
          </p>

          {coverage.percentage === null ? (
            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground">
                No concepts returned
              </p>
            </div>
          ) : (
            <div className="mt-8 flex items-center justify-center gap-5">
              <div
  className="relative h-28 w-28 shrink-0 rounded-full [--coverage-track:#edf2ee] dark:[--coverage-track:#1d3a32]"
  style={{
    background: `conic-gradient(#8b5cf6 ${coverage.percentage}%, var(--coverage-track) ${coverage.percentage}% 100%)`,
  }}
>
                <div className="absolute inset-[10px] flex items-center justify-center rounded-full bg-card">
                  <span className="text-xl font-bold">
                    {coverage.percentage}%
                  </span>
                </div>
              </div>

              <div className="min-w-0">
                <p className="text-xl font-semibold">
                  {coverage.covered} / {coverage.total}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  concepts
                  <br />
                  covered
                </p>
              </div>
            </div>
          )}
        </div>

{/* =====================================================
    REASONING DEPTH
===================================================== */}
<div className="min-w-0 rounded-2xl border bg-card p-5">
  <p className="text-sm font-semibold">
    Reasoning Depth
  </p>

  <div className="mt-8 flex items-center justify-center">
    {/* DEPTH GRAPH */}
    <div className="flex h-32 w-32 items-end justify-center gap-2 rounded-full bg-amber-50 dark:bg-amber-950/30 px-6 pb-7">
      {[1, 2, 3].map((bar) => {
        const active = bar <= visualDepth

        return (
          <span
            key={bar}
            className={`w-4 rounded-t-md ${
              active
  ? depthColor
  : 'bg-slate-200 dark:bg-slate-700'
            }`}
            style={{
              height:
                bar === 1
                  ? '30px'
                  : bar === 2
                    ? '52px'
                    : '74px',
            }}
          />
        )
      })}
    </div>
  </div>

  {/* DEPTH LEVEL */}
  <div className="mt-6 text-center">
    <p className="text-lg font-semibold">
      Level {depthLevel}/5
    </p>

    <div className="mt-3 grid grid-cols-3 text-xs">
      <span
        className={
          depthType === 'shallow'
  ? 'font-semibold text-amber-600 dark:text-amber-300'
  : 'text-muted-foreground'
        }
      >
        Shallow
      </span>

      <span
        className={
          depthType === 'moderate'
  ? 'font-semibold text-orange-600 dark:text-orange-300'
  : 'text-muted-foreground'
        }
      >
        Moderate
      </span>

      <span
        className={
          depthType === 'deep'
  ? 'font-semibold text-emerald-600 dark:text-emerald-300'
  : 'text-muted-foreground'
        }
      >
        Deep
      </span>
    </div>
  </div>
</div>

{/* =====================================================
    SUPPORT & CONTRADICTION
===================================================== */}
<div className="min-w-0 rounded-2xl border bg-card p-5">
  <p className="text-sm font-semibold">
    Support &amp; Contradiction
  </p>

  {support.total === 0 ? (
    <div className="mt-12 text-center">
      <p className="text-sm text-muted-foreground">
        No relationships returned
      </p>
    </div>
  ) : (
    <>
      {/* RELATIONSHIP GRAPH */}
      <div className="mt-9">
        <div className="flex h-5 overflow-hidden rounded-full bg-muted">
          {support.support > 0 && (
            <div
              className="bg-blue-500"
              style={{
                width: `${
                  (support.support / support.total) * 100
                }%`,
              }}
            />
          )}

          {support.contradiction > 0 && (
            <div
              className="bg-red-500"
              style={{
                width: `${
                  (support.contradiction /
                    support.total) *
                  100
                }%`,
              }}
            />
          )}

          {support.neutral > 0 && (
            <div
              className="bg-slate-300 dark:bg-slate-600"
              style={{
                width: `${
                  (support.neutral / support.total) * 100
                }%`,
              }}
            />
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-2xl font-bold">
          {support.total}
        </p>

        <p className="text-xs text-muted-foreground">
          relationships
        </p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2">
        <div className="min-w-0 rounded-xl bg-blue-50 dark:bg-blue-950/40 px-1.5 py-2.5 text-center">
          <span className="mx-auto block h-2.5 w-2.5 rounded-full bg-blue-500" />
          <p className="mt-1 text-[9px] text-muted-foreground">
            Support
          </p>
          <p className="text-sm font-semibold">
            {support.support}
          </p>
        </div>

        <div className="min-w-0 rounded-xl bg-red-50 dark:bg-red-950/40 px-1.5 py-2.5 text-center">
          <span className="mx-auto block h-2.5 w-2.5 rounded-full bg-red-500" />
          <p className="mt-1 text-[9px] text-muted-foreground">
            Contradiction
          </p>
          <p className="text-sm font-semibold">
            {support.contradiction}
          </p>
        </div>

        <div className="min-w-0 rounded-xl bg-slate-50 dark:bg-slate-900/60 px-1.5 py-2.5 text-center">
          <span className="mx-auto block h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-500" />
          <p className="mt-1 text-[9px] text-muted-foreground">
            Neutral
          </p>
          <p className="text-sm font-semibold">
            {support.neutral}
          </p>
        </div>
      </div>
    </>
  )}
</div>

{/* =====================================================
    ROLE STRUCTURE
===================================================== */}
<div className="min-w-0 rounded-2xl border bg-card p-5">
  <div className="flex items-start justify-between gap-3">
    <div>
      <p className="text-sm font-semibold">
        Role Structure
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        Roles detected
      </p>
    </div>

    <div className="text-right">
      <p className="text-2xl font-bold">
        {rolesPresent} / {TOTAL_ROLE_TYPES}
      </p>

      <p className="text-[10px] text-muted-foreground">
        role types
      </p>
    </div>
  </div>

  {rolesPresent > 0 && (
    <div className="mt-8 flex flex-col items-center">
      {/* ROLE DONUT */}
      <div
  className="relative h-28 w-28 rounded-full [--role-track:#edf2ee] dark:[--role-track:#1d3a32]"
  style={{
    background: `conic-gradient(#10b981 ${rolePresencePercentage}%, var(--role-track) ${rolePresencePercentage}% 100%)`,
  }}
>
        <div className="absolute inset-[10px] flex flex-col items-center justify-center rounded-full bg-card">
          <span className="text-2xl font-bold">
            {rolesPresent}
          </span>

          <span className="text-[10px] text-muted-foreground">
            present
          </span>
        </div>
      </div>

      {/* ROLES */}
      <div className="mt-6 flex w-full flex-wrap justify-center gap-2">
        {roleEntries.map(([role, count]) => (
          <span
            key={role}
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${ROLE_STYLES[role].bg} ${ROLE_STYLES[role].text}`}
          >
            <span
              className={`h-2 w-2 rounded-full ${ROLE_STYLES[role].dot}`}
            />

            {ROLE_LABELS[role]}

            <span className="font-bold">
              {count}
            </span>
          </span>
        ))}
      </div>
    </div>
  )}
</div>
    </div>
    </section>
  )
}

function SentenceRoles({
  analysis,
}: {
  analysis: AnalysisResult
}) {
  return (
    <section className="rounded-xl border bg-card p-4 shadow-sm">
      <SectionTitle icon={<FileText className="h-4 w-4" />}>
        3. Sentence Roles
      </SectionTitle>

      {/* ROLE LEGEND */}
      <div className="mb-4 flex flex-wrap gap-x-3 gap-y-1.5">
        {Object.entries(ROLE_LABELS).map(([role, label]) => {
          const key = role as SentenceRoleLabel

          return (
            <span
              key={role}
              className="flex items-center gap-1 text-[10px] text-muted-foreground"
            >
              <span
                className={`h-2 w-2 rounded-full ${ROLE_STYLES[key].dot}`}
              />
              {label}
            </span>
          )
        })}
      </div>

      {/* SENTENCE ROLE GRID */}
      <div className="grid items-stretch gap-3 md:grid-cols-2 xl:grid-cols-3">
        {analysis.sentenceRoles.map((sentence) => {
          const style = ROLE_STYLES[sentence.role]

          return (
            <div
  key={sentence.index}
  className="flex min-w-0 items-stretch gap-2"
>
              {/* NUMBER */}
              <span
                className={`
                  mt-1 grid h-8 w-8 shrink-0 place-items-center
                  rounded-full text-xs font-semibold text-white
                  ${style.dot}
                `}
              >
                {sentence.index + 1}
              </span>

              {/* SENTENCE CARD */}
              <div
                className={`
  flex min-h-[150px] min-w-0 flex-1 flex-col
  rounded-xl border p-3
  ${style.bg} ${style.border}
`}
              >
                {/* ROLE + CONFIDENCE */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`
                      rounded-md border px-2 py-0.5
                      text-[10px] font-semibold
                      ${style.text} ${style.border}
                    `}
                  >
                    {ROLE_LABELS[sentence.role]}
                  </span>

                  {sentence.confidence !== undefined && (
                    <span className="text-[10px] text-muted-foreground">
                      {Math.round(sentence.confidence * 100)}% confidence
                    </span>
                  )}
                </div>

                {/* ACTUAL BACKEND SENTENCE */}
                <p className="mt-2 text-xs leading-relaxed">
                  {sentence.text}
                </p>

                {/* ACTUAL BACKEND REASON */}
                {sentence.reason && (
  <p className="mt-auto pt-3 text-[10px] leading-relaxed text-muted-foreground">
    {sentence.reason}
  </p>
)}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
function RoleStructure({ analysis }: { analysis: AnalysisResult }) {
  const roles = analysis.sentenceRoles

  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm">
      {/* =====================================================
          SECTION HEADER
      ===================================================== */}
      <div className="mb-2 flex items-center gap-2">
        <ListTree className="h-5 w-5 text-foreground" />

        <h3 className="text-base font-semibold">
          4. Role Structure
        </h3>
      </div>

      <p className="mb-5 text-xs leading-5 text-muted-foreground">
        Sentence roles in the order detected by REXA.
      </p>

      {/* =====================================================
          ROLE SEQUENCE

          Horizontal sequence using ONLY backend sentence roles.
          No logical relationship is invented.
      ===================================================== */}
      {roles.length === 0 ? (
        <div className="rounded-xl border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No sentence roles returned.
          </p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto pb-2">
          <div className="flex min-w-max items-center gap-3">
            {roles.map((sentence, index) => {
              const style =
                ROLE_STYLES[sentence.role] ?? ROLE_STYLES.irrelevant

              return (
                <React.Fragment key={sentence.index}>
                  {/* Role node */}
                  <div
                    className={`
                      flex h-[72px] w-[210px] shrink-0
                      items-center gap-3
                      rounded-2xl border
                      px-4
                      ${style.bg}
                      ${style.border}
                    `}
                  >
                    {/* Position number */}
                    <span
                      className={`
                        grid h-9 w-9 shrink-0 place-items-center
                        rounded-full
                        text-xs font-semibold text-white
                        ${style.dot}
                      `}
                    >
                      {index + 1}
                    </span>

                    {/* Role information */}
                    <div className="min-w-0">
                      <p
                        className={`
                          truncate text-sm font-semibold
                          ${style.text}
                        `}
                      >
                        {ROLE_LABELS[sentence.role]}
                      </p>

                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        Sentence {sentence.index + 1}
                      </p>
                    </div>
                  </div>

                  {/* Horizontal flow arrow */}
                  {index < roles.length - 1 && (
                    <ChevronRight
                      className="h-5 w-5 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>
      )}

      {/* =====================================================
          EXPLANATORY NOTE

          Important: the sequence does NOT prove a valid
          reasoning chain.
      ===================================================== */}
      {roles.length > 0 && (
        <div className="mt-5 rounded-xl border bg-muted/30 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Role sequence
          </p>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            The sequence shows how REXA classified each sentence.
            It does not by itself indicate that the answer contains
            a logically valid reasoning chain.
          </p>
        </div>
      )}
    </section>
  )
}

export function ConceptCoverage({
  analysis,
}: {
  analysis: AnalysisResult
}) {
  const concepts = analysis.conceptCoverage

  const coveredCount = concepts.filter(
    (item) => item.covered,
  ).length

  return (
    <section className="min-w-0 rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <SectionTitle icon={<FileText className="h-4 w-4" />}>
          5. Concept Coverage
        </SectionTitle>

        {concepts.length > 0 && (
          <span className="shrink-0 text-[11px] text-muted-foreground">
            <span className="font-semibold text-foreground">
              {coveredCount} / {concepts.length}
            </span>{' '}
            covered
          </span>
        )}
      </div>

      {concepts.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No concept coverage data returned.
        </p>
      ) : (
        <div className="mt-4 space-y-2.5">
          {concepts.map((item) => {
            const confidence =
              item.confidence !== undefined
                ? Math.round(item.confidence * 100)
                : item.covered
                  ? 100
                  : 0

            return (
              <div
                key={item.concept}
                className="rounded-lg border bg-background/40 px-2.5 py-2"
              >
                <div className="flex items-center gap-2">
                  {/* Status icon */}
                  <span
                    className={`
                      grid h-5 w-5 shrink-0 place-items-center
                      rounded-full text-[10px] font-bold
                      ${
                        item.covered
                          ? 'bg-emerald-500 text-white'
                          : 'bg-amber-500 text-white'
                      }
                    `}
                  >
                    {item.covered ? '✓' : '!'}
                  </span>

                  {/* Concept */}
                  <span className="min-w-0 flex-1 truncate text-[11px] font-medium">
                    {item.concept}
                  </span>

                  {/* Confidence */}
                  {item.confidence !== undefined && (
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {item.confidence.toFixed(2)}
                    </span>
                  )}

                  {/* Status */}
                  <span
                    className={`
                      shrink-0 rounded-full px-2 py-0.5
                      text-[9px] font-medium
                      ${
                        item.covered
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                      }
                    `}
                  >
                    {item.covered ? 'Covered' : 'Missing'}
                  </span>
                </div>

                {/* Confidence bar */}
                <div className="ml-7 mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${
                      item.covered
                        ? 'bg-emerald-500'
                        : 'bg-amber-500'
                    }`}
                    style={{
                      width: `${confidence}%`,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export function SupportAndContradiction({
  analysis,
  showAll = false,
  showReferenceText = true,
}: {
  analysis: AnalysisResult
  showAll?: boolean
  showReferenceText?: boolean
}) {
  const pairs = analysis.supportPairs

  const [expandedPair, setExpandedPair] = React.useState<number | null>(
    null,
  )

  const supportCount = pairs.filter(
    (pair) => pair.relation === 'support',
  ).length

  const contradictionCount = pairs.filter(
    (pair) => pair.relation === 'contradiction',
  ).length

  const neutralCount = pairs.filter(
    (pair) => pair.relation === 'neutral',
  ).length

  const visiblePairs = showAll ? pairs : pairs.slice(0, 4)

  return (
    <section className="min-w-0 rounded-xl border bg-card p-4 shadow-sm">
      <SectionTitle icon={<FileText className="h-4 w-4" />}>
        6. Support &amp; Contradiction
      </SectionTitle>

      <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
        Relationships between your statements and the reference answer.
      </p>

      {pairs.length === 0 ? (
        <div className="mt-5 rounded-lg border border-dashed p-5 text-center">
          <p className="text-xs text-muted-foreground">
            No relationships returned.
          </p>
        </div>
      ) : (
        <>
          {/* Relationship rows */}
          <div className="mt-3 space-y-1.5">
            {visiblePairs.map((pair) => {
              const isExpanded =
                expandedPair === pair.studentSentenceIndex

              const isSupport = pair.relation === 'support'

              const isContradiction =
                pair.relation === 'contradiction'

              const badgeClass = isSupport
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                : isContradiction
                  ? 'bg-red-500/10 text-red-700 dark:text-red-400'
                  : 'bg-slate-500/10 text-slate-700 dark:text-slate-300'

              const dotClass = isSupport
                ? 'bg-emerald-500'
                : isContradiction
                  ? 'bg-red-500'
                  : 'bg-slate-400'

              const label = isSupport
                ? 'SUPPORT'
                : isContradiction
                  ? 'CONTRADICTION'
                  : 'NEUTRAL'

              return (
                <div
                  key={`${pair.studentSentenceIndex}-${pair.referenceSentenceIndex}`}
                  className="overflow-hidden rounded-lg border bg-background/40"
                >
                  {/* Compact row */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedPair(
                        isExpanded
                          ? null
                          : pair.studentSentenceIndex,
                      )
                    }
                    className="flex w-full min-w-0 items-center gap-2 px-2 py-1.5 text-left transition-colors hover:bg-muted/40"
                    aria-expanded={isExpanded}
                  >
                    {/* Sentence number */}
                    <span
                      className={`
                        grid h-7 w-7 shrink-0 place-items-center
                        rounded-lg text-[9px] font-semibold text-white
                        ${dotClass}
                      `}
                    >
                      S{pair.studentSentenceIndex + 1}
                    </span>

                    {/* Student sentence preview */}
                    <span className="min-w-0 flex-1 truncate text-[10px]">
                      {pair.studentText}
                    </span>

                    {/* Relation */}
                    <span
                      className={`
                        shrink-0 rounded-md px-2 py-1
                        text-[8px] font-semibold
                        ${badgeClass}
                      `}
                    >
                      {label}
                    </span>

                    {/* Confidence */}
                    {pair.confidence !== undefined && (
                      <span className="w-7 shrink-0 text-right text-[9px] tabular-nums text-muted-foreground">
                        {pair.confidence.toFixed(2)}
                      </span>
                    )}

                    <ChevronRight
                      className={`
                        h-3.5 w-3.5 shrink-0
                        text-muted-foreground
                        transition-transform
                        ${isExpanded ? 'rotate-90' : ''}
                      `}
                    />
                  </button>

                  {/* Expanded full information */}
                  {isExpanded && (
                    <div className="border-t px-3 py-3">
                      <div className="space-y-3">
                        {/* Student statement */}
                        <div>
                          <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Student statement
                          </p>

                          <p className="mt-1 text-[10px] leading-4 text-foreground">
                            {pair.studentText}
                          </p>
                        </div>

                        {showReferenceText && (
                          <div>
                            <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                              Reference statement
                            </p>

                            <p className="mt-1 text-[10px] leading-4 text-foreground">
                              {pair.referenceText}
                            </p>
                          </div>
                        )}

                        {/* Relationship information */}
                        <div className="flex items-center justify-between border-t pt-2">
                          <span
                            className={`
                              rounded-md px-2 py-1
                              text-[8px] font-semibold
                              ${badgeClass}
                            `}
                          >
                            {label}
                          </span>

                          {pair.confidence !== undefined && (
                            <span className="text-[9px] text-muted-foreground">
                              Confidence: {pair.confidence.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            <div className="rounded-lg bg-emerald-500/10 px-2 py-1.5 text-center">
              <p className="text-[9px] text-muted-foreground">
                Support
              </p>

              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                {supportCount}
              </p>
            </div>

            <div className="rounded-lg bg-red-500/10 px-2 py-1.5 text-center">
              <p className="text-[9px] text-muted-foreground">
                Contradiction
              </p>

              <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                {contradictionCount}
              </p>
            </div>

            <div className="rounded-lg bg-slate-500/10 px-2 py-1.5 text-center">
              <p className="text-[9px] text-muted-foreground">
                Neutral
              </p>

              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {neutralCount}
              </p>
            </div>
          </div>

          {!showAll && pairs.length > 4 && (
            <p className="mt-2 text-center text-[9px] text-muted-foreground">
              Showing 4 of {pairs.length} relationships
            </p>
          )}
        </>
      )}
    </section>
  )
}

export function Explanations({
  analysis,
  isStudent,
}: {
  analysis: AnalysisResult
  isStudent: boolean
}) {
  const items = isStudent
    ? withoutStarMentions(analysis.explanations)
    : analysis.explanations

  return (
    <section className="min-w-0 rounded-xl border bg-card p-4 shadow-sm">
      <SectionTitle icon={<FileText className="h-4 w-4" />}>
        7. Explanations
      </SectionTitle>

      <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
        Explainable feedback generated from the REXA analysis.
      </p>

      {items.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed p-5 text-center">
          <p className="text-xs text-muted-foreground">
            No explanations returned.
          </p>
        </div>
      ) : (
        <div className="mt-3 space-y-2.5">
          {items.map((item) => {
            const category =
              item.category?.toLowerCase() ?? ''

            const isPositive =
              category.includes('coverage') ||
              category.includes('strength') ||
              category.includes('overall')

            const isWarning =
              category.includes('missing') ||
              category.includes('depth') ||
              category.includes('structure')

            const iconClass = isPositive
              ? 'bg-emerald-500 text-white dark:bg-emerald-400 dark:text-emerald-950'
              : isWarning
                ? 'bg-amber-500 text-white dark:bg-amber-400 dark:text-amber-950'
                : 'bg-blue-500 text-white dark:bg-blue-400 dark:text-blue-950'

            const cardClass = isPositive
              ? 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/60 dark:bg-emerald-950/20'
              : isWarning
                ? 'border-amber-200 bg-amber-50/70 dark:border-amber-900/60 dark:bg-amber-950/20'
                : 'border-blue-200 bg-blue-50/70 dark:border-blue-900/60 dark:bg-blue-950/20'

            return (
              <article
                key={item.id}
                className={`
                  rounded-xl border p-3
                  transition-colors
                  ${cardClass}
                `}
              >
                <div className="flex items-start gap-3">
                  {/* Status icon */}
                  <span
                    className={`
                      grid h-8 w-8 shrink-0 place-items-center
                      rounded-full text-sm font-bold
                      ${iconClass}
                    `}
                  >
                    {isPositive
                      ? '✓'
                      : isWarning
                        ? '!'
                        : 'i'}
                  </span>

                  {/* Explanation content */}
                  <div className="min-w-0 flex-1">
                    {item.category && (
                      <span
                        className="
                          inline-flex max-w-full
                          rounded-full
                          border border-border/60
                          bg-background/70
                          px-2 py-0.5
                          text-[9px] font-medium
                          text-muted-foreground
                        "
                      >
                        {item.category}
                      </span>
                    )}

                    <p className="mt-2 text-xs leading-5 text-foreground">
                      {item.message}
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export function RexaAnalysisDashboard({
  analysis,
  isTeacher,
  isStudent,
}: Props) {
  return (
    <div className="min-w-0 space-y-5">
      <Summary
        analysis={analysis}
        isTeacher={isTeacher}
        isStudent={isStudent}
      />
      <div className="space-y-4">
  <SentenceRoles analysis={analysis} />
  <RoleStructure analysis={analysis} />
</div>

      <div className="grid min-w-0 gap-5 md:grid-cols-2 xl:grid-cols-3">
  <ConceptCoverage analysis={analysis} />

  <SupportAndContradiction analysis={analysis} />

  <Explanations analysis={analysis} isStudent={isStudent} />
</div>

      <ImprovementBriefCard
  analysis={analysis}
  omitStars={isStudent}
/>

    </div>
  )
}
