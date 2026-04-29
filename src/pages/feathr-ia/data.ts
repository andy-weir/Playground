import {
  Plus,
  Rocket,
  LayoutGrid,
  Megaphone,
  Handshake,
  Heart,
  Users,
  FileText,
  BarChart3,
  Building2,
  Settings,
  HelpCircle,
  Bell,
  User,
  type LucideIcon,
} from 'lucide-react'

export type NodeType = 'leaf' | 'template'
export type SectionKey = 'top' | 'overview' | 'programs' | 'library' | 'insights' | 'utility'

export interface IANode {
  id: string
  label: string
  icon?: LucideIcon
  section?: SectionKey
  type?: NodeType
  internal?: boolean
  hint?: string
  children?: IANode[]
}

export const IA: IANode = {
  id: 'root',
  label: 'Feathr',
  children: [
    {
      id: 'create',
      label: 'Create',
      icon: Plus,
      section: 'top',
      children: [
        { id: 'create-campaign', label: 'Campaign', icon: Megaphone, type: 'leaf' },
        { id: 'create-group', label: 'Group', icon: Users, type: 'leaf' },
        { id: 'create-project', label: 'Project', icon: LayoutGrid, type: 'leaf' },
      ],
    },
    { id: 'quick-start', label: 'Quick Start', icon: Rocket, section: 'overview', type: 'leaf' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, section: 'overview', type: 'leaf' },

    {
      id: 'campaigns',
      label: 'Campaigns / Marketing',
      icon: Megaphone,
      section: 'programs',
      children: [
        { id: 'campaigns-all', label: 'All', children: [{ id: 'campaign-tpl', label: '{{ campaign }}', type: 'template' }] },
        { id: 'campaigns-ads', label: 'Ads', children: [{ id: 'ad-campaign-tpl', label: '{{ ad campaign }}', type: 'template' }] },
        {
          id: 'campaigns-email',
          label: 'Email',
          children: [
            { id: 'email-campaign-tpl', label: '{{ email campaign }}', type: 'template' },
            {
              id: 'email-subscriptions',
              label: 'Subscriptions',
              type: 'leaf',
              hint: 'This is unsubscribe-page settings — currently lives under Account Settings > General. Test whether users find it here vs. there.',
            },
          ],
        },
        { id: 'campaigns-google', label: 'Google', children: [{ id: 'google-campaign-tpl', label: '{{ google ads campaign }}', type: 'template' }] },
        { id: 'campaigns-meta', label: 'Meta', children: [{ id: 'meta-campaign-tpl', label: '{{ meta campaign }}', type: 'template' }] },
        {
          id: 'campaigns-other',
          label: 'Other',
          hint: 'Weak scent — what lives here?',
          children: [{ id: 'other-campaign-tpl', label: '{{ other campaign }}', type: 'template' }],
        },
        {
          id: 'campaigns-flights',
          label: 'Flights',
          children: [
            {
              id: 'flight-tpl',
              label: '{{ flight }}',
              type: 'template',
              children: [
                { id: 'flight-overview', label: 'Overview', type: 'leaf' },
                { id: 'flight-report', label: 'Report', type: 'leaf' },
              ],
            },
          ],
        },
        {
          id: 'campaigns-projects',
          label: 'Projects',
          hint: "Projects are an optional folder, not required. Campaigns can stand alone or be grouped. Test whether 'optional' reads as nav-only vs. concept.",
          children: [
            {
              id: 'project-tpl',
              label: '{{ project }}',
              type: 'template',
              children: [
                { id: 'project-information', label: 'Information', type: 'leaf' },
                { id: 'project-billing', label: 'Billing', type: 'leaf' },
                { id: 'project-report', label: 'Report', type: 'leaf' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'partner-marketing',
      label: 'Partner Marketing',
      icon: Handshake,
      section: 'programs',
      hint: 'Risk: users may confuse this with Campaigns / Marketing',
      children: [
        {
          id: 'pm-invites',
          label: 'Invites',
          children: [
            { id: 'pm-campaigns', label: 'Campaigns', type: 'leaf' },
            { id: 'pm-templates', label: 'Partner Templates', type: 'leaf' },
          ],
        },
        {
          id: 'pm-monetization',
          label: 'Monetization',
          children: [{ id: 'pm-monetization-tpl', label: '{{ monetization campaign }}', type: 'template' }],
        },
        {
          id: 'pm-partners',
          label: 'Partners',
          children: [
            { id: 'pm-all-partners', label: 'All Partners', type: 'leaf' },
            { id: 'pm-activity', label: 'Activity', type: 'leaf' },
            { id: 'pm-messages', label: 'Messages', type: 'leaf' },
            { id: 'pm-imports', label: 'Imports', type: 'leaf' },
            { id: 'pm-exports', label: 'Exports', type: 'leaf' },
            {
              id: 'pm-custom-fields',
              label: 'Custom Fields',
              type: 'leaf',
              hint: 'Also exists under Audience > Settings — same or different?',
            },
            { id: 'pm-dashboard-settings', label: 'Dashboard Settings', type: 'leaf' },
          ],
        },
      ],
    },
    {
      id: 'fundraising',
      label: 'Fundraising',
      icon: Heart,
      section: 'programs',
      children: [
        {
          id: 'donation-form-tpl',
          label: '{{ donation form }}',
          type: 'template',
          children: [
            { id: 'donation-dashboard', label: 'Dashboard', type: 'leaf' },
            { id: 'donation-settings', label: 'Settings', type: 'leaf' },
          ],
        },
      ],
    },

    {
      id: 'audience',
      label: 'Audience',
      icon: Users,
      section: 'library',
      hint: 'Test: do users look here for "Contacts" or "People"?',
      children: [
        {
          id: 'audience-contacts',
          label: 'Contacts',
          children: [
            { id: 'audience-contacts-list', label: 'Contacts', type: 'leaf' },
            { id: 'audience-activity', label: 'Activity', type: 'leaf' },
          ],
        },
        {
          id: 'audience-segments',
          label: 'Segments',
          children: [{ id: 'segment-tpl', label: '{{ segment }}', type: 'template' }],
        },
        {
          id: 'audience-settings',
          label: 'Settings',
          children: [
            { id: 'audience-custom-fields', label: 'Custom Fields', type: 'leaf' },
            { id: 'audience-imports', label: 'Imports', type: 'leaf' },
            {
              id: 'super-pixel',
              label: 'Super Pixel',
              children: [
                { id: 'super-pixel-install', label: 'Install', type: 'leaf' },
                { id: 'super-pixel-conversion', label: 'Conversion Pixels', type: 'leaf' },
                { id: 'super-pixel-implementations', label: 'Implementations', type: 'leaf' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'content',
      label: 'Content',
      icon: FileText,
      section: 'library',
      children: [
        { id: 'content-creatives', label: 'Creatives', type: 'leaf' },
        {
          id: 'content-templates',
          label: 'Templates',
          children: [
            { id: 'content-templates-saved', label: 'Saved Templates', type: 'leaf' },
            { id: 'content-templates-from', label: 'From Campaigns', type: 'leaf' },
          ],
        },
        { id: 'content-forms', label: 'Forms', type: 'leaf' },
        {
          id: 'content-settings',
          label: 'Settings',
          children: [{ id: 'content-fonts', label: 'Fonts', type: 'leaf' }],
        },
      ],
    },

    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      section: 'insights',
      children: [
        { id: 'reports-engagement', label: 'Audience Engagement', type: 'leaf' },
        {
          id: 'reports-conversions',
          label: 'Conversions',
          children: [
            { id: 'reports-conv-dashboard', label: 'Dashboard', type: 'leaf' },
            { id: 'reports-goal-manager', label: 'Goal Manager', type: 'leaf' },
          ],
        },
      ],
    },

    {
      id: 'account-settings',
      label: 'Account Settings',
      icon: Settings,
      section: 'utility',
      hint: 'General has too many ungrouped children — recommend grouping into 3-5 named subgroups',
      children: [
        {
          id: 'as-general',
          label: 'General',
          children: [
            { id: 'as-account-info', label: 'Account Information', type: 'leaf' },
            { id: 'as-early-access', label: 'Early Access', type: 'leaf' },
            { id: 'as-license', label: 'License & Grace Period', type: 'leaf', internal: true },
            { id: 'as-team', label: 'Team', type: 'leaf', internal: true },
            { id: 'as-industry', label: 'Industry', type: 'leaf', internal: true },
            { id: 'as-email-campaigns', label: 'Email & Campaigns', type: 'leaf', internal: true },
            { id: 'as-beefree', label: 'BeeFree Editor', type: 'leaf', internal: true },
            { id: 'as-flags', label: 'Flags', type: 'leaf', internal: true },
            {
              id: 'as-domains',
              label: 'Domains',
              type: 'leaf',
              hint: 'Domain settings are project-scoped today (used by landing pages, invites, forms). Unclear how this works when projects become optional.',
            },
            { id: 'as-domain-allow', label: 'Domain Allow List', type: 'leaf' },
            { id: 'as-conversions', label: 'Conversions', type: 'leaf' },
            { id: 'as-ip-filtering', label: 'IP Filtering', type: 'leaf' },
            { id: 'as-geofilters', label: 'Geofilters', type: 'leaf' },
            { id: 'as-advertisers', label: 'Advertisers', type: 'leaf' },
            {
              id: 'as-sender-emails',
              label: 'Sender Email Addresses',
              type: 'leaf',
              hint: 'Bouncing here from Email feels disjointed (internal feedback). Test whether users expect this under Email instead.',
            },
            {
              id: 'as-subscriptions',
              label: 'Subscriptions',
              type: 'leaf',
              hint: 'Same concept as Email > Subscriptions in the proposal — duplicate during migration. Test which location wins.',
            },
          ],
        },
        {
          id: 'as-billing',
          label: 'Billing',
          children: [
            { id: 'as-configurations', label: 'Configurations', type: 'leaf' },
            { id: 'as-billing-license', label: 'License', type: 'leaf' },
            { id: 'as-invoices', label: 'Invoices', type: 'leaf' },
          ],
        },
        {
          id: 'as-integrations',
          label: 'Integrations',
          children: [{ id: 'integration-tpl', label: '{{ integration }}', type: 'template' }],
        },
        {
          id: 'as-permissions',
          label: 'Permissions',
          children: [
            { id: 'as-users', label: 'Users', type: 'leaf' },
            { id: 'as-roles', label: 'Roles', type: 'leaf' },
            { id: 'as-auth', label: 'Authentication', type: 'leaf' },
          ],
        },
      ],
    },
    { id: 'accounts-internal', label: 'Accounts', icon: Building2, section: 'utility', internal: true, type: 'leaf' },
    {
      id: 'help',
      label: 'Help',
      icon: HelpCircle,
      section: 'utility',
      children: [
        { id: 'help-feature-requests', label: 'Feature Requests', type: 'leaf' },
        { id: 'help-desk', label: 'Help Desk', type: 'leaf' },
        { id: 'help-academy', label: 'Feathr Academy', type: 'leaf' },
      ],
    },
    { id: 'notifications', label: 'Notifications', icon: Bell, section: 'utility', type: 'leaf' },
    {
      id: 'user-profile',
      label: 'User Profile',
      icon: User,
      section: 'utility',
      children: [
        {
          id: 'up-profile',
          label: 'Profile',
          children: [{ id: 'up-security', label: 'Security', type: 'leaf' }],
        },
        { id: 'up-dark-mode', label: 'Dark Mode', type: 'leaf', internal: true },
        { id: 'up-privacy', label: 'Privacy Policy', type: 'leaf' },
        { id: 'up-terms', label: 'Terms & Conditions', type: 'leaf' },
        { id: 'up-logout', label: 'Logout', type: 'leaf' },
      ],
    },
  ],
}

export interface Group {
  section: SectionKey
  label: string | null
}

export const GROUPS: Group[] = [
  { section: 'overview', label: null },
  { section: 'programs', label: 'Programs' },
  { section: 'library', label: 'Library' },
  { section: 'insights', label: 'Insights' },
]

export const PATHS: Record<string, IANode[]> = {}

function indexNode(node: IANode, path: IANode[]) {
  const newPath = [...path, node]
  PATHS[node.id] = newPath
  if (node.children) node.children.forEach((c) => indexNode(c, newPath))
}
indexNode(IA, [])

export function isAncestor(ancestorId: string, descendantId: string): boolean {
  const path = PATHS[descendantId]
  if (!path) return false
  return path.some((n) => n.id === ancestorId)
}

// ── Tree Test Types & Data ──────────────────────────────────────────

export interface TreeTestTask {
  id: number
  prompt: string
  expectedAnswers: string[]
  researchQuestion: string
  category: string
}

export interface TreeTestAnswer {
  taskId: number
  path: string[]
  nodeId: string
  pathVisited: string[]
  startTime: number
  endTime: number
  success: boolean
  direct: boolean
}

export interface TreeTestSession {
  participantId: string
  startedAt: number
  answers: TreeTestAnswer[]
  taskOrder: number[]
}

export const TREE_TEST_TASKS: TreeTestTask[] = [
  {
    id: 1,
    prompt: 'You want to create a new email campaign. Where would you go?',
    expectedAnswers: ['create-campaign', 'campaigns-email', 'email-campaign-tpl'],
    researchQuestion: 'Create button + Campaigns/Marketing findability',
    category: 'Campaign',
  },
  {
    id: 2,
    prompt: 'You want to see all your currently running ad campaigns. Where would you find them?',
    expectedAnswers: ['campaigns-ads', 'ad-campaign-tpl'],
    researchQuestion: 'Campaigns > Ads path',
    category: 'Campaign',
  },
  {
    id: 3,
    prompt: 'You want to invite a partner organization to run ads for your cause. Where would you go?',
    expectedAnswers: ['pm-invites', 'pm-campaigns', 'pm-templates'],
    researchQuestion: 'RQ1: Partner Marketing vs Campaigns confusion',
    category: 'Campaign',
  },
  {
    id: 4,
    prompt: 'A partner wants to sell sponsorships for your event. Where would you set that up?',
    expectedAnswers: ['pm-monetization', 'pm-monetization-tpl'],
    researchQuestion: 'RQ1: Monetization findability',
    category: 'Campaign',
  },
  {
    id: 5,
    prompt: 'You need to upload a spreadsheet of supporter contacts. Where would you go?',
    expectedAnswers: ['audience-imports', 'audience-settings'],
    researchQuestion: 'RQ2: Audience label + Imports path',
    category: 'Audience',
  },
  {
    id: 6,
    prompt: 'You want to create a segment of donors who gave more than $100. Where would you go?',
    expectedAnswers: ['audience-segments', 'segment-tpl'],
    researchQuestion: 'RQ2: Audience > Segments path',
    category: 'Audience',
  },
  {
    id: 7,
    prompt: 'You want to add a custom field to track supporter volunteer status. Where would you go?',
    expectedAnswers: ['audience-custom-fields', 'pm-custom-fields'],
    researchQuestion: 'RQ7: Custom Fields location',
    category: 'Audience',
  },
  {
    id: 8,
    prompt: 'You want to create a new donation form for your website. Where would you go?',
    expectedAnswers: ['content-forms', 'donation-form-tpl', 'fundraising'],
    researchQuestion: 'RQ3: Forms discoverability (critical)',
    category: 'Forms',
  },
  {
    id: 9,
    prompt: 'You want to edit an email template you saved previously. Where would you find it?',
    expectedAnswers: ['content-templates-saved', 'content-templates'],
    researchQuestion: 'RQ8: Content > Templates path',
    category: 'Content',
  },
  {
    id: 10,
    prompt: 'You want to upload new ad creative images. Where would you go?',
    expectedAnswers: ['content-creatives'],
    researchQuestion: 'RQ8: Content > Creatives',
    category: 'Content',
  },
  {
    id: 11,
    prompt: 'You need to add a new team member to your Feathr account. Where would you go?',
    expectedAnswers: ['as-users', 'as-permissions'],
    researchQuestion: 'RQ6: Account Settings > Permissions path',
    category: 'Settings',
  },
  {
    id: 12,
    prompt: 'You want to install the Super Pixel tracking code on your website. Where would you go?',
    expectedAnswers: ['super-pixel-install', 'super-pixel'],
    researchQuestion: 'RQ5: Audience > Settings > Super Pixel depth',
    category: 'Settings',
  },
  {
    id: 13,
    prompt: "You want to update your organization's billing information. Where would you go?",
    expectedAnswers: ['as-billing', 'as-configurations', 'as-billing-license'],
    researchQuestion: 'Control task',
    category: 'Settings',
  },
  {
    id: 14,
    prompt: 'You want to see how many people visited your website from your campaigns. Where would you go?',
    expectedAnswers: ['reports-conversions', 'reports-conv-dashboard'],
    researchQuestion: 'Reports > Conversions path',
    category: 'Reports',
  },
  {
    id: 15,
    prompt: 'You want to review the overall engagement of your audience. Where would you go?',
    expectedAnswers: ['reports-engagement', 'reports'],
    researchQuestion: 'Reports vs Dashboard',
    category: 'Reports',
  },
  {
    id: 16,
    prompt: 'You want to manage the unsubscribe page settings for your supporter emails. Where would you go?',
    expectedAnswers: ['email-subscriptions', 'as-subscriptions'],
    researchQuestion: 'RQ11: Subscriptions label conflict (Email vs Account Settings)',
    category: 'Settings',
  },
  {
    id: 17,
    prompt: 'You need to configure the sender email address used for an outgoing campaign email. Where would you go?',
    expectedAnswers: ['as-sender-emails'],
    researchQuestion: 'RQ6: Sender Email Address proximity to Email',
    category: 'Settings',
  },
  {
    id: 18,
    prompt: 'You want to update the domain settings for a landing page. Where would you go?',
    expectedAnswers: ['as-domains'],
    researchQuestion: 'RQ12: Domain settings location with optional projects',
    category: 'Settings',
  },
]

export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = shuffled[i] as T
    shuffled[i] = shuffled[j] as T
    shuffled[j] = tmp
  }
  return shuffled
}
