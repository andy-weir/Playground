import { ReactNode } from 'react'
import { AppLayout } from '@/components/layout'
import Home from '@/pages/Home'
import UsabilityConcepts from '@/pages/UsabilityConcepts'
import FeatureOptIn from '@/pages/FeatureOptIn'
import GdprConsentDemo from '@/pages/GdprConsentDemo'
import GdprConsentDemoV2 from '@/pages/GdprConsentDemoV2'
import FeathrIA from '@/pages/feathr-ia/FeathrIA'

export interface Prototype {
  slug: string
  title: string
  description: string
  branch: string
  createdAt: string
  mergedAt?: string
  author: string
  prNumber?: number
  render: () => ReactNode
}

export const prototypes: Prototype[] = [
  {
    slug: 'navigation',
    title: 'Navigation',
    description:
      'Sidebar IA with accordion groups, project favoriting, breadcrumbs, command palette, account switcher, and a Create dropdown. Includes the create project dialog and full-screen campaign wizard with redesigned stepper.',
    branch: 'feature/create-project-and-campaign-wizard',
    createdAt: '2026-04-28',
    mergedAt: '2026-04-28',
    author: 'Andy',
    prNumber: 5,
    render: () => (
      <AppLayout>
        <Home />
      </AppLayout>
    ),
  },
  {
    slug: 'usability-concepts',
    title: 'Usability Concepts',
    description:
      'Four IA variations rendered side-by-side via a runtime concept switcher: current navigation (baseline), task-based flat nav with project as filter, progressive (adapts to new vs mature users), and a simplified hybrid. Use the floating switcher in the bottom-right to toggle between concepts.',
    branch: 'usability-concept-prototype',
    createdAt: '2026-04-28',
    mergedAt: '2026-04-28',
    author: 'Andy',
    prNumber: 8,
    render: () => <UsabilityConcepts />,
  },
  {
    slug: 'feature-opt-in',
    title: 'Feature Opt-In',
    description:
      'Discoverable, reversible "try the new experience" UX patterns: experience bar, opt-in banner, sidebar opt-in, labs settings sheet, and feedback dialog. Use the floating prototype control panel in the bottom-right to toggle individual feature flags and preview each pattern.',
    branch: 'aw/feature-opt-in',
    createdAt: '2026-04-28',
    mergedAt: '2026-04-28',
    author: 'Andy',
    prNumber: 10,
    render: () => <FeatureOptIn />,
  },
  {
    slug: 'gdpr-email-consent',
    title: 'GDPR Email Consent',
    description:
      'Form builder pattern for GDPR-compliant email consent: toggle the consent checkbox on/off, edit consent copy, and require consent for submission. Live preview shows how the form appears to supporters with conditional rendering, validation, and inline error messaging.',
    branch: 'aw/gdpr-email-consent',
    createdAt: '2026-04-28',
    mergedAt: '2026-04-28',
    author: 'Andy',
    prNumber: 11,
    render: () => (
      <AppLayout>
        <GdprConsentDemo />
      </AppLayout>
    ),
  },
  {
    slug: 'gdpr-email-consent-v2',
    title: 'GDPR Email Consent v2',
    description:
      'Iteration on the GDPR email consent prototype. Duplicated from v1 as a starting point — ready to evolve with new ideas.',
    branch: 'aw/gdpr-email-consent-v2',
    createdAt: '2026-04-28',
    author: 'Andy',
    render: () => (
      <AppLayout>
        <GdprConsentDemoV2 />
      </AppLayout>
    ),
  },
  {
    slug: 'feathr-ia',
    title: 'Feathr IA — Proposed',
    description:
      'Interactive prototype of the proposed task-based flat IA. Click through the nav to explore depth, scent, and grouping at each level. Includes a tree-test mode for usability testing.',
    branch: 'aw/feathr-ia-overhaul',
    createdAt: '2026-04-29',
    author: 'Andy',
    render: () => <FeathrIA />,
  },
]

export function getPrototype(slug: string): Prototype | undefined {
  return prototypes.find((p) => p.slug === slug)
}
