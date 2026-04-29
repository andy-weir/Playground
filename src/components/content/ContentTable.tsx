import { useState, Fragment } from 'react'
import { ChevronRight, FolderKanban, MoreHorizontal, Pencil, Copy, Trash2, Archive, Type } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { ContentTab, EmailTemplate, Creative, ContentForm } from '@/lib/contentTypes'
import {
  templateTypeConfigs,
  templateGroupConfigs,
  creativeFileTypeConfigs,
  formStatusConfigs,
} from '@/lib/contentTypes'
import type { ContentColumnDef } from '@/lib/contentColumnConfig'
import { getProjectNameForContent } from '@/data/sampleContent'

type ContentItem = EmailTemplate | Creative | ContentForm

interface ContentTableProps {
  contentType: ContentTab
  items: ContentItem[]
  groupByProject: boolean
  visibleColumns: ContentColumnDef[]
}

function formatNumber(value: number | undefined): string {
  if (value === undefined || value === null) return '—'
  if (value === 0) return '0'
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`
  return value.toLocaleString()
}

function formatPercent(value: number | undefined): string {
  if (value === undefined || value === null) return '—'
  return `${value}%`
}

function formatFileSize(kb: number): string {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`
  return `${kb} KB`
}

function TypePill({ config }: { config: { label: string; bgClass: string; textClass: string } }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', config.bgClass, config.textClass)}>
      {config.label}
    </span>
  )
}

function getCellValue(item: ContentItem, columnId: string, contentType: ContentTab): React.ReactNode {
  switch (contentType) {
    case 'templates': {
      const t = item as EmailTemplate
      switch (columnId) {
        case 'name': return t.name
        case 'type': return <TypePill config={templateTypeConfigs[t.type]} />
        case 'group': return <TypePill config={templateGroupConfigs[t.group]} />
        case 'project': return getProjectNameForContent(t.projectId)
        case 'lastUpdated': return t.lastUpdated
        case 'createdDate': return t.createdDate
        default: return '—'
      }
    }
    case 'creatives': {
      const c = item as Creative
      switch (columnId) {
        case 'name': return c.name
        case 'fileType': return <TypePill config={creativeFileTypeConfigs[c.fileType]} />
        case 'dimensions': return <span className="font-mono text-xs">{c.dimensions}</span>
        case 'project': return getProjectNameForContent(c.projectId)
        case 'campaign': return c.campaignName || '—'
        case 'status': return <TypePill config={formStatusConfigs[c.status as keyof typeof formStatusConfigs]} />
        case 'lastUpdated': return c.lastUpdated
        case 'fileSize': return formatFileSize(c.fileSizeKb)
        case 'createdDate': return c.createdDate
        default: return '—'
      }
    }
    case 'forms': {
      const f = item as ContentForm
      switch (columnId) {
        case 'name': return f.name
        case 'project': return getProjectNameForContent(f.projectId)
        case 'status': return <TypePill config={formStatusConfigs[f.status]} />
        case 'formViews': return formatNumber(f.formViews)
        case 'submissions': return formatNumber(f.submissions)
        case 'submissionRate': return formatPercent(f.submissionRate)
        case 'lastUpdated': return f.lastUpdated
        case 'createdDate': return f.createdDate
        default: return '—'
      }
    }
  }
}

function getProjectId(item: ContentItem): string | null {
  if ('projectId' in item) return item.projectId
  return null
}

