import { useState } from 'react'
import {
  Wrench,
  Play,
  RotateCcw,
  ToggleLeft,
  ToggleRight,
  Flag,
  Bell,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useFeatureFlags } from '@/contexts/FeatureFlagsContext'
import { FEATURE_FLAGS } from '@/lib/feature-flags'
import type { FeatureFlagId } from '@/types/feature-flags'

export function PrototypeControlPanel() {
  const [open, setOpen] = useState(false)
  const {
    preferences,
    feedbackLog,
    startTour,
    enableAllFeatures,
    disableAllFeatures,
    resetAllPreferences,
    dismissBanner,
  } = useFeatureFlags()

  const handleStartTour = (id: FeatureFlagId) => {
    setOpen(false)
    setTimeout(() => startTour(id), 300)
  }

  const handleTriggerBanner = (id: FeatureFlagId) => {
    dismissBanner(id, false)
    const pref = preferences[id]
    if (pref.enabled) {
      return
    }
    setOpen(false)
  }

  const enabledCount = Object.values(preferences).filter((p) => p.enabled).length
  const totalCount = FEATURE_FLAGS.length

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 left-4 z-50 rounded-full shadow-lg"
        >
          <Wrench className="h-4 w-4" />
          <span className="sr-only">Open prototype controls</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Prototype Controls
          </SheetTitle>
          <SheetDescription>
            Developer tools for testing opt-in UX patterns
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 py-4">
            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={enableAllFeatures}>
                  <ToggleRight className="mr-2 h-4 w-4" />
                  Enable all
                </Button>
                <Button variant="outline" size="sm" onClick={disableAllFeatures}>
                  <ToggleLeft className="mr-2 h-4 w-4" />
                  Disable all
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="col-span-2"
                  onClick={resetAllPreferences}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset all preferences
                </Button>
              </div>
            </div>

            <Separator />

            {/* Feature Status */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Feature Flags</h3>
                <Badge variant="secondary">
                  {enabledCount}/{totalCount} enabled
                </Badge>
              </div>
              <div className="space-y-2">
                {FEATURE_FLAGS.map((feature) => {
                  const pref = preferences[feature.id]
                  return (
                    <Card key={feature.id} className="overflow-hidden">
                      <CardHeader className="py-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">{feature.name}</CardTitle>
                          <Badge variant={pref.enabled ? 'default' : 'outline'}>
                            {pref.enabled ? 'On' : 'Off'}
                          </Badge>
                        </div>
                        <CardDescription className="text-xs">
                          Tour: {pref.tourCompleted ? 'Completed' : 'Not started'} •
                          Feedback: {pref.feedbackGiven || 'None'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="py-2 flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleStartTour(feature.id)}
                          disabled={!pref.enabled}
                        >
                          <Play className="mr-1 h-3 w-3" />
                          Tour
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleTriggerBanner(feature.id)}
                          disabled={pref.enabled}
                        >
                          <Bell className="mr-1 h-3 w-3" />
                          Banner
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            <Separator />

            {/* Feedback Log */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Feedback Log</h3>
                <Badge variant="secondary">{feedbackLog.length} entries</Badge>
              </div>
              {feedbackLog.length === 0 ? (
                <p className="text-sm text-muted-foreground">No feedback submitted yet</p>
              ) : (
                <div className="space-y-2">
                  {feedbackLog.slice().reverse().map((entry, index) => (
                    <Card key={index}>
                      <CardContent className="py-3">
                        <div className="flex items-start gap-2">
                          <Flag className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {FEATURE_FLAGS.find((f) => f.id === entry.featureId)?.name}
                              </span>
                              <Badge variant={entry.rating === 'up' ? 'default' : 'destructive'}>
                                {entry.rating === 'up' ? '👍' : '👎'}
                              </Badge>
                            </div>
                            {entry.text && (
                              <p className="text-xs text-muted-foreground mt-1">{entry.text}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(entry.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
