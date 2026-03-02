import { useEffect, useState } from 'react'
import { motion } from '@/components/motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { TourStepConfig } from '@/types/feature-flags'

interface TourStepProps {
  step: TourStepConfig
  stepIndex: number
  totalSteps: number
  isFirst: boolean
  isLast: boolean
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
}

interface Position {
  top: number
  left: number
}

export function TourStep({
  step,
  stepIndex,
  totalSteps,
  isFirst,
  isLast,
  onNext,
  onPrev,
  onSkip,
}: TourStepProps) {
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 })

  useEffect(() => {
    const updatePosition = () => {
      const element = document.querySelector(step.targetSelector)
      if (!element) {
        setPosition({ top: window.innerHeight / 2, left: window.innerWidth / 2 })
        return
      }

      const rect = element.getBoundingClientRect()
      const tooltipWidth = 320
      const tooltipHeight = 180
      const gap = 16

      let top = 0
      let left = 0

      switch (step.placement) {
        case 'top':
          top = rect.top - tooltipHeight - gap
          left = rect.left + rect.width / 2 - tooltipWidth / 2
          break
        case 'bottom':
          top = rect.bottom + gap
          left = rect.left + rect.width / 2 - tooltipWidth / 2
          break
        case 'left':
          top = rect.top + rect.height / 2 - tooltipHeight / 2
          left = rect.left - tooltipWidth - gap
          break
        case 'right':
          top = rect.top + rect.height / 2 - tooltipHeight / 2
          left = rect.right + gap
          break
        default:
          top = rect.bottom + gap
          left = rect.left + rect.width / 2 - tooltipWidth / 2
      }

      top = Math.max(16, Math.min(top, window.innerHeight - tooltipHeight - 16))
      left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16))

      setPosition({ top, left })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [step.targetSelector, step.placement])

  const progress = ((stepIndex + 1) / totalSteps) * 100

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1, ...position }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ position: 'fixed', zIndex: 51, width: 320 }}
    >
      <Card className="shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{step.title}</CardTitle>
            <span className="text-xs text-muted-foreground">
              {stepIndex + 1} of {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-1" />
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-sm text-muted-foreground">{step.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={onSkip}>
            Skip tour
          </Button>
          <div className="flex gap-2">
            {!isFirst && (
              <Button variant="outline" size="sm" onClick={onPrev}>
                Back
              </Button>
            )}
            <Button size="sm" onClick={onNext}>
              {isLast ? 'Done' : 'Next'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
