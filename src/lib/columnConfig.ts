import type { CampaignType } from './campaignTypes'

export interface ColumnDef {
  id: string
  label: string
  width?: string // Tailwind w-[] class
}

// All possible columns
export const allColumns: ColumnDef[] = [
  { id: 'name', label: 'Name' },
  { id: 'type', label: 'Type', width: 'w-[170px]' },
  { id: 'status', label: 'Status', width: 'w-[110px]' },
  { id: 'createdDate', label: 'Created', width: 'w-[100px]' },
  { id: 'startDate', label: 'Start', width: 'w-[100px]' },
  { id: 'endDate', label: 'End', width: 'w-[100px]' },
  { id: 'views', label: 'Views', width: 'w-[90px]' },
  { id: 'clicks', label: 'Clicks', width: 'w-[90px]' },
  { id: 'spend', label: 'Spend', width: 'w-[100px]' },
  { id: 'budget', label: 'Budget', width: 'w-[100px]' },
  { id: 'conversions', label: 'Conversions', width: 'w-[110px]' },
  { id: 'conversionValue', label: 'Conv. Value', width: 'w-[110px]' },
  { id: 'emailSends', label: 'Sends', width: 'w-[90px]' },
  { id: 'deliveries', label: 'Deliveries', width: 'w-[100px]' },
  { id: 'hardBounces', label: 'Hard Bounces', width: 'w-[110px]' },
  { id: 'hardBounceRate', label: 'Bounce Rate', width: 'w-[110px]' },
  { id: 'unsubscribes', label: 'Unsubs', width: 'w-[90px]' },
  { id: 'emailOpenRate', label: 'Open Rate', width: 'w-[100px]' },
  { id: 'emailCtr', label: 'Email CTR', width: 'w-[100px]' },
  { id: 'uniqueClicks', label: 'Unique Clicks', width: 'w-[110px]' },
  { id: 'duration', label: 'Duration', width: 'w-[100px]' },
  { id: 'cpm', label: 'CPM', width: 'w-[80px]' },
  { id: 'adCtr', label: 'Ad CTR', width: 'w-[90px]' },
  { id: 'cpc', label: 'CPC', width: 'w-[80px]' },
  { id: 'cpa', label: 'CPA', width: 'w-[80px]' },
  { id: 'partnerSpend', label: 'Partner Spend', width: 'w-[120px]' },
  { id: 'monetizationValue', label: 'Monetization Value', width: 'w-[140px]' },
  { id: 'targetViews', label: 'Target Views', width: 'w-[110px]' },
  { id: 'seen', label: 'Seen', width: 'w-[80px]' },
  { id: 'budgetProgress', label: 'Budget Progress', width: 'w-[130px]' },
  { id: 'responses', label: 'Responses', width: 'w-[100px]' },
  { id: 'participants', label: 'Participants', width: 'w-[110px]' },
  { id: 'flight', label: 'Flight', width: 'w-[120px]' },
]

export const columnMap = new Map(allColumns.map((c) => [c.id, c]))

export type ColumnId = (typeof allColumns)[number]['id']

// Which view is determined by sidebar selection
export type ViewContext = 'all' | 'ads' | 'email' | 'monetization' | 'other' | CampaignType

function resolveViewContext(subItem: string | undefined): ViewContext {
  if (!subItem || subItem === 'all' || subItem === 'overview') return 'all'
  // Group certain types into 'other'
  const otherTypes: CampaignType[] = ['conversations', 'landing-pages', 'track-links', 'invites']
  if (otherTypes.includes(subItem as CampaignType)) return 'other'
  return subItem as ViewContext
}

// Default visible columns per view
const defaultColumnsMap: Record<string, string[]> = {
  all: ['name', 'type', 'status', 'createdDate', 'startDate', 'endDate', 'views', 'clicks'],
  ads: ['name', 'type', 'status', 'createdDate', 'startDate', 'endDate', 'spend', 'budget', 'views', 'clicks', 'conversions', 'conversionValue'],
  email: ['name', 'type', 'status'],
  monetization: ['name', 'type', 'status'],
  'google-ad-grants': ['name', 'type', 'status', 'createdDate', 'startDate', 'endDate', 'spend', 'budget', 'views', 'clicks', 'conversions', 'conversionValue'],
  meta: ['name', 'type', 'status', 'createdDate', 'startDate', 'endDate', 'spend', 'budget', 'views', 'clicks', 'conversions', 'conversionValue'],
  other: ['name', 'type', 'status'],
}

// Hidden columns available per view (can be toggled on)
const hiddenColumnsMap: Record<string, string[]> = {
  all: [
    'partnerSpend', 'monetizationValue', 'cpc', 'cpa', 'targetViews', 'seen',
    'emailSends', 'hardBounces', 'unsubscribes', 'emailOpenRate', 'emailCtr',
    'conversionValue', 'hardBounceRate', 'duration', 'monetizationValue',
    'cpm', 'adCtr', 'budgetProgress', 'responses', 'deliveries', 'uniqueClicks',
    'conversions', 'participants', 'flight',
  ],
  ads: ['cpm', 'adCtr', 'duration', 'cpc', 'cpa'],
  email: ['emailSends', 'hardBounces', 'unsubscribes', 'emailOpenRate', 'emailCtr', 'duration', 'deliveries', 'uniqueClicks', 'hardBounceRate'],
  monetization: ['hardBounceRate', 'duration', 'emailOpenRate', 'emailCtr'],
  'google-ad-grants': ['cpm', 'adCtr', 'duration', 'cpc', 'cpa'],
  meta: ['cpm', 'adCtr', 'duration', 'cpc', 'cpa'],
  other: ['hardBounceRate', 'duration', 'emailOpenRate', 'emailCtr'],
}

export function getViewContext(subItem: string | undefined): ViewContext {
  return resolveViewContext(subItem)
}

export function getDefaultColumns(viewContext: ViewContext): string[] {
  return defaultColumnsMap[viewContext] ?? defaultColumnsMap['all']!
}

export function getAvailableHiddenColumns(viewContext: ViewContext): ColumnDef[] {
  const hiddenIds = hiddenColumnsMap[viewContext] ?? hiddenColumnsMap['all']!
  // Deduplicate
  const uniqueIds = [...new Set(hiddenIds)]
  return uniqueIds.map((id) => columnMap.get(id)).filter((c): c is ColumnDef => c !== undefined)
}

export function getVisibleColumnDefs(visibleIds: string[]): ColumnDef[] {
  return visibleIds.map((id) => columnMap.get(id)).filter((c): c is ColumnDef => c !== undefined)
}
