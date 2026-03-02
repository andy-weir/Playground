import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useFeatureFlag } from '@/hooks/use-feature-flag'
import type { FeatureFlagId } from '@/types/feature-flags'

interface FeedbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  featureId: FeatureFlagId
  onSubmit: (text: string) => void
}

export function FeedbackDialog({ open, onOpenChange, featureId, onSubmit }: FeedbackDialogProps) {
  const { feature } = useFeatureFlag(featureId)
  const [text, setText] = useState('')

  const handleSubmit = () => {
    onSubmit(text)
    setText('')
  }

  const handleCancel = () => {
    setText('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Share your feedback
          </DialogTitle>
          <DialogDescription>
            Help us improve <strong>{feature.name}</strong> by sharing what's working and what isn't.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Textarea
            placeholder="What would make this feature better for you?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!text.trim()}>
            Submit feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
