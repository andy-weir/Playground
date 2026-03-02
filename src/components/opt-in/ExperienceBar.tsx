import { Sparkles, ThumbsUp, ThumbsDown, Undo2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/sonner'
import { useFeatureFlag, useFeatureFeedback } from '@/hooks/use-feature-flag'
import type { FeatureFlagId } from '@/types/feature-flags'
import { cn } from '@/lib/utils'

interface ExperienceBarProps {
  featureId: FeatureFlagId
}

export function ExperienceBar({ featureId }: ExperienceBarProps) {
  const { feature, isEnabled, disable } = useFeatureFlag(featureId)
  const { feedbackGiven, submit } = useFeatureFeedback(featureId)

  if (!isEnabled) return null

  const handleFeedback = (rating: 'up' | 'down') => {
    submit(rating)
    toast.success('Thanks for your feedback!', {
      description: rating === 'up'
        ? "We're glad you're enjoying the new experience."
        : "We'll use your feedback to improve.",
    })
  }

  const handleSwitchBack = () => {
    disable()
    toast.info('Switched back to classic view', {
      description: 'You can try the new version again anytime from Labs settings.',
    })
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-12 items-center justify-between px-4">
        {/* Left: Feature indicator */}
        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">
            Trying the <span className="font-medium text-foreground">{feature.name}</span>
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Feedback buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 w-8 p-0',
                feedbackGiven === 'up' && 'bg-green-100 text-green-600 hover:bg-green-100 hover:text-green-600 dark:bg-green-900/30 dark:text-green-400'
              )}
              onClick={() => handleFeedback('up')}
              disabled={feedbackGiven !== null}
            >
              <ThumbsUp className="h-4 w-4" />
              <span className="sr-only">Like</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 w-8 p-0',
                feedbackGiven === 'down' && 'bg-red-100 text-red-600 hover:bg-red-100 hover:text-red-600 dark:bg-red-900/30 dark:text-red-400'
              )}
              onClick={() => handleFeedback('down')}
              disabled={feedbackGiven !== null}
            >
              <ThumbsDown className="h-4 w-4" />
              <span className="sr-only">Dislike</span>
            </Button>
          </div>

          {/* Separator */}
          <div className="h-4 w-px bg-border" />

          {/* Switch back button */}
          <Button variant="outline" size="sm" onClick={handleSwitchBack}>
            <Undo2 className="mr-2 h-4 w-4" />
            Switch back
          </Button>
        </div>
      </div>
    </div>
  )
}
