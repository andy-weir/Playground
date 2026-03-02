import { Sparkles, ThumbsUp, ThumbsDown, Undo2 } from 'lucide-react'
import { toast } from '@/components/ui/sonner'
import { useFeatureFlag, useFeatureFeedback } from '@/hooks/use-feature-flag'
import type { FeatureFlagId } from '@/types/feature-flags'
import { cn } from '@/lib/utils'

interface SidebarFeatureOptInProps {
  featureId: FeatureFlagId
}

export function SidebarFeatureOptIn({ featureId }: SidebarFeatureOptInProps) {
  const { feature, isEnabled, enable, disable } = useFeatureFlag(featureId)
  const { feedbackGiven, submit } = useFeatureFeedback(featureId)

  const handleTryIt = () => {
    enable()
    toast.success(`${feature.name} enabled!`, {
      description: 'You can switch back anytime from the sidebar.',
    })
  }

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
      description: 'You can try the new version again anytime from the sidebar.',
    })
  }

  // Feature is ENABLED - show switch back button with feedback icons
  if (isEnabled) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleSwitchBack}
          className={cn(
            "flex flex-1 items-center gap-2 rounded-md p-2 text-left text-sm outline-none",
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            "focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          )}
        >
          <Undo2 className="h-4 w-4" />
          <span className="truncate">Switch back to classic</span>
        </button>
        {!feedbackGiven && (
          <>
            <button
              onClick={() => handleFeedback('up')}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md outline-none",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "focus-visible:ring-2 focus-visible:ring-sidebar-ring"
              )}
              title="I like this"
            >
              <ThumbsUp className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleFeedback('down')}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md outline-none",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "focus-visible:ring-2 focus-visible:ring-sidebar-ring"
              )}
              title="Not for me"
            >
              <ThumbsDown className="h-4 w-4" />
            </button>
          </>
        )}
        {feedbackGiven && (
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md",
              feedbackGiven === 'up'
                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            )}
            title={feedbackGiven === 'up' ? "You liked this" : "Not for you"}
          >
            {feedbackGiven === 'up' ? (
              <ThumbsUp className="h-4 w-4" />
            ) : (
              <ThumbsDown className="h-4 w-4" />
            )}
          </div>
        )}
      </div>
    )
  }

  // Feature is DISABLED - single click to enable
  return (
    <button
      onClick={handleTryIt}
      className={cn(
        "flex w-full items-center gap-2 rounded-md p-2 text-left text-sm outline-none",
        "bg-primary/10 border border-primary/20",
        "hover:bg-primary/15 hover:border-primary/30",
        "focus-visible:ring-2 focus-visible:ring-sidebar-ring"
      )}
    >
      <Sparkles className="h-4 w-4 text-primary" />
      <span className="flex-1 truncate font-medium">Try New Navigation</span>
    </button>
  )
}
