import { createContext, useContext, useReducer, useCallback, useEffect, type ReactNode } from 'react'
import type {
  FeatureFlagId,
  FeatureFlagsState,
  FeatureFlagsContextValue,
  FeaturePreferences,
  FeedbackEntry,
} from '@/types/feature-flags'
import {
  FEATURE_FLAG_MAP,
  DEFAULT_PREFERENCES,
  DEFAULT_PREFERENCE,
  REMIND_LATER_DURATION_MS,
} from '@/lib/feature-flags'
import { getStorageItem, setStorageItem } from '@/lib/storage'

const STORAGE_KEY = 'feature_flags'
const FEEDBACK_KEY = 'feature_feedback'

type Action =
  | { type: 'SET_ENABLED'; id: FeatureFlagId; enabled: boolean }
  | { type: 'DISMISS_BANNER'; id: FeatureFlagId; permanently: boolean }
  | { type: 'START_TOUR'; id: FeatureFlagId }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SKIP_TOUR' }
  | { type: 'COMPLETE_TOUR' }
  | { type: 'SUBMIT_FEEDBACK'; id: FeatureFlagId; rating: 'up' | 'down'; text?: string }
  | { type: 'RESET_ALL' }
  | { type: 'SET_ALL_ENABLED'; enabled: boolean }

function reducer(state: FeatureFlagsState, action: Action): FeatureFlagsState {
  switch (action.type) {
    case 'SET_ENABLED': {
      const newPreferences = {
        ...state.preferences,
        [action.id]: {
          ...state.preferences[action.id],
          enabled: action.enabled,
        },
      }
      return {
        ...state,
        preferences: newPreferences,
        activeTour: action.enabled && !state.preferences[action.id].tourCompleted ? action.id : state.activeTour,
        activeTourStep: action.enabled && !state.preferences[action.id].tourCompleted ? 0 : state.activeTourStep,
      }
    }

    case 'DISMISS_BANNER': {
      return {
        ...state,
        preferences: {
          ...state.preferences,
          [action.id]: {
            ...state.preferences[action.id],
            dismissedBanner: action.permanently,
            remindLaterUntil: action.permanently ? null : Date.now() + REMIND_LATER_DURATION_MS,
          },
        },
      }
    }

    case 'START_TOUR': {
      return {
        ...state,
        activeTour: action.id,
        activeTourStep: 0,
      }
    }

    case 'NEXT_STEP': {
      if (!state.activeTour) return state
      const totalSteps = FEATURE_FLAG_MAP[state.activeTour].tourSteps.length
      if (state.activeTourStep >= totalSteps - 1) {
        return {
          ...state,
          preferences: {
            ...state.preferences,
            [state.activeTour]: {
              ...state.preferences[state.activeTour],
              tourCompleted: true,
            },
          },
          activeTour: null,
          activeTourStep: 0,
        }
      }
      return {
        ...state,
        activeTourStep: state.activeTourStep + 1,
      }
    }

    case 'PREV_STEP': {
      if (!state.activeTour || state.activeTourStep <= 0) return state
      return {
        ...state,
        activeTourStep: state.activeTourStep - 1,
      }
    }

    case 'SKIP_TOUR':
    case 'COMPLETE_TOUR': {
      if (!state.activeTour) return state
      return {
        ...state,
        preferences: {
          ...state.preferences,
          [state.activeTour]: {
            ...state.preferences[state.activeTour],
            tourCompleted: true,
          },
        },
        activeTour: null,
        activeTourStep: 0,
      }
    }

    case 'SUBMIT_FEEDBACK': {
      const entry: FeedbackEntry = {
        featureId: action.id,
        rating: action.rating,
        text: action.text || null,
        timestamp: Date.now(),
      }
      return {
        ...state,
        preferences: {
          ...state.preferences,
          [action.id]: {
            ...state.preferences[action.id],
            feedbackGiven: action.rating,
            feedbackText: action.text || null,
          },
        },
        feedbackLog: [...state.feedbackLog, entry],
      }
    }

    case 'RESET_ALL': {
      return {
        preferences: DEFAULT_PREFERENCES,
        activeTour: null,
        activeTourStep: 0,
        feedbackLog: [],
      }
    }

    case 'SET_ALL_ENABLED': {
      const newPreferences = Object.keys(state.preferences).reduce((acc, key) => {
        const id = key as FeatureFlagId
        return {
          ...acc,
          [id]: {
            ...state.preferences[id],
            enabled: action.enabled,
          },
        }
      }, {} as FeaturePreferences)
      return {
        ...state,
        preferences: newPreferences,
      }
    }

    default:
      return state
  }
}

