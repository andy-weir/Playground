export type TemplateType = 'email' | 'landing-page' | 'invite' | 'monetization'
export type TemplateGroup = 'marketing' | 'fundraising' | 'events' | 'newsletters' | 'transactional'

export interface EmailTemplate {
  id: string
  name: string
  type: TemplateType
  group: TemplateGroup
  projectId: string | null
  lastUpdated: string
  createdDate: string
  thumbnailUrl?: string
}

export type CreativeFileType = 'png' | 'jpg' | 'gif' | 'svg' | 'html5'
export type CreativeStatus = 'active' | 'archived'

export interface Creative {
  id: string
  name: string
  fileType: CreativeFileType
  dimensions: string
  fileSizeKb: number
  projectId: string
  campaignId?: string
  campaignName?: string
  status: CreativeStatus
  createdDate: string
  lastUpdated: string
  thumbnailUrl?: string
}

export type FormStatus = 'active' | 'draft' | 'archived'

export interface ContentForm {
  id: string
  name: string
  projectId: string
  status: FormStatus
  formViews: number
  submissions: number
  submissionRate: number
  lastUpdated: string
  createdDate: string
}

export type ContentTab = 'templates' | 'creatives' | 'forms'

export interface TemplateTypeConfig {
  id: TemplateType
  label: string
  bgClass: string
  textClass: string
}

export const templateTypeConfigs: Record<TemplateType, TemplateTypeConfig> = {
  email: {
    id: 'email',
    label: 'Email',
    bgClass: 'bg-blue-100 dark:bg-blue-950',
    textClass: 'text-blue-700 dark:text-blue-300',
  },
  'landing-page': {
    id: 'landing-page',
    label: 'Landing Page',
    bgClass: 'bg-slate-100 dark:bg-slate-800',
    textClass: 'text-slate-700 dark:text-slate-300',
  },
  invite: {
    id: 'invite',
    label: 'Invite',
    bgClass: 'bg-pink-100 dark:bg-pink-950',
    textClass: 'text-pink-700 dark:text-pink-300',
  },
  monetization: {
    id: 'monetization',
    label: 'Monetization',
    bgClass: 'bg-green-100 dark:bg-green-950',
    textClass: 'text-green-700 dark:text-green-300',
  },
}

export interface TemplateGroupConfig {
  id: TemplateGroup
  label: string
  bgClass: string
  textClass: string
}

export const templateGroupConfigs: Record<TemplateGroup, TemplateGroupConfig> = {
  marketing: {
    id: 'marketing',
    label: 'Marketing',
    bgClass: 'bg-violet-100 dark:bg-violet-950',
    textClass: 'text-violet-700 dark:text-violet-300',
  },
  fundraising: {
    id: 'fundraising',
    label: 'Fundraising',
    bgClass: 'bg-amber-100 dark:bg-amber-950',
    textClass: 'text-amber-700 dark:text-amber-300',
  },
  events: {
    id: 'events',
    label: 'Events',
    bgClass: 'bg-rose-100 dark:bg-rose-950',
    textClass: 'text-rose-700 dark:text-rose-300',
  },
  newsletters: {
    id: 'newsletters',
    label: 'Newsletters',
    bgClass: 'bg-teal-100 dark:bg-teal-950',
    textClass: 'text-teal-700 dark:text-teal-300',
  },
  transactional: {
    id: 'transactional',
    label: 'Transactional',
    bgClass: 'bg-gray-100 dark:bg-gray-800',
    textClass: 'text-gray-600 dark:text-gray-400',
  },
}

export interface CreativeFileTypeConfig {
  id: CreativeFileType
  label: string
  bgClass: string
  textClass: string
}

export const creativeFileTypeConfigs: Record<CreativeFileType, CreativeFileTypeConfig> = {
  png: {
    id: 'png',
    label: 'PNG',
    bgClass: 'bg-emerald-100 dark:bg-emerald-950',
    textClass: 'text-emerald-700 dark:text-emerald-300',
  },
  jpg: {
    id: 'jpg',
    label: 'JPG',
    bgClass: 'bg-amber-100 dark:bg-amber-950',
    textClass: 'text-amber-700 dark:text-amber-300',
  },
  gif: {
    id: 'gif',
    label: 'GIF',
    bgClass: 'bg-purple-100 dark:bg-purple-950',
    textClass: 'text-purple-700 dark:text-purple-300',
  },
  svg: {
    id: 'svg',
    label: 'SVG',
    bgClass: 'bg-cyan-100 dark:bg-cyan-950',
    textClass: 'text-cyan-700 dark:text-cyan-300',
  },
  html5: {
    id: 'html5',
    label: 'HTML5',
    bgClass: 'bg-orange-100 dark:bg-orange-950',
    textClass: 'text-orange-700 dark:text-orange-300',
  },
}

export interface FormStatusConfig {
  id: FormStatus
  label: string
  bgClass: string
  textClass: string
}

export const formStatusConfigs: Record<FormStatus, FormStatusConfig> = {
  active: {
    id: 'active',
    label: 'Active',
    bgClass: 'bg-emerald-100 dark:bg-emerald-950',
    textClass: 'text-emerald-700 dark:text-emerald-300',
  },
  draft: {
    id: 'draft',
    label: 'Draft',
    bgClass: 'bg-gray-100 dark:bg-gray-800',
    textClass: 'text-gray-600 dark:text-gray-400',
  },
  archived: {
    id: 'archived',
    label: 'Archived',
    bgClass: 'bg-red-100 dark:bg-red-950',
    textClass: 'text-red-700 dark:text-red-300',
  },
}

export const allTemplateTypes = Object.values(templateTypeConfigs)
export const allTemplateGroups = Object.values(templateGroupConfigs)
export const allCreativeFileTypes = Object.values(creativeFileTypeConfigs)
export const allFormStatuses = Object.values(formStatusConfigs)
