import { useEffect, useCallback } from 'react'
import { AnimatePresence } from '@/components/motion'
import { TourOverlay } from './TourOverlay'
import { TourStep } from './TourStep'
import { useFeatureFlags } from '@/contexts/FeatureFlagsContext'
import { FEATURE_FLAG_MAP } from '@/lib/feature-flags'

export function FeatureTour() {
  const {
    activeTour,
    activeTourStep,
    nextTourStep,
    prevTourStep,
    skipTour,
    completeTour,
  } = useFeatureFlags()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!activeTour) return

      if (e.key === 'Escape') {
        skipTour()
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        nextTourStep()
      } else if (e.key === 'ArrowLeft') {
        prevTourStep()
      }
    },
    [activeTour, nextTourStep, prevTourStep, skipTour]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (activeTour) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [activeTour])

  if (!activeTour) return null

  const feature = FEATURE_FLAG_MAP[activeTour]
  const totalSteps = feature.tourSteps.length
  const currentStep = feature.tourSteps[activeTourStep]

  if (!currentStep) return null

  const isFirst = activeTourStep === 0
  const isLast = activeTourStep === totalSteps - 1

  const handleNext = () => {
    if (isLast) {
      completeTour()
    } else {
      nextTourStep()
    }
  }

  return (
    <AnimatePresence>
      <TourOverlay key="overlay" targetSelector={currentStep.targetSelector} />
      <TourStep
        key={`step-${activeTourStep}`}
        step={currentStep}
        stepIndex={activeTourStep}
        totalSteps={totalSteps}
        isFirst={isFirst}
        isLast={isLast}
        onNext={handleNext}
        onPrev={prevTourStep}
        onSkip={skipTour}
      />
    </AnimatePresence>
  )
}
