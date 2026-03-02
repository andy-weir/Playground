import { useFeatureFlags } from '@/contexts/FeatureFlagsContext'
import type { FeatureFlagId } from '@/types/feature-flags'

export function useFeatureFlag(id: FeatureFlagId) {
  const { getFeature, isEnabled, enableFeature, disableFeature, toggleFeature } = useFeatureFlags()

  return {
    feature: getFeature(id),
    isEnabled: isEnabled(id),
    enable: () => enableFeature(id),
    disable: () => disableFeature(id),
    toggle: () => toggleFeature(id),
  }
}

export function useOptInBanner(id: FeatureFlagId) {
  const { getFeature, shouldShowBanner, dismissBanner, enableFeature } = useFeatureFlags()

  return {
    feature: getFeature(id),
    shouldShow: shouldShowBanner(id),
    dismiss: (permanently: boolean) => dismissBanner(id, permanently),
    enable: () => enableFeature(id),
  }
}

export function useFeatureFeedback(id: FeatureFlagId) {
  const { preferences, submitFeedback } = useFeatureFlags()
  const pref = preferences[id]

  return {
    feedbackGiven: pref.feedbackGiven,
    feedbackText: pref.feedbackText,
    submit: (rating: 'up' | 'down', text?: string) => submitFeedback(id, rating, text),
  }
}