function ContextMenu({ contentType, itemName }: { contentType: ContentTab; itemName: string }) {
  const [open, setOpen] = useState(false)

  const actions = (() => {
    switch (contentType) {
      case 'templates':
        return [
          { label: 'Edit', icon: Pencil, action: () => toast.success(`Opened "${itemName}" for editing.`) },
          { label: 'Duplicate', icon: Copy, action: () => toast.success(`Duplicated "${itemName}".`) },
          { label: 'Delete', icon: Trash2, action: () => toast.success(`Deleted "${itemName}".`), destructive: true },
        ]
      case 'creatives':
        return [
          { label: 'Duplicate to project', icon: Copy, action: () => toast.success(`Duplicated "${itemName}".`) },
          { label: 'Archive', icon: Archive, action: () => toast.success(`Archived "${itemName}".`) },
          { label: 'Delete', icon: Trash2, action: () => toast.success(`Deleted "${itemName}".`), destructive: true },
        ]
      case 'forms':
        return [
          { label: 'Edit', icon: Pencil, action: () => toast.success(`Opened "${itemName}" for editing.`) },
          { label: 'Rename', icon: Type, action: () => toast.success(`Renamed "${itemName}".`) },
          { label: 'Duplicate to project', icon: Copy, action: () => toast.success(`Duplicated "${itemName}".`) },
          { label: 'Delete', icon: Trash2, action: () => toast.success(`Deleted "${itemName}".`), destructive: true },
        ]
    }
  })()

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
        className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-border bg-popover py-1 shadow-lg">
            {actions.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.label}
                  onClick={(e) => {
                    e.stopPropagation()
                    action.action()
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 px-3 py-1.5 text-sm transition-colors',
                    'destructive' in action && action.destructive
                      ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {action.label}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function ProjectGroupHeader({
  projectName,
  count,
  expanded,
  onToggle,
}: {
  projectName: string
  count: number
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <tr
      className="bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={onToggle}
    >
      <td colSpan={100} className="px-4 py-2">
        <div className="flex items-center gap-2">
          <ChevronRight className={cn('h-4 w-4 text-muted-foreground transition-transform', expanded && 'rotate-90')} />
          <FolderKanban className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{projectName}</span>
          <span className="text-xs text-muted-foreground">({count})</span>
        </div>
      </td>
    </tr>
  )
}

export function ContentTable({ contentType, items, groupByProject, visibleColumns }: ContentTableProps) {
  const [collapsedProjects, setCollapsedProjects] = useState<Set<string | null>>(new Set())

  const toggleProject = (projectId: string | null) => {
    setCollapsedProjects((prev) => {
      const next = new Set(prev)
      const key = projectId ?? '__account__'
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-muted-foreground">No {contentType} found matching your filters.</p>
      </div>
    )
  }

  if (!groupByProject) {
    return (
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {visibleColumns.map((col) => (
                <th key={col.id} className={cn('px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground', col.width)}>
                  {col.label}
                </th>
              ))}
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer">
                {visibleColumns.map((col) => (
                  <td key={col.id} className={cn('px-4 py-2.5', col.width, col.id === 'name' && 'font-medium')}>
                    {getCellValue(item, col.id, contentType)}
                  </td>
                ))}
                <td className="px-2 py-2.5">
                  <ContextMenu contentType={contentType} itemName={item.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Group by project
  const groups = new Map<string | null, ContentItem[]>()
  for (const item of items) {
    const pid = getProjectId(item)
    if (!groups.has(pid)) groups.set(pid, [])
    groups.get(pid)!.push(item)
  }

  // Sort: account-wide first, then alphabetical
  const sortedKeys = [...groups.keys()].sort((a, b) => {
    if (a === null) return -1
    if (b === null) return 1
    return getProjectNameForContent(a).localeCompare(getProjectNameForContent(b))
  })

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {visibleColumns.map((col) => (
              <th key={col.id} className={cn('px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground', col.width)}>
                {col.label}
              </th>
            ))}
            <th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {sortedKeys.map((projectId) => {
            const groupItems = groups.get(projectId)!
            const key = projectId ?? '__account__'
            const collapsed = collapsedProjects.has(key)
            return (
              <Fragment key={key}>
                <ProjectGroupHeader
                  projectName={getProjectNameForContent(projectId)}
                  count={groupItems.length}
                  expanded={!collapsed}
                  onToggle={() => toggleProject(projectId)}
                />
                {!collapsed &&
                  groupItems.map((item) => (
                    <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer">
                      {visibleColumns.map((col) => (
                        <td key={col.id} className={cn('px-4 py-2.5 pl-10', col.width, col.id === 'name' && 'font-medium')}>
                          {getCellValue(item, col.id, contentType)}
                        </td>
                      ))}
                      <td className="px-2 py-2.5">
                        <ContextMenu contentType={contentType} itemName={item.name} />
                      </td>
                    </tr>
                  ))}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
