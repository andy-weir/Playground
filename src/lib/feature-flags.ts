import type { FeatureFlag, FeatureFlagId, FeaturePreference, FeaturePreferences } from '@/types/feature-flags'

export const FEATURE_FLAGS: FeatureFlag[] = [
  {
    id: 'newNavigation',
    name: 'New Navigation',
    description: 'Try our redesigned sidebar with grouped sections for faster access.',
    category: 'ui',
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
