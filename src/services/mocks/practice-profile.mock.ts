// MOCK API — TEMPORARY FRONTEND IMPLEMENTATION
// Feature: Learner skill placement (Beginner / Intermediate / Advanced)
// Expected endpoint: PUT /users/me/practice-profile — PROPOSED — backend confirmation required
// Method: PUT
// Expected request: { skillLevel: 'beginner' | 'intermediate' | 'advanced' }
// Expected response: { skillLevel: string, updatedAt: string }
// Persistence: localStorage key `rexa-practice-profile` (per browser, not synced)
// Backend replacement: persist on user record and return on GET /users/me

import type { SkillLevel } from '@/types/practice.types'

const STORAGE_KEY = 'rexa-practice-profile'

export type PracticeProfile = {
  skillLevel: SkillLevel
  updatedAt: string
}

export function getPracticeProfile(): PracticeProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PracticeProfile
  } catch {
    return null
  }
}

export function savePracticeProfile(skillLevel: SkillLevel): PracticeProfile {
  const profile: PracticeProfile = {
    skillLevel,
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  return profile
}
