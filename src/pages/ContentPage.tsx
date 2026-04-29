import { useState, useMemo, useEffect } from 'react'
import { ContentToolbar, emptyFilters, type ContentFilters } from '@/components/content/ContentToolbar'
import { ContentTable } from '@/components/content/ContentTable'
import { sampleTemplates, sampleCreatives, sampleForms } from '@/data/sampleContent'
import type { ContentTab } from '@/lib/contentTypes'
import {
  getContentDefaultColumns,
  getContentHiddenColumns,
  getContentVisibleColumnDefs,
} from '@/lib/contentColumnConfig'

interface ContentPageProps {
  activeTab: ContentTab
}

export default function ContentPage({ activeTab }: ContentPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<ContentFilters>(emptyFilters)
  const [groupByProject, setGroupByProject] = useState(true)
  const [extraColumnIds, setExtraColumnIds] = useState<string[]>([])

  useEffect(() => {
    setSearchQuery('')
    setFilters(emptyFilters)
    setExtraColumnIds([])
  }, [activeTab])

  const defaultColumnIds = getContentDefaultColumns(activeTab)
  const hiddenColumns = getContentHiddenColumns(activeTab)

  const visibleColumnIds = useMemo(() => {
    return [...defaultColumnIds, ...extraColumnIds]
  }, [defaultColumnIds, extraColumnIds])

  const visibleColumnDefs = useMemo(() => {
    return getContentVisibleColumnDefs(activeTab, visibleColumnIds)
  }, [activeTab, visibleColumnIds])

  const handleToggleColumn = (columnId: string) => {
    setExtraColumnIds((prev) =>
      prev.includes(columnId) ? prev.filter((id) => id !== columnId) : [...prev, columnId]
    )
  }

  const filteredItems = useMemo(() => {
    switch (activeTab) {
      case 'templates': {
        return sampleTemplates.filter((t) => {
          if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
          if (filters.templateTypes.length > 0 && !filters.templateTypes.includes(t.type)) return false
          if (filters.templateGroups.length > 0 && !filters.templateGroups.includes(t.group)) return false
          if (filters.projectIds.length > 0 && !filters.projectIds.includes(t.projectId)) return false
          return true
        })
      }
      case 'creatives': {
        return sampleCreatives.filter((c) => {
          if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
          if (filters.creativeFileTypes.length > 0 && !filters.creativeFileTypes.includes(c.fileType)) return false
          if (filters.creativeStatuses.length > 0 && !filters.creativeStatuses.includes(c.status)) return false
          if (filters.projectIds.length > 0 && !filters.projectIds.includes(c.projectId)) return false
          return true
        })
      }
      case 'forms': {
        return sampleForms.filter((f) => {
          if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
          if (filters.formStatuses.length > 0 && !filters.formStatuses.includes(f.status)) return false
          if (filters.projectIds.length > 0 && !filters.projectIds.includes(f.projectId)) return false
          return true
        })
      }
    }
  }, [activeTab, searchQuery, filters])

  return (
    <div className="flex flex-col gap-4">
      <ContentToolbar
        contentType={activeTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFiltersChange={setFilters}
        groupByProject={groupByProject}
        onGroupByProjectToggle={() => setGroupByProject(!groupByProject)}
        hiddenColumns={hiddenColumns}
        visibleColumnIds={visibleColumnIds}
        onToggleColumn={handleToggleColumn}
      />
      <ContentTable
        contentType={activeTab}
        items={filteredItems}
        groupByProject={groupByProject}
        visibleColumns={visibleColumnDefs}
      />
    </div>
  )
}
