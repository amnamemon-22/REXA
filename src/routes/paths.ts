export const ROUTES = {
  HOME: '/',
  AUTH: {
    ROOT: '/auth',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  APP: {
    ROOT: '/app',
    DASHBOARD: '/app/dashboard',
    PRACTICE: '/app/practice',
    HISTORY: '/app/history',
    PROGRESS: '/app/progress',
    ACHIEVEMENTS: '/app/achievements',
    HELP: '/app/help',
    ANALYSIS: '/app/analysis',
    REASONING: '/app/reasoning',
    REPORTS: '/app/reports',
    BATCH: '/app/batch',
    SETTINGS: '/app/settings',
    QUESTIONS: '/app/questions',
    ANNOTATION: '/app/annotation',
    COMPARE: '/app/compare',
    EVALUATION: '/app/evaluation',
    USERS: '/app/users',
    STUDENTS: '/app/students',
  },
} as const

export const APP_NAME = 'RExA'
export const APP_FULL_NAME =
  'Explainable Reasoning Analysis of Descriptive Answers'
