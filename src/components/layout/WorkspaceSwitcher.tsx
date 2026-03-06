import { useState } from 'react'
import { Check, Search, Star, X, ExternalLink } from 'lucide-react'

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useNavigation } from './NavigationContext'
import { Workspace, sampleWorkspaces } from './navigation'

type FilterTab = 'favorites' | 'recents' | 'all'

interface WorkspaceSwitcherProps {
  activeWorkspace: Workspace
  onWorkspaceChange: (workspace: Workspace) => void
}

export function WorkspaceSwitcher({
  activeWorkspace,
  onWorkspaceChange,
}: WorkspaceSwitcherProps) {
  const {
    favoriteWorkspaceIds,
    recentWorkspaceIds,
    toggleWorkspaceFavorite,
    isWorkspaceFavorite,
    navigateTo,
  } = useNavigation()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  const filteredWorkspaces = sampleWorkspaces
    .filter((w) => w.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((w) => {
      if (activeTab === 'favorites') return favoriteWorkspaceIds.includes(w.id)
      if (activeTab === 'recents') return recentWorkspaceIds.includes(w.id)
      return true
    })

  const handleViewAllAccounts = () => {
    navigateTo('accounts', '')
  }

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'favorites', label: 'Favorites' },
    { key: 'recents', label: 'Recents' },
    { key: 'all', label: 'All' },
  ]

  return (
    <DropdownMenuContent
      className="w-[--radix-dropdown-menu-trigger-width] min-w-72 rounded-lg"
      side="bottom"
      align="start"
      sideOffset={4}
    >
      {/* Search Input */}
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search accounts..."
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

      {/* Filter Tabs */}
      <div className="flex gap-1 px-2 pb-2">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 h-7 text-xs ${
              activeTab === tab.key
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <DropdownMenuSeparator />

      {/* Workspace List */}
      <div className="max-h-64 overflow-y-auto">
        {filteredWorkspaces.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            {activeTab === 'favorites'
              ? 'No favorite accounts'
              : activeTab === 'recents'
                ? 'No recent accounts'
                : 'No accounts found'}
          </div>
        ) : (
          filteredWorkspaces.map((workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              className="gap-2 p-2 group/workspace cursor-pointer"
              onClick={() => onWorkspaceChange(workspace)}
            >
              <div className="size-6 rounded-sm overflow-hidden shrink-0">
                <img
                  src={workspace.image}
                  alt={workspace.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className={`block truncate ${
                    activeWorkspace.id === workspace.id ? 'font-medium' : ''
                  }`}
                >
                  {workspace.name}
                </span>
                <span className="block text-xs text-muted-foreground truncate">
                  {workspace.plan}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleWorkspaceFavorite(workspace.id)
                }}
                className={`p-1 rounded hover:bg-accent transition-opacity ${
                  isWorkspaceFavorite(workspace.id)
                    ? 'opacity-100'
                    : 'opacity-0 group-hover/workspace:opacity-100'
                }`}
                aria-label={
                  isWorkspaceFavorite(workspace.id)
                    ? 'Remove from favorites'
                    : 'Add to favorites'
                }
              >
                <Star
                  className={`h-4 w-4 ${
                    isWorkspaceFavorite(workspace.id)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              </button>
              {activeWorkspace.id === workspace.id && (
                <Check className="size-4 shrink-0" />
              )}
            </DropdownMenuItem>
          ))
        )}
      </div>

      <DropdownMenuSeparator />

      {/* Footer Actions */}
      <DropdownMenuItem className="gap-2 p-2" onClick={handleViewAllAccounts}>
        <ExternalLink className="size-4 text-muted-foreground" />
        <span>View all accounts</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
