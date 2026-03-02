import { Sparkles, ChevronDown, X, Clock, XCircle } from 'lucide-react'
import { AnimatePresence, motion } from '@/components/motion'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useOptInBanner } from '@/hooks/use-feature-flag'
import type { FeatureFlagId } from '@/types/feature-flags'

interface OptInBannerProps {
  featureId: FeatureFlagId
}

export function OptInBanner({ featureId }: OptInBannerProps) {
  const { feature, shouldShow, dismiss, enable } = useOptInBanner(featureId)

  const handleTryIt = () => {
    enable()
  }

  const handleRemindLater = () => {
    dismiss(false)
  }

  const handleDontShowAgain = () => {
    dismiss(true)
  }

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="overflow-hidden"
        >
          <div className="flex items-center gap-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10"
            >
              <Sparkles className="h-5 w-5 text-primary" />
            </motion.div>

            <div className="flex-1 min-w-0">
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="font-medium"
              >
                {feature.name} is now available
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-muted-foreground line-clamp-1"
              >
                {feature.description}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="flex items-center gap-2 shrink-0"
            >
              <Button size="sm" onClick={handleTryIt}>
                Try it
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronDown className="h-4 w-4" />
                    <span className="sr-only">Dismiss options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleRemindLater}>
                    <Clock className="mr-2 h-4 w-4" />
                    Remind me later
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDontShowAgain}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Don't show again
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleRemindLater}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
