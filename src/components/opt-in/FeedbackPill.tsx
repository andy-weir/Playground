import { useState } from 'react'
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react'
import { AnimatePresence, motion } from '@/components/motion'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/sonner'
import { FeedbackDialog } from './FeedbackDialog'
import { useFeatureFeedback, useFeatureFlag } from '@/hooks/use-feature-flag'
import type { FeatureFlagId } from '@/types/feature-flags'

interface FeedbackPillProps {
  featureId: FeatureFlagId
}

export function FeedbackPill({ featureId }: FeedbackPillProps) {
  const { isEnabled } = useFeatureFlag(featureId)
  const { feedbackGiven, submit } = useFeatureFeedback(featureId)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pendingRating, setPendingRating] = useState<'up' | 'down' | null>(null)

  if (!isEnabled) return null

  const handleQuickFeedback = (rating: 'up' | 'down') => {
    if (rating === 'down') {
      setPendingRating(rating)
      setDialogOpen(true)
    } else {
      submit(rating)
      toast.success('Thanks for your feedback!', {
        description: "We're glad you're enjoying this feature.",
      })
    }
  }

  const handleDetailedFeedback = (text: string) => {
    if (pendingRating) {
      submit(pendingRating, text)
      toast.success('Thanks for your feedback!', {
        description: "We'll use this to improve the feature.",
      })
      setPendingRating(null)
      setDialogOpen(false)
    }
  }

  const handleOpenDialog = () => {
    setPendingRating(feedbackGiven || 'down')
    setDialogOpen(true)
  }

  return (
    <>
      <AnimatePresence>
        {!feedbackGiven && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-4 right-4 z-40"
          >
            <div className="flex items-center gap-1 rounded-full border bg-background/95 px-3 py-2 shadow-lg backdrop-blur">
              <span className="mr-2 text-sm text-muted-foreground">How's this feature?</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-green-500/10 hover:text-green-500"
                onClick={() => handleQuickFeedback('up')}
              >
                <ThumbsUp className="h-4 w-4" />
                <span className="sr-only">Good</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-red-500/10 hover:text-red-500"
                onClick={() => handleQuickFeedback('down')}
              >
                <ThumbsDown className="h-4 w-4" />
                <span className="sr-only">Not good</span>
              </Button>
            </div>
          </motion.div>
        )}

        {feedbackGiven && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-4 right-4 z-40"
          >
            <Button
              variant="outline"
              size="sm"
              className="rounded-full shadow-lg"
              onClick={handleOpenDialog}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Add more feedback
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <FeedbackDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        featureId={featureId}
        onSubmit={handleDetailedFeedback}
      />
    </>
  )
}
