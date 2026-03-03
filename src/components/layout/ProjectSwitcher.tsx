import { useState } from 'react'
import { Search, Star, X, ExternalLink, Plus, FolderKanban } from 'lucide-react'

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useNavigation, Project } from './NavigationContext'
import { sampleProjects } from './navigation'

interface ProjectSwitcherProps {
  onProjectSelect: (project: Project) => void
  onViewAll: () => void
}

export function ProjectSwitcher({
  onProjectSelect,
  onViewAll,
}: ProjectSwitcherProps) {
  const {
    activeProject,
    toggleFavorite,
    isFavorite,
  } = useNavigation()

  const [searchQuery, setSearchQuery] = useState('')

  // Get recent projects (for demo, just use first 3 that aren't the active one)
  const recentProjects = sampleProjects
    .filter((p) => p.id !== activeProject?.id)
    .slice(0, 3)

  // Filter projects based on search
  const filteredProjects = searchQuery
    ? sampleProjects.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recentProjects

  const handleProjectSelect = (project: Project) => {
    onProjectSelect(project)
  }

  return (
    <DropdownMenuContent
      className="w-64 min-w-64 rounded-lg"
      align="start"
      sideOffset={4}
    >
      {/* Search Input */}
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-8 h-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Section Label */}
      <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
        {searchQuery ? 'Search Results' : 'Recent Projects'}
      </div>

      {/* Project List */}
      <div className="max-h-48 overflow-y-auto">
        {filteredProjects.length === 0 ? (
          <div className="px-3 py-4 text-center text-sm text-muted-foreground">
            {searchQuery ? 'No projects found' : 'No recent projects'}
          </div>
        ) : (
          filteredProjects.map((project) => (
            <DropdownMenuItem
              key={project.id}
              className="gap-2 p-2 group/project cursor-pointer"
              onClick={() => handleProjectSelect(project)}
            >
              <div className="flex size-6 items-center justify-center rounded-sm bg-muted">
                <FolderKanban className="size-4 shrink-0 text-muted-foreground" />
              </div>
              <span className="flex-1 truncate">{project.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(project.id)
                }}
                className={`p-1 rounded hover:bg-accent transition-opacity ${
                  isFavorite(project.id)
                    ? 'opacity-100'
                    : 'opacity-0 group-hover/project:opacity-100'
                }`}
                aria-label={
                  isFavorite(project.id)
                    ? 'Remove from favorites'
                    : 'Add to favorites'
                }
              >
                <Star
                  className={`h-3.5 w-3.5 ${
                    isFavorite(project.id)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              </button>
            </DropdownMenuItem>
          ))
        )}
      </div>

      <DropdownMenuSeparator />

      {/* Footer Actions */}
      <DropdownMenuItem className="gap-2 p-2" onClick={onViewAll}>
        <ExternalLink className="size-4 text-muted-foreground" />
        <span>View all projects</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="gap-2 p-2">
        <Plus className="size-4 text-muted-foreground" />
        <span>Create new project</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
