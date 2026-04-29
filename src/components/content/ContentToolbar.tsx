import { useState, useRef, useEffect } from 'react'
import { Search, SlidersHorizontal, FolderKanban, Columns3, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ContentTab, TemplateType, TemplateGroup, CreativeFileType, CreativeStatus, FormStatus } from '@/lib/contentTypes'
import {
  allTemplateTypes,
  allTemplateGroups,
  allCreativeFileTypes,
  formStatusConfigs,
} from '@/lib/contentTypes'
import { sampleProjectInfos } from '@/data/sampleCampaigns'
import type { ContentColumnDef } from '@/lib/contentColumnConfig'

export interface ContentFilters {
  templateTypes: TemplateType[]
  templateGroups: TemplateGroup[]
  creativeFileTypes: CreativeFileType[]
  creativeStatuses: CreativeStatus[]
  formStatuses: FormStatus[]
  projectIds: (string | null)[]
}

export const emptyFilters: ContentFilters = {
  templateTypes: [],
  templateGroups: [],
  creativeFileTypes: [],
  creativeStatuses: [],
  formStatuses: [],
  projectIds: [],
}

interface ContentToolbarProps {
  contentType: ContentTab
  searchQuery: string
  onSearchChange: (query: string) => void
  filters: ContentFilters
  onFiltersChange: (filters: ContentFilters) => void
  groupByProject: boolean
  onGroupByProjectToggle: () => void
  hiddenColumns: ContentColumnDef[]
  visibleColumnIds: string[]
  onToggleColumn: (columnId: string) => void
}

