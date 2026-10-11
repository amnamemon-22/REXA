// MOCK API — TEMPORARY FRONTEND IMPLEMENTATION
// Feature: Practice subject picker fallback tiles
// Expected endpoint: GET /questions/subjects — PROPOSED — backend confirmation required
// Method: GET
// Expected request: none
// Expected response: { subjects: string[] }
// Persistence: static fixture in frontend bundle
// Backend replacement: return distinct Question.course values (or dedicated subjects table)

export const DEMO_SUBJECTS = [
  'Computer Science',
  'Biology',
  'Physics',
  'Chemistry',
  'General',
] as const
