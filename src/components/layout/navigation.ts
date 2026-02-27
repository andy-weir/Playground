import {
  LayoutDashboard,
  Megaphone,
  Users,
  FileText,
  BarChart3,
  Settings,
  LucideIcon,
} from 'lucide-react'

export interface NavSubItem {
  id: string
  title: string
  href: string
}

export interface NavItem {
  id: string
  title: string
  icon: LucideIcon
  children: NavSubItem[]
}

export const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    children: [
      { id: 'overview', title: 'Overview', href: '#' },
      { id: 'analytics', title: 'Analytics', href: '#' },
      { id: 'activity', title: 'Activity', href: '#' },
    ],
  },
  {
    id: 'campaigns',
    title: 'Campaigns',
    icon: Megaphone,
    children: [
      { id: 'overview', title: 'Overview', href: '#' },
      { id: 'email', title: 'Email', href: '#' },
      { id: 'ads', title: 'Ads', href: '#' },
      { id: 'social', title: 'Social', href: '#' },
    ],
  },
  {
    id: 'audiences',
    title: 'Audiences',
    icon: Users,
    children: [
      { id: 'all-people', title: 'All People', href: '#' },
      { id: 'segments', title: 'Segments', href: '#' },
      { id: 'imports', title: 'Imports', href: '#' },
    ],
  },
  {
    id: 'forms',
    title: 'Forms',
    icon: FileText,
    children: [
      { id: 'all-forms', title: 'All Forms', href: '#' },
      { id: 'donation-forms', title: 'Donation Forms', href: '#' },
      { id: 'landing-pages', title: 'Landing Pages', href: '#' },
    ],
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: BarChart3,
    children: [
      { id: 'dashboard', title: 'Dashboard', href: '#' },
      { id: 'campaign-performance', title: 'Campaign Performance', href: '#' },
      { id: 'audience-growth', title: 'Audience Growth', href: '#' },
    ],
  },
]

export const settingsItem: NavItem = {
  id: 'settings',
  title: 'Settings',
  icon: Settings,
  children: [
    { id: 'general', title: 'General', href: '#' },
    { id: 'team', title: 'Team', href: '#' },
    { id: 'billing', title: 'Billing', href: '#' },
    { id: 'integrations', title: 'Integrations', href: '#' },
  ],
}

export const allNavigationItems: NavItem[] = [...navigationItems, settingsItem]
