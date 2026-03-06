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
  Bell,
  BookOpen,
  HelpCircle,
  Plug,
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
    title: 'All Campaigns',
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
    { id: 'subscriptions', title: 'Subscriptions', href: '#' },
    {
      id: 'tracking',
      title: 'Tracking',
      href: '#',
      children: [
        { id: 'domains', title: 'Domains', href: '#' },
        { id: 'domain-allow-list', title: 'Domain allow list', href: '#' },
        { id: 'ip-filtering', title: 'IP filtering', href: '#' },
        { id: 'geo-filters', title: 'Geo filters', href: '#' },
        { id: 'conversions', title: 'Conversions', href: '#' },
      ],
    },
    {
      id: 'email',
      title: 'Email',
      href: '#',
      children: [
        { id: 'email-addresses', title: 'Email addresses', href: '#' },
        { id: 'templates', title: 'Templates', href: '#' },
      ],
    },
    {
      id: 'advertising',
      title: 'Advertising',
      href: '#',
      children: [
        { id: 'advertisers', title: 'Advertisers', href: '#' },
        { id: 'flags', title: 'Flags', href: '#' },
      ],
    },
    {
      id: 'branding',
      title: 'Branding',
      href: '#',
      children: [
        { id: 'fonts', title: 'Fonts', href: '#' },
      ],
    },
  ],
}

export const integrationsItem: NavItem = {
  id: 'integrations',
  title: 'Integrations',
  icon: Plug,
  children: [
    {
      id: 'api',
      title: 'API',
      href: '#',
      children: [
        { id: 'api-keys', title: 'API keys', href: '#' },
      ],
    },
    {
      id: 'crm',
      title: 'CRM',
      href: '#',
      children: [
        { id: 'raisers-edge-nxt', title: "Raiser's Edge NXT", href: '#' },
        { id: 'salesforce-npsp', title: 'Salesforce NPSP', href: '#' },
      ],
    },
    {
      id: 'advertising-platforms',
      title: 'Advertising Platforms',
      href: '#',
      children: [
        { id: 'google-ads', title: 'Google Ads', href: '#' },
        { id: 'meta', title: 'Meta', href: '#' },
      ],
    },
  ],
}

export const notificationsItem: NavItem = {
  id: 'notifications',
  title: 'Notifications',
  icon: Bell,
  children: [],
}

export const resourcesItem: NavItem = {
  id: 'resources',
  title: 'Resources',
  icon: BookOpen,
  children: [],
}

export const helpItem: NavItem = {
  id: 'help',
  title: 'Help',
  icon: HelpCircle,
  children: [],
}

export const allNavigationItems: NavItem[] = [...navigationItems, projectsItem, accountsItem, settingsItem, integrationsItem]

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

// Sample workspaces for demo purposes
export interface Workspace {
  id: string
  name: string
  plan: string
  image: string
}

export const sampleWorkspaces: Workspace[] = [
  { id: 'acme', name: 'Acme Nonprofit', plan: 'Essential Plan', image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=80&h=80&fit=crop' },
  { id: 'beta', name: 'Beta Foundation', plan: 'Advanced Plan', image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=80&h=80&fit=crop' },
  { id: 'charity', name: 'Charity Alliance', plan: 'Feathr Light', image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=80&h=80&fit=crop' },
  { id: 'delta', name: 'Delta Community', plan: 'Essential Plan', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=80&h=80&fit=crop' },
  { id: 'echo', name: 'Echo Education', plan: 'Advanced Plan', image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=80&h=80&fit=crop' },
]
