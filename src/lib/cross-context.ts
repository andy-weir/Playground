import { allNavigationItems } from '@/components/layout/navigation'

/**
 * Cross-context link mappings for quick navigation between related sections.
 * Keys are section IDs, values are arrays of related section IDs.
 */
export const crossContextLinks: Record<string, string[]> = {
  marketing: ['community'],
  projects: ['community'],
  community: ['projects', 'marketing'],
}

/**
 * Get the display label for a section ID
 */
export function getSectionLabel(sectionId: string): string {
  const item = allNavigationItems.find((nav) => nav.id === sectionId)
  return item?.title ?? sectionId
}

/**
 * Get related sections for a given section ID
 */
export function getRelatedSections(sectionId: string): string[] {
  return crossContextLinks[sectionId] ?? []
}
