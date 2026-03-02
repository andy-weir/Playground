import { motion } from '@/components/motion'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { useFeatureFlag } from '@/hooks/use-feature-flag'
import { getCategoryLabel, getCategoryColor } from '@/lib/feature-flags'
import type { FeatureFlagId } from '@/types/feature-flags'

interface LabsSettingsToggleProps {
  featureId: FeatureFlagId
}

export function LabsSettingsToggle({ featureId }: LabsSettingsToggleProps) {
  const { feature, isEnabled, toggle } = useFeatureFlag(featureId)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{feature.name}</CardTitle>
                <Badge variant={getCategoryColor(feature.category)}>
                  {getCategoryLabel(feature.category)}
                </Badge>
              </div>
              <CardDescription>{feature.description}</CardDescription>
            </div>
            <Switch checked={isEnabled} onCheckedChange={toggle} />
          </div>
        </CardHeader>
        {isEnabled && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-primary"
          />
        )}
      </Card>
    </motion.div>
  )
}
