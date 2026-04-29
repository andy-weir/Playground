import type { ContentTab } from './contentTypes'

export interface ContentColumnDef {
  id: string
  label: string
  width?: string
}

export const templateColumns: ContentColumnDef[] = [
  { id: 'name', label: 'Name' },
  { id: 'type', label: 'Type', width: 'w-[130px]' },
  { id: 'group', label: 'Group', width: 'w-[120px]' },
  { id: 'project', label: 'Project', width: 'w-[150px]' },
  { id: 'lastUpdated', label: 'Last Updated', width: 'w-[120px]' },
  { id: 'createdDate', label: 'Created', width: 'w-[120px]' },
]

export const creativeColumns: ContentColumnDef[] = [
  { id: 'name', label: 'Name' },
  { id: 'fileType', label: 'File Type', width: 'w-[100px]' },
  { id: 'dimensions', label: 'Dimensions', width: 'w-[120px]' },
  { id: 'project', label: 'Project', width: 'w-[150px]' },
  { id: 'campaign', label: 'Campaign', width: 'w-[150px]' },
  { id: 'status', label: 'Status', width: 'w-[100px]' },
  { id: 'lastUpdated', label: 'Last Updated', width: 'w-[120px]' },
  { id: 'fileSize', label: 'File Size', width: 'w-[100px]' },
  { id: 'createdDate', label: 'Created', width: 'w-[120px]' },
]

export const formColumns: ContentColumnDef[] = [
  { id: 'name', label: 'Name' },
  { id: 'project', label: 'Project', width: 'w-[150px]' },
  { id: 'status', label: 'Status', width: 'w-[100px]' },
  { id: 'formViews', label: 'Form Views', width: 'w-[110px]' },
  { id: 'submissions', label: 'Submissions', width: 'w-[120px]' },
  { id: 'submissionRate', label: 'Sub. Rate', width: 'w-[110px]' },
  { id: 'lastUpdated', label: 'Last Updated', width: 'w-[120px]' },
  { id: 'createdDate', label: 'Created', width: 'w-[120px]' },
]

const defaultColumnsMap: Record<ContentTab, string[]> = {
  templates: ['name', 'type', 'group', 'project', 'lastUpdated'],
  creatives: ['name', 'fileType', 'dimensions', 'project', 'campaign', 'status'],
  forms: ['name', 'project', 'status', 'formViews', 'submissions', 'submissionRate', 'lastUpdated'],
}

const hiddenColumnsMap: Record<ContentTab, string[]> = {
  templates: ['createdDate'],
  creatives: ['lastUpdated', 'fileSize', 'createdDate'],
  forms: ['createdDate'],
}

const allColumnsMap: Record<ContentTab, ContentColumnDef[]> = {
  templates: templateColumns,
  creatives: creativeColumns,
  forms: formColumns,
}

export function getContentDefaultColumns(tab: ContentTab): string[] {
  return defaultColumnsMap[tab]
}

export function getContentHiddenColumns(tab: ContentTab): ContentColumnDef[] {
  const hiddenIds = hiddenColumnsMap[tab]
  const allCols = allColumnsMap[tab]
  return hiddenIds.map((id) => allCols.find((c) => c.id === id)).filter((c): c is ContentColumnDef => c !== undefined)
}

export function getContentVisibleColumnDefs(tab: ContentTab, visibleIds: string[]): ContentColumnDef[] {
  const allCols = allColumnsMap[tab]
  return visibleIds.map((id) => allCols.find((c) => c.id === id)).filter((c): c is ContentColumnDef => c !== undefined)
}
