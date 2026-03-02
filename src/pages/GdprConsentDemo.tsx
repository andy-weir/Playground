import { useState } from 'react'
import { motion } from '@/components/motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { PageHeader } from '@/components/layout'
import { toast } from '@/components/ui/sonner'
import { RotateCcw, Settings, Eye } from 'lucide-react'

const DEFAULT_CONSENT_COPY =
  'I consent to receive marketing emails about events, campaigns, and ways to support.'

export default function GdprConsentDemo() {
  // Builder state
  const [gdprEnabled, setGdprEnabled] = useState(false)
  const [consentCopy, setConsentCopy] = useState(DEFAULT_CONSENT_COPY)
  const [consentRequired, setConsentRequired] = useState(false)

  // Form preview state
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    gdprConsent: false,
  })
  const [touched, setTouched] = useState({
    email: false,
    firstName: false,
    lastName: false,
    gdprConsent: false,
  })

  const handleRestoreDefault = () => {
    setConsentCopy(DEFAULT_CONSENT_COPY)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all fields as touched
    setTouched((prev) => ({
      ...prev,
      email: true,
      firstName: true,
      lastName: true,
      gdprConsent: true,
    }))

    // Validate
    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast.error('Please fill in all required fields')
      return
    }

    if (gdprEnabled && consentRequired && !formData.gdprConsent) {
      toast.error('Please provide consent to continue')
      return
    }

    toast.success('Form submitted successfully!', {
      description: gdprEnabled
        ? `Consent ${formData.gdprConsent ? 'granted' : 'not granted'}`
        : 'GDPR consent not required',
    })
  }

  const isFormValid =
    formData.email &&
    formData.firstName &&
    formData.lastName &&
    (!gdprEnabled || !consentRequired || formData.gdprConsent)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="GDPR Email Consent"
        breadcrumbs={[
          { label: 'Home', href: '#' },
          { label: 'Demos' },
          { label: 'GDPR Email Consent' },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Builder Panel */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Form Builder Settings</CardTitle>
              </div>
              <CardDescription>
                Configure GDPR email consent options in the Design tab
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* GDPR Enable Toggle */}
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="gdpr-toggle" className="text-base font-medium">
                      GDPR email consent
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Show a consent checkbox for email communications on the form
                    </p>
                  </div>
                  <Switch
                    id="gdpr-toggle"
                    checked={gdprEnabled}
                    onCheckedChange={setGdprEnabled}
                  />
                </div>
              </div>

              {/* Conditional settings when enabled */}
              {gdprEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {/* Consent Copy Input */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="consent-copy">Consent checkbox copy</Label>
                      {consentCopy !== DEFAULT_CONSENT_COPY && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRestoreDefault}
                          className="h-auto px-2 py-1 text-xs text-primary"
                        >
                          <RotateCcw className="mr-1 h-3 w-3" />
                          Restore default
                        </Button>
                      )}
                    </div>
                    <Input
                      id="consent-copy"
                      value={consentCopy}
                      onChange={(e) => setConsentCopy(e.target.value)}
                      placeholder={DEFAULT_CONSENT_COPY}
                    />
                  </div>

                  {/* Require Consent Toggle */}
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="required-toggle" className="text-base font-medium">
                          Require consent
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Supporters must check this box to submit the form
                        </p>
                      </div>
                      <Switch
                        id="required-toggle"
                        checked={consentRequired}
                        onCheckedChange={setConsentRequired}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Form Preview Panel */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Form Preview</CardTitle>
              </div>
              <CardDescription>How the form appears to supporters</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="preview-email">
                    Email <span className="text-muted-foreground">(required)</span>
                  </Label>
                  <Input
                    id="preview-email"
                    type="email"
                    placeholder="you@example.org"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                    className={
                      touched.email && !formData.email ? 'border-destructive' : ''
                    }
                  />
                  {touched.email && !formData.email && (
                    <p className="text-sm text-destructive">Email is required</p>
                  )}
                </div>

                {/* First Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="preview-first-name">
                    First name <span className="text-muted-foreground">(required)</span>
                  </Label>
                  <Input
                    id="preview-first-name"
                    placeholder="Jane"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                    onBlur={() => setTouched((prev) => ({ ...prev, firstName: true }))}
                    className={
                      touched.firstName && !formData.firstName ? 'border-destructive' : ''
                    }
                  />
                  {touched.firstName && !formData.firstName && (
                    <p className="text-sm text-destructive">First name is required</p>
                  )}
                </div>

                {/* Last Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="preview-last-name">
                    Last name <span className="text-muted-foreground">(required)</span>
                  </Label>
                  <Input
                    id="preview-last-name"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                    onBlur={() => setTouched((prev) => ({ ...prev, lastName: true }))}
                    className={
                      touched.lastName && !formData.lastName ? 'border-destructive' : ''
                    }
                  />
                  {touched.lastName && !formData.lastName && (
                    <p className="text-sm text-destructive">Last name is required</p>
                  )}
                </div>

                {/* GDPR Consent Checkbox */}
                {gdprEnabled && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-lg border p-4 ${
                      touched.gdprConsent && consentRequired && !formData.gdprConsent
                        ? 'border-destructive bg-destructive/5'
                        : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="gdpr-consent"
                        checked={formData.gdprConsent}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({ ...prev, gdprConsent: checked === true }))
                        }
                        onBlur={() => setTouched((prev) => ({ ...prev, gdprConsent: true }))}
                        className="mt-0.5"
                      />
                      <div className="space-y-1">
                        <Label
                          htmlFor="gdpr-consent"
                          className="text-sm font-normal leading-relaxed cursor-pointer"
                        >
                          {consentCopy}
                          {consentRequired && (
                            <span className="text-muted-foreground"> (required)</span>
                          )}
                        </Label>
                        {touched.gdprConsent && consentRequired && !formData.gdprConsent && (
                          <p className="text-sm text-destructive">
                            You must agree to receive email communications to submit this form
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={!isFormValid}>
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Info Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Implementation Notes</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none text-muted-foreground">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h4 className="font-medium text-foreground">Data Model</h4>
              <ul className="mt-2 list-disc pl-4 text-sm">
                <li>gdprEnabled: boolean</li>
                <li>gdprConsentCopy: string</li>
                <li>gdprConsentRequired: boolean</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground">Validation</h4>
              <ul className="mt-2 list-disc pl-4 text-sm">
                <li>Checkbox unchecked by default (GDPR)</li>
                <li>When required, blocks form submission</li>
                <li>Inline error message on validation fail</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground">Person Record</h4>
              <ul className="mt-2 list-disc pl-4 text-sm">
                <li>gdprConsentGranted: boolean</li>
                <li>gdprConsentTimestamp: Date</li>
                <li>gdprConsentSource: string (Form ID)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
