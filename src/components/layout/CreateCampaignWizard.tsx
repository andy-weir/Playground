import { useState } from 'react'
import { FileText, ArrowLeft, ArrowRight, Plus, ChevronDown, X } from 'lucide-react'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Stepper, StepperContent } from '@/components/ui/stepper'
import { useNavigation } from './NavigationContext'

interface CreateCampaignWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const WIZARD_STEPS = [
  { id: 'basics', label: 'Basics' },
  { id: 'audience', label: 'Audience' },
  { id: 'content', label: 'Content' },
  { id: 'optimization', label: 'Optimization' },
  { id: 'budget', label: 'Budget' },
  { id: 'goals', label: 'Goals' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'review', label: 'Review' },
]

function StepPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export function CreateCampaignWizard({ open, onOpenChange }: CreateCampaignWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const { activeProject } = useNavigation()

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === WIZARD_STEPS.length - 1

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleStepChange = (step: number) => {
    setCurrentStep(step)
  }

  const handleComplete = () => {
    toast.success('Campaign created successfully')
    setCurrentStep(0)
    onOpenChange(false)
  }

  const handleSaveAndExit = () => {
    toast.success('Draft saved')
    setCurrentStep(0)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) setCurrentStep(0)
      onOpenChange(isOpen)
    }}>
      <DialogContent className="fixed !left-0 !top-0 !translate-x-0 !translate-y-0 !max-w-none w-screen h-screen rounded-none border-0 flex flex-col gap-0 p-0 !duration-0 !animate-none [&>button:last-child]:hidden">
        {/* Minimal Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b bg-background shrink-0">
          {/* Left: Breadcrumb */}
          <div className="flex items-center gap-2 pl-2">
            {activeProject ? (
              <>
                <span className="text-sm text-muted-foreground">{activeProject.name}</span>
                <span className="text-muted-foreground">›</span>
              </>
            ) : null}
            <span className="text-sm font-medium">Create Campaign</span>
          </div>

          {/* Right: Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Stepper */}
        <div className="px-6 py-4 border-b bg-muted/30 shrink-0">
          <Stepper
            steps={WIZARD_STEPS}
            currentStep={currentStep}
            onStepChange={handleStepChange}
            action={currentStep === 2 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add creatives
                    <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Upload image</DropdownMenuItem>
                  <DropdownMenuItem>Upload video</DropdownMenuItem>
                  <DropdownMenuItem>Use template</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : undefined}
          />
        </div>

        {/* Content area */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <StepperContent step={0} currentStep={currentStep}>
              <StepPlaceholder
                title="Campaign Basics"
                description="Configure the fundamental settings for your campaign including name, type, and objectives."
              />
            </StepperContent>

            <StepperContent step={1} currentStep={currentStep}>
              <StepPlaceholder
                title="Target Audience"
                description="Define who should see your campaign by selecting segments, demographics, or custom audiences."
              />
            </StepperContent>

            <StepperContent step={2} currentStep={currentStep}>
              <StepPlaceholder
                title="Campaign Content"
                description="Upload creative assets, write copy, and design the visual elements of your campaign."
              />
            </StepperContent>

            <StepperContent step={3} currentStep={currentStep}>
              <StepPlaceholder
                title="Optimization"
                description="Configure optimization settings to improve campaign performance and reach."
              />
            </StepperContent>

            <StepperContent step={4} currentStep={currentStep}>
              <StepPlaceholder
                title="Budget"
                description="Set your daily budget, bid strategy, and spending limits."
              />
            </StepperContent>

            <StepperContent step={5} currentStep={currentStep}>
              <StepPlaceholder
                title="Goals"
                description="Define success metrics and conversion goals for your campaign."
              />
            </StepperContent>

            <StepperContent step={6} currentStep={currentStep}>
              <StepPlaceholder
                title="Schedule"
                description="Set your campaign start and end dates, and configure delivery timing."
              />
            </StepperContent>

            <StepperContent step={7} currentStep={currentStep}>
              <StepPlaceholder
                title="Review & Launch"
                description="Review all campaign settings and launch when ready. You can also save as draft."
              />
            </StepperContent>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-background shrink-0">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Button variant="ghost" onClick={handleSaveAndExit}>
              Save draft & exit
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isFirstStep}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              {isLastStep ? (
                <Button onClick={handleComplete}>
                  Create campaign
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
