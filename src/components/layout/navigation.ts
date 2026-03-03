import {
  LayoutDashboard,
  Megaphone,
  Users,
  Heart,
  Settings,
  FolderKanban,
  Users2,
  LucideIcon,
  Plane,
  Handshake,
  FileText,
  BarChart3,
} from 'lucide-react'

export interface NavSubItem {
  id: string
  title: string
  href: string
  children?: NavSubItem[] // For accordion sub-items
}

export interface NavItem {
  id: string
  title: string
  icon: LucideIcon
  children: NavSubItem[]
  relatedSections?: string[]
}

export const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    children: [], // No secondary nav
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
    relatedSections: ['community'],
  },
  {
    id: 'fundraising',
    title: 'Fundraising',
    icon: Heart,
    children: [], // No secondary nav for now
  },
  {
    id: 'community',
    title: 'Community',
    icon: Users2,
    children: [
      {
        id: 'people',
        title: 'People',
        href: '#',
        children: [
          { id: 'all-people', title: 'All People', href: '#' },
          { id: 'segments', title: 'Segments', href: '#' },
        ],
      },
      { id: 'groups', title: 'Groups', href: '#' },
      { id: 'custom-fields', title: 'Custom Fields', href: '#' },
      { id: 'imports', title: 'Imports', href: '#' },
      {
        id: 'super-pixel',
        title: 'Super Pixel',
        href: '#',
        children: [
          { id: 'setup', title: 'Setup', href: '#' },
          { id: 'tracking', title: 'Tracking', href: '#' },
        ],
      },
    ],
  },
]

export const projectsItem: NavItem = {
  id: 'projects',
  title: 'Projects',
  icon: FolderKanban,
  children: [], // No secondary nav - projects page shows grid/list of projects
}

export const accountsItem: NavItem = {
  id: 'accounts',
  title: 'Accounts',
  icon: Users,
  children: [], // No secondary nav
}

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

export const allNavigationItems: NavItem[] = [...navigationItems, projectsItem, accountsItem, settingsItem]

// Project Mode Navigation Items
export const projectNavigationItems: NavItem[] = [
  {
    id: 'campaigns',
    title: 'Campaigns',
    icon: Megaphone,
    children: [
      { id: 'all', title: 'All', href: '#' },
      { id: 'ads', title: 'Ads', href: '#' },
      { id: 'email', title: 'Email', href: '#' },
      { id: 'monetization', title: 'Monetization', href: '#' },
      { id: 'other', title: 'Other', href: '#' },
    ],
  },
  {
    id: 'flights',
    title: 'Flights',
    icon: Plane,
    children: [
      { id: 'active', title: 'Active', href: '#' },
      { id: 'scheduled', title: 'Scheduled', href: '#' },
      { id: 'completed', title: 'Completed', href: '#' },
    ],
  },
  {
    id: 'partners',
    title: 'Partners',
    icon: Handshake,
    children: [
      { id: 'all-partners', title: 'All Partners', href: '#' },
      { id: 'sponsorships', title: 'Sponsorships', href: '#' },
    ],
  },
  {
    id: 'content',
    title: 'Content',
    icon: FileText,
    children: [
      { id: 'assets', title: 'Assets', href: '#' },
      { id: 'templates', title: 'Templates', href: '#' },
    ],
  },
  {
    id: 'report',
    title: 'Report',
    icon: BarChart3,
    children: [
      { id: 'overview', title: 'Overview', href: '#' },
      { id: 'performance', title: 'Performance', href: '#' },
    ],
  },
]

export const projectSettingsItem: NavItem = {
  id: 'project-settings',
  title: 'Project Settings',
  icon: Settings,
  children: [
    { id: 'general', title: 'General', href: '#' },
    { id: 'team', title: 'Team', href: '#' },
    { id: 'integrations', title: 'Integrations', href: '#' },
  ],
}

// Sample projects for demo purposes
export const sampleProjects = [
  { id: 'spring-gala', name: 'Spring Gala' },
  { id: 'annual-fundraiser', name: 'Annual Fundraiser' },
  { id: 'q4-campaign', name: 'Q4 Campaign' },
]