function getInitialState(): FeatureFlagsState {
  const savedPreferences = getStorageItem<Partial<FeaturePreferences>>(STORAGE_KEY, {})
  const savedFeedback = getStorageItem<FeedbackEntry[]>(FEEDBACK_KEY, [])

  const preferences = Object.keys(DEFAULT_PREFERENCES).reduce((acc, key) => {
    const id = key as FeatureFlagId
    return {
      ...acc,
      [id]: {
        ...DEFAULT_PREFERENCE,
        ...savedPreferences[id],
      },
    }
  }, {} as FeaturePreferences)

  return {
    preferences,
    activeTour: null,
    activeTourStep: 0,
    feedbackLog: savedFeedback,
  }
}

const FeatureFlagsContext = createContext<FeatureFlagsContextValue | null>(null)

export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, getInitialState)

  useEffect(() => {
    setStorageItem(STORAGE_KEY, state.preferences)
  }, [state.preferences])

  useEffect(() => {
    setStorageItem(FEEDBACK_KEY, state.feedbackLog)
  }, [state.feedbackLog])

  const getFeature = useCallback((id: FeatureFlagId) => FEATURE_FLAG_MAP[id], [])

  const isEnabled = useCallback((id: FeatureFlagId) => state.preferences[id].enabled, [state.preferences])

  const enableFeature = useCallback((id: FeatureFlagId) => {
    dispatch({ type: 'SET_ENABLED', id, enabled: true })
  }, [])

  const disableFeature = useCallback((id: FeatureFlagId) => {
    dispatch({ type: 'SET_ENABLED', id, enabled: false })
  }, [])

  const toggleFeature = useCallback(
    (id: FeatureFlagId) => {
      dispatch({ type: 'SET_ENABLED', id, enabled: !state.preferences[id].enabled })
    },
    [state.preferences]
  )

  const dismissBanner = useCallback((id: FeatureFlagId, permanently: boolean) => {
    dispatch({ type: 'DISMISS_BANNER', id, permanently })
  }, [])

  const shouldShowBanner = useCallback(
    (id: FeatureFlagId) => {
      const pref = state.preferences[id]
      if (pref.enabled) return false
      if (pref.dismissedBanner) return false
      if (pref.remindLaterUntil && Date.now() < pref.remindLaterUntil) return false
      return true
    },
    [state.preferences]
  )

  const startTour = useCallback((id: FeatureFlagId) => {
    dispatch({ type: 'START_TOUR', id })
  }, [])

  const nextTourStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' })
  }, [])

  const prevTourStep = useCallback(() => {
    dispatch({ type: 'PREV_STEP' })
  }, [])

  const skipTour = useCallback(() => {
    dispatch({ type: 'SKIP_TOUR' })
  }, [])

  const completeTour = useCallback(() => {
    dispatch({ type: 'COMPLETE_TOUR' })
  }, [])

  const submitFeedback = useCallback((id: FeatureFlagId, rating: 'up' | 'down', text?: string) => {
    dispatch({ type: 'SUBMIT_FEEDBACK', id, rating, text })
  }, [])

  const resetAllPreferences = useCallback(() => {
    dispatch({ type: 'RESET_ALL' })
  }, [])

  const enableAllFeatures = useCallback(() => {
    dispatch({ type: 'SET_ALL_ENABLED', enabled: true })
  }, [])

  const disableAllFeatures = useCallback(() => {
    dispatch({ type: 'SET_ALL_ENABLED', enabled: false })
  }, [])

  const value: FeatureFlagsContextValue = {
    ...state,
    getFeature,
    isEnabled,
    enableFeature,
    disableFeature,
    toggleFeature,
    dismissBanner,
    shouldShowBanner,
    startTour,
    nextTourStep,
    prevTourStep,
    skipTour,
    completeTour,
    submitFeedback,
    resetAllPreferences,
    enableAllFeatures,
    disableAllFeatures,
  }

  return <FeatureFlagsContext.Provider value={value}>{children}</FeatureFlagsContext.Provider>
}

export function useFeatureFlags(): FeatureFlagsContextValue {
  const context = useContext(FeatureFlagsContext)
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider')
  }
  return context
}
