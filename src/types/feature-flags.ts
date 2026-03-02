export type FeatureFlagId = 'newDashboard' | 'advancedAnalytics' | 'aiAssistant'

export type FeatureCategory = 'ui' | 'analytics' | 'experimental'

export interface TourStepConfig {
  targetSelector: string
  title: string
  description: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

export interface FeatureFlag {
  id: FeatureFlagId
  name: string
  description: string
  category: FeatureCategory
  tourSteps: TourStepConfig[]
}

export interface FeaturePreference {
  enabled: boolean
  dismissedBanner: boolean
  remindLaterUntil: number | null
  tourCompleted: boolean
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
  activeTour: FeatureFlagId | null
  activeTourStep: number
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
  startTour: (id: FeatureFlagId) => void
  nextTourStep: () => void
  prevTourStep: () => void
  skipTour: () => void
  completeTour: () => void
  submitFeedback: (id: FeatureFlagId, rating: 'up' | 'down', text?: string) => void
  resetAllPreferences: () => void
  enableAllFeatures: () => void
  disableAllFeatures: () => void
}
