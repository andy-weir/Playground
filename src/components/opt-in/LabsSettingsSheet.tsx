import { FlaskConical, RotateCcw } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { LabsSettingsToggle } from './LabsSettingsToggle'
import { useFeatureFlags } from '@/contexts/FeatureFlagsContext'
import { FEATURE_FLAGS } from '@/lib/feature-flags'
import type { FeatureCategory } from '@/types/feature-flags'

interface LabsSettingsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CATEGORIES: { key: FeatureCategory; label: string }[] = [
  { key: 'ui', label: 'User Interface' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'experimental', label: 'Experimental' },
]

export function LabsSettingsSheet({ open, onOpenChange }: LabsSettingsSheetProps) {
  const { resetAllPreferences } = useFeatureFlags()

  const featuresByCategory = CATEGORIES.map(({ key, label }) => ({
    category: key,
    label,
    features: FEATURE_FLAGS.filter((f) => f.category === key),
  })).filter((group) => group.features.length > 0)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5" />
            Labs
          </SheetTitle>
          <SheetDescription>
            Try experimental features before they're released. Your feedback helps us improve.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto py-4">
          {featuresByCategory.map(({ category, label, features }) => (
            <div key={category} className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
              <div className="space-y-3">
                {features.map((feature) => (
                  <LabsSettingsToggle
                    key={feature.id}
                    featureId={feature.id}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="pt-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={resetAllPreferences}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset all preferences
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
