import {
  BookOpen,
  Waypoints,
  Award,
  CircleHelp,
  ClipboardList,
  FileSpreadsheet,
  GitCompare,
  LayoutDashboard,
  History,
  LineChart,
  PenLine,
  Settings,
  Tags,
  Users,
  ContactRound,
} from 'lucide-react'
import type { NavGroup } from '@/types'
import { isAdminRole, isTeacherRole } from '@/lib/roles'
import { ROUTES } from './paths'

export const sidebarNavigation: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: ROUTES.APP.DASHBOARD,
        icon: LayoutDashboard,
      },
      {
        title: 'Evaluation',
        href: ROUTES.APP.EVALUATION,
        icon: LineChart,
      },
    ],
  },
  {
    label: 'Workspace',
    items: [
      {
        title: 'Questions',
        href: ROUTES.APP.QUESTIONS,
        icon: BookOpen,
      },
      {
        title: 'Analysis',
        href: ROUTES.APP.ANALYSIS,
        icon: PenLine,
      },
      {
        title: 'Class Excel',
        href: ROUTES.APP.BATCH,
        icon: FileSpreadsheet,
      },
      {
        title: 'Class report',
        href: ROUTES.APP.REPORTS,
        icon: ClipboardList,
      },
      {
        title: 'Student records',
        href: ROUTES.APP.STUDENTS,
        icon: ContactRound,
      },
      {
        title: 'Help & support',
        href: ROUTES.APP.HELP,
        icon: CircleHelp,
      },
      {
        title: 'Compare',
        href: ROUTES.APP.COMPARE,
        icon: GitCompare,
      },
    ],
  },
  {
    label: 'Reasoning',
    items: [
      {
        title: 'Reasoning Engine',
        href: ROUTES.APP.REASONING,
        icon: Waypoints,
      },
      {
        title: 'Annotation Lab',
        href: ROUTES.APP.ANNOTATION,
        icon: Tags,
      },
    ],
  },
]

const adminNavigation: NavGroup[] = [
  ...sidebarNavigation,
  {
    label: 'Admin',
    items: [
      {
        title: 'Users',
        href: ROUTES.APP.USERS,
        icon: Users,
      },
    ],
  },
]

export const studentNavigation: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: ROUTES.APP.DASHBOARD,
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: 'Workspace',
    items: [
      {
        title: 'Practice questions',
        href: ROUTES.APP.PRACTICE,
        icon: BookOpen,
      },
      {
        title: 'Reasoning console',
        href: ROUTES.APP.ANALYSIS,
        icon: PenLine,
      },
      {
        title: 'My feedback',
        href: ROUTES.APP.REASONING,
        icon: Waypoints,
      },
      {
        title: 'History',
        href: ROUTES.APP.HISTORY,
        icon: History,
      },
      {
        title: 'Progress',
        href: ROUTES.APP.PROGRESS,
        icon: LineChart,
      },
      {
        title: 'Achievements',
        href: ROUTES.APP.ACHIEVEMENTS,
        icon: Award,
      },
      {
        title: 'Help & support',
        href: ROUTES.APP.HELP,
        icon: CircleHelp,
      },
      {
        title: 'Settings',
        href: ROUTES.APP.SETTINGS,
        icon: Settings,
      },
    ],
  },
]

export function getSidebarNavigation(role?: string | null): NavGroup[] {
  if (isAdminRole(role)) return adminNavigation
  if (isTeacherRole(role)) return sidebarNavigation
  return studentNavigation
}

export const navbarLinks = [
  { title: 'Features', href: '#features' },
  { title: 'How it works', href: '#how-it-works' },
]
