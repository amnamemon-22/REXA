/**
 * Frontend feature flags. Real API calls remain default unless noted.
 */
export const enableDemoMocks =
  import.meta.env.VITE_ENABLE_DEMO_MOCKS === 'true'

/** When the question bank has no course/subject labels, show demo subject tiles. */
export function isDemoSubjectsFallbackEnabled(): boolean {
  return (
    enableDemoMocks ||
    import.meta.env.VITE_DEMO_SUBJECT_FALLBACK !== 'false'
  )
}
