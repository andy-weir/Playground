import type { FeatureFlag, FeatureFlagId, FeaturePreference, FeaturePreferences } from '@/types/feature-flags'

export const FEATURE_FLAGS: FeatureFlag[] = [
  {
    id: 'newDashboard',
    name: 'New Dashboard',
    description: 'Experience the redesigned dashboard with improved data visualization and faster load times.',
    category: 'ui',
    tourSteps: [
      {
        targetSelector: '[data-tour="stats-overview"]',
        title: 'Stats at a Glance',
        description: 'Your key metrics are now displayed in beautiful cards with trend indicators.',
        placement: 'bottom',
      },
      {
        targetSelector: '[data-tour="features-section"]',
        title: 'Feature Cards',
        description: 'Explore platform capabilities with interactive cards that respond to your actions.',
        placement: 'top',
      },
      {
        targetSelector: '[data-tour="new-item-button"]',
        title: 'Quick Actions',
        description: 'Create new items instantly with our streamlined dialog interface.',
        placement: 'left',
      },
    ],
  },
  {
    id: 'advancedAnalytics',
    name: 'Advanced Analytics',
    description: 'Unlock deeper insights with advanced charts, cohort analysis, and custom report builder.',
    category: 'analytics',
    tourSteps: [
      {
        targetSelector: '[data-tour="stats-overview"]',
        title: 'Enhanced Metrics',
        description: 'Click any metric card to drill down into detailed analytics.',
        placement: 'bottom',
      },
      {
        targetSelector: '[data-tour="analytics-filters"]',
        title: 'Smart Filters',
        description: 'Filter data by date range, segments, and custom attributes.',
        placement: 'right',
      },
      {
        targetSelector: '[data-tour="export-button"]',
        title: 'Export Reports',
        description: 'Download your data in CSV, PDF, or share live dashboards.',
        placement: 'left',
      },
      {
        targetSelector: '[data-tour="chart-type"]',
        title: 'Visualization Options',
        description: 'Switch between chart types to find the perfect view for your data.',
        placement: 'bottom',
      },
    ],
  },
  {
    id: 'aiAssistant',
    name: 'AI Assistant',
    description: 'Get intelligent suggestions, automated insights, and natural language queries powered by AI.',
    category: 'experimental',
    tourSteps: [
      {
        targetSelector: '[data-tour="ai-input"]',
        title: 'Ask Anything',
        description: 'Type natural language questions like "Show me last month\'s top campaigns".',
        placement: 'bottom',
      },
      {
        targetSelector: '[data-tour="ai-suggestions"]',
        title: 'Smart Suggestions',
        description: 'The AI proactively surfaces insights based on your data patterns.',
        placement: 'right',
      },
      {
        targetSelector: '[data-tour="ai-history"]',
        title: 'Query History',
        description: 'Access your recent queries and save favorites for quick access.',
        placement: 'left',
      },
      {
        targetSelector: '[data-tour="ai-settings"]',
        title: 'Customize AI',
        description: 'Adjust AI behavior, set preferences, and manage data access.',
        placement: 'bottom',
      },
      {
        targetSelector: '[data-tour="ai-feedback"]',
        title: 'Improve Results',
        description: 'Rate responses to help the AI learn your preferences over time.',
        placement: 'top',
      },
    ],
  },
]

export const FEATURE_FLAG_MAP: Record<FeatureFlagId, FeatureFlag> = FEATURE_FLAGS.reduce(
  (acc, flag) => ({ ...acc, [flag.id]: flag }),
  {} as Record<FeatureFlagId, FeatureFlag>
)

export const DEFAULT_PREFERENCE: FeaturePreference = {
  enabled: false,
  dismissedBanner: false,
  remindLaterUntil: null,
  tourCompleted: false,
  feedbackGiven: null,
  feedbackText: null,
}

export const DEFAULT_PREFERENCES: FeaturePreferences = FEATURE_FLAGS.reduce(
  (acc, flag) => ({ ...acc, [flag.id]: { ...DEFAULT_PREFERENCE } }),
  {} as FeaturePreferences
)

export const REMIND_LATER_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours

export function getCategoryLabel(category: FeatureFlag['category']): string {
  const labels: Record<FeatureFlag['category'], string> = {
    ui: 'User Interface',
    analytics: 'Analytics',
    experimental: 'Experimental',
  }
  return labels[category]
}

export function getCategoryColor(category: FeatureFlag['category']): 'default' | 'secondary' | 'destructive' | 'outline' {
  const colors: Record<FeatureFlag['category'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
    ui: 'default',
    analytics: 'secondary',
    experimental: 'outline',
  }
  return colors[category]
}