function FilterPopover({
  contentType,
  filters,
  onFiltersChange,
}: {
  contentType: ContentTab
  filters: ContentFilters
  onFiltersChange: (filters: ContentFilters) => void
}) {
  const [open, setOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const activeFilterCount = (() => {
    switch (contentType) {
      case 'templates':
        return filters.templateTypes.length + filters.templateGroups.length + filters.projectIds.length
      case 'creatives':
        return filters.creativeFileTypes.length + filters.creativeStatuses.length + filters.projectIds.length
      case 'forms':
        return filters.formStatuses.length + filters.projectIds.length
    }
  })()

  const toggleArrayItem = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          open || activeFilterCount > 0
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        )}
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {activeFilterCount > 0 && (
          <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-foreground/20 px-1.5 text-xs font-semibold">
            {activeFilterCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-2 w-80 rounded-lg border border-border bg-popover p-4 shadow-lg">
          {contentType === 'templates' && (
            <>
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</span>
                  {filters.templateTypes.length > 0 && (
                    <button
                      onClick={() => onFiltersChange({ ...filters, templateTypes: [] })}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {allTemplateTypes.map((config) => (
                    <button
                      key={config.id}
                      onClick={() => onFiltersChange({ ...filters, templateTypes: toggleArrayItem(filters.templateTypes, config.id) })}
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                        filters.templateTypes.includes(config.id)
                          ? `${config.bgClass} ${config.textClass}`
                          : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                      )}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4 h-px bg-border" />
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Group</span>
                  {filters.templateGroups.length > 0 && (
                    <button
                      onClick={() => onFiltersChange({ ...filters, templateGroups: [] })}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {allTemplateGroups.map((config) => (
                    <button
                      key={config.id}
                      onClick={() => onFiltersChange({ ...filters, templateGroups: toggleArrayItem(filters.templateGroups, config.id) })}
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                        filters.templateGroups.includes(config.id)
                          ? `${config.bgClass} ${config.textClass}`
                          : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                      )}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {contentType === 'creatives' && (
            <>
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">File Type</span>
                  {filters.creativeFileTypes.length > 0 && (
                    <button
                      onClick={() => onFiltersChange({ ...filters, creativeFileTypes: [] })}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {allCreativeFileTypes.map((config) => (
                    <button
                      key={config.id}
                      onClick={() => onFiltersChange({ ...filters, creativeFileTypes: toggleArrayItem(filters.creativeFileTypes, config.id) })}
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                        filters.creativeFileTypes.includes(config.id)
                          ? `${config.bgClass} ${config.textClass}`
                          : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                      )}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4 h-px bg-border" />
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</span>
                  {filters.creativeStatuses.length > 0 && (
                    <button
                      onClick={() => onFiltersChange({ ...filters, creativeStatuses: [] })}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(['active', 'archived'] as const).map((status) => {
                    const config = formStatusConfigs[status]
                    return (
                      <button
                        key={status}
                        onClick={() => onFiltersChange({ ...filters, creativeStatuses: toggleArrayItem(filters.creativeStatuses, status) })}
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                          filters.creativeStatuses.includes(status)
                            ? `${config.bgClass} ${config.textClass}`
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                        )}
                      >
                        {config.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          {contentType === 'forms' && (
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</span>
                {filters.formStatuses.length > 0 && (
                  <button
                    onClick={() => onFiltersChange({ ...filters, formStatuses: [] })}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(['active', 'draft', 'archived'] as const).map((status) => {
                  const config = formStatusConfigs[status]
                  return (
                    <button
                      key={status}
                      onClick={() => onFiltersChange({ ...filters, formStatuses: toggleArrayItem(filters.formStatuses, status) })}
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                        filters.formStatuses.includes(status)
                          ? `${config.bgClass} ${config.textClass}`
                          : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                      )}
                    >
                      {config.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Project filter — shared across all content types */}
          <div className="h-px bg-border mb-4" />
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Project</span>
              {filters.projectIds.length > 0 && (
                <button
                  onClick={() => onFiltersChange({ ...filters, projectIds: [] })}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {contentType === 'templates' && (
                <button
                  onClick={() => onFiltersChange({ ...filters, projectIds: toggleArrayItem(filters.projectIds, null) })}
                  className={cn(
                    'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                    filters.projectIds.includes(null)
                      ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  )}
                >
                  Account-wide
                </button>
              )}
              {sampleProjectInfos.map((project) => (
                <button
                  key={project.id}
                  onClick={() => onFiltersChange({ ...filters, projectIds: toggleArrayItem(filters.projectIds, project.id) })}
                  className={cn(
                    'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                    filters.projectIds.includes(project.id)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  )}
                >
                  {project.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ColumnPicker({
  hiddenColumns,
  visibleColumnIds,
  onToggleColumn,
}: {
  hiddenColumns: ContentColumnDef[]
  visibleColumnIds: string[]
  onToggleColumn: (columnId: string) => void
}) {
  const [open, setOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  if (hiddenColumns.length === 0) return null

  const enabledCount = hiddenColumns.filter((c) => visibleColumnIds.includes(c.id)).length

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          open || enabledCount > 0
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        )}
      >
        <Columns3 className="h-4 w-4" />
        Columns
        {enabledCount > 0 && (
          <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-foreground/20 px-1.5 text-xs font-semibold">
            +{enabledCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 z-50 mt-2 w-64 rounded-lg border border-border bg-popover p-3 shadow-lg">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Toggle columns
          </span>
          <div className="max-h-64 overflow-y-auto space-y-0.5">
            {hiddenColumns.map((col) => {
              const isOn = visibleColumnIds.includes(col.id)
              return (
                <label
                  key={col.id}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted/50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isOn}
                    onChange={() => onToggleColumn(col.id)}
                    className="rounded border-border"
                  />
                  {col.label}
                </label>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

const searchPlaceholders: Record<ContentTab, string> = {
  templates: 'Search templates...',
  creatives: 'Search creatives...',
  forms: 'Search forms...',
}

export function ContentToolbar({
  contentType,
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  groupByProject,
  onGroupByProjectToggle,
  hiddenColumns,
  visibleColumnIds,
  onToggleColumn,
}: ContentToolbarProps) {
  const activeFilterChips: { label: string; onRemove: () => void; bgClass: string; textClass: string }[] = []

  if (contentType === 'templates') {
    for (const type of filters.templateTypes) {
      const config = allTemplateTypes.find((t) => t.id === type)
      if (config) {
        activeFilterChips.push({
          label: config.label,
          onRemove: () => onFiltersChange({ ...filters, templateTypes: filters.templateTypes.filter((t) => t !== type) }),
          bgClass: config.bgClass,
          textClass: config.textClass,
        })
      }
    }
    for (const group of filters.templateGroups) {
      const config = allTemplateGroups.find((g) => g.id === group)
      if (config) {
        activeFilterChips.push({
          label: config.label,
          onRemove: () => onFiltersChange({ ...filters, templateGroups: filters.templateGroups.filter((g) => g !== group) }),
          bgClass: config.bgClass,
          textClass: config.textClass,
        })
      }
    }
  }

  if (contentType === 'creatives') {
    for (const ft of filters.creativeFileTypes) {
      const config = allCreativeFileTypes.find((c) => c.id === ft)
      if (config) {
        activeFilterChips.push({
          label: config.label,
          onRemove: () => onFiltersChange({ ...filters, creativeFileTypes: filters.creativeFileTypes.filter((f) => f !== ft) }),
          bgClass: config.bgClass,
          textClass: config.textClass,
        })
      }
    }
    for (const status of filters.creativeStatuses) {
      const config = formStatusConfigs[status]
      activeFilterChips.push({
        label: config.label,
        onRemove: () => onFiltersChange({ ...filters, creativeStatuses: filters.creativeStatuses.filter((s) => s !== status) }),
        bgClass: config.bgClass,
        textClass: config.textClass,
      })
    }
  }

  if (contentType === 'forms') {
    for (const status of filters.formStatuses) {
      const config = formStatusConfigs[status]
      activeFilterChips.push({
        label: config.label,
        onRemove: () => onFiltersChange({ ...filters, formStatuses: filters.formStatuses.filter((s) => s !== status) }),
        bgClass: config.bgClass,
        textClass: config.textClass,
      })
    }
  }

  for (const pid of filters.projectIds) {
    const label = pid === null ? 'Account-wide' : sampleProjectInfos.find((p) => p.id === pid)?.name ?? pid
    activeFilterChips.push({
      label,
      onRemove: () => onFiltersChange({ ...filters, projectIds: filters.projectIds.filter((p) => p !== pid) }),
      bgClass: 'bg-primary',
      textClass: 'text-primary-foreground',
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={searchPlaceholders[contentType]}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        <FilterPopover
          contentType={contentType}
          filters={filters}
          onFiltersChange={onFiltersChange}
        />

        <button
          onClick={onGroupByProjectToggle}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            groupByProject
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          <FolderKanban className="h-4 w-4" />
          Group by project
        </button>

        <div className="flex-1" />

        <ColumnPicker
          hiddenColumns={hiddenColumns}
          visibleColumnIds={visibleColumnIds}
          onToggleColumn={onToggleColumn}
        />
      </div>

      {activeFilterChips.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-muted-foreground mr-0.5">Filtered by:</span>
          {activeFilterChips.map((chip) => (
            <span
              key={chip.label}
              className={cn(
                'inline-flex items-center gap-1 rounded-full pl-2 pr-1 py-0.5 text-xs font-medium',
                chip.bgClass,
                chip.textClass
              )}
            >
              {chip.label}
              <button
                onClick={chip.onRemove}
                className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                aria-label={`Remove ${chip.label} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
