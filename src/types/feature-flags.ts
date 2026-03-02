export type FeatureFlagId = 'newNavigation'

export type FeatureCategory = 'ui' | 'analytics' | 'experimental'

export interface FeatureFlag {
  id: FeatureFlagId
  name: string
  description: string
  category: FeatureCategory
}

export interface FeaturePreference {
  enabled: boolean
  dismissedBanner: boolean
  remindLaterUntil: number | null
  feedbackGiven: 'up' | 'down' | null
  feedbackText: string | null
}

export type FeaturePreferences = Record<FeatureFlagId, FeaturePreference>

export interface FeedbackEntry {
  featureId: FeatureFlagId
  rating: 'up' | 'down'
  text: string | null
  timestamp: number
}

export interface FeatureFlagsState {
  preferences: FeaturePreferences
  feedbackLog: FeedbackEntry[]
}

export interface FeatureFlagsContextValue extends FeatureFlagsState {
  getFeature: (id: FeatureFlagId) => FeatureFlag
  isEnabled: (id: FeatureFlagId) => boolean
  enableFeature: (id: FeatureFlagId) => void
  disableFeature: (id: FeatureFlagId) => void
  toggleFeature: (id: FeatureFlagId) => void
  dismissBanner: (id: FeatureFlagId, permanently: boolean) => void
  shouldShowBanner: (id: FeatureFlagId) => boolean
  submitFeedback: (id: FeatureFlagId, rating: 'up' | 'down', text?: string) => void
  resetAllPreferences: () => void
  enableAllFeatures: () => void
  disableAllFeatures: () => void
}
