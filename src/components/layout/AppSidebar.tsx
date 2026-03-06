import { ChevronUp, ChevronRight, ChevronDown, PanelLeftClose, PanelLeft, Moon, Sun, Star, Plus, Megaphone, FolderKanban, Users2, Heart, Search } from 'lucide-react'
import { useState, useEffect } from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { SidebarNavItem } from './SidebarNavItem'
import { navigationItems, projectsItem, accountsItem, settingsItem, integrationsItem, notificationsItem, resourcesItem, helpItem, sampleProjects } from './navigation'
import { useNavigation } from './NavigationContext'
import { WorkspaceSwitcher } from './WorkspaceSwitcher'
import { CommandPalette } from './CommandPalette'

export function AppSidebar() {
  const { activeProject, setActiveProject, favoriteProjectIds, toggleFavorite, activeWorkspace, setActiveWorkspace } = useNavigation()
  const { toggleSidebar, state } = useSidebar()
  const favoriteProjects = sampleProjects.filter((p) => favoriteProjectIds.includes(p.id))
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  )
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  // Keyboard shortcut for command palette (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-1 w-full">
              {/* Workspace dropdown - hidden when collapsed */}
              <div className="flex-1 group-data-[collapsible=icon]:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="w-full bg-background border border-border data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                    <div className="aspect-square size-8 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={activeWorkspace.image}
                        alt={activeWorkspace.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="grid w-max text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{activeWorkspace.name}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {activeWorkspace.plan}
                      </span>
                    </div>
                    <ChevronUp className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <WorkspaceSwitcher
                  activeWorkspace={activeWorkspace}
                  onWorkspaceChange={setActiveWorkspace}
                />
                </DropdownMenu>
              </div>

              {/* Collapse/expand button - always visible */}
              <SidebarMenuButton
                size="icon"
                onClick={toggleSidebar}
                tooltip={state === 'collapsed' ? 'Expand sidebar' : 'Collapse sidebar'}
                className="shrink-0 group/collapse group-data-[collapsible=icon]:!p-0"
              >
                {state === 'collapsed' ? (
                  <>
                    <div className="aspect-square size-8 rounded-lg overflow-hidden group-hover/collapse:hidden">
                      <img
                        src={activeWorkspace.image}
                        alt={activeWorkspace.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="hidden aspect-square size-8 items-center justify-center group-hover/collapse:flex">
                      <PanelLeft className="size-4" />
                    </div>
                  </>
                ) : (
                  <PanelLeftClose className="size-4" />
                )}
              </SidebarMenuButton>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Search & Create */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupContent className="flex flex-col gap-2">
            {/* Search / Command Palette Trigger */}
            <Button
              variant="outline"
              className="w-full justify-between text-muted-foreground font-normal"
              onClick={() => setCommandPaletteOpen(true)}
            >
              <span className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search...
              </span>
              <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 hidden sm:inline-flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
            {/* Create Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-48"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuItem className="gap-2">
                  <Megaphone className="h-4 w-4" />
                  Create a campaign
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <FolderKanban className="h-4 w-4" />
                  Create a project
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Users2 className="h-4 w-4" />
                  Create a group
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Heart className="h-4 w-4" />
                  Create a donation form
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarNavItem key={item.id} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Projects Section */}
        <SidebarGroup className="mt-4 pt-4 border-t border-sidebar-border">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarNavItem key={projectsItem.id} item={projectsItem} />
              {/* Favorited Projects List - hidden when collapsed */}
              {favoriteProjects.map((project) => (
                <SidebarMenuItem key={project.id} className="group/project group-data-[collapsible=icon]:hidden">
                  <ContextMenu>
                    <ContextMenuTrigger asChild>
                      <SidebarMenuButton
                        isActive={activeProject?.id === project.id}
                        className="pl-8"
                        onClick={() => setActiveProject(project)}
                      >
                        <span className="flex-1 truncate">{project.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(project.id)
                          }}
                          className="opacity-0 group-hover/project:opacity-100 p-0.5 rounded hover:bg-sidebar-accent transition-opacity"
                          aria-label="Remove from favorites"
                        >
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        </button>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </SidebarMenuButton>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem onClick={() => toggleFavorite(project.id)}>
                        <Star className="h-4 w-4 mr-2" />
                        Remove from favorites
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Accounts Section */}
        <SidebarGroup className="mt-4 pt-4 border-t border-sidebar-border">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarNavItem key={accountsItem.id} item={accountsItem} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto pt-4 border-t border-sidebar-border">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarNavItem key={notificationsItem.id} item={notificationsItem} />
              <SidebarNavItem key={resourcesItem.id} item={resourcesItem} />
              <SidebarNavItem key={helpItem.id} item={helpItem} />
              <SidebarNavItem key={integrationsItem.id} item={integrationsItem} />
              <SidebarNavItem key={settingsItem.id} item={settingsItem} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                    <AvatarFallback className="rounded-lg">AW</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Andy Weir</span>
                    <span className="truncate text-xs text-muted-foreground">
                      andy@example.com
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Notifications</DropdownMenuItem>
                <DropdownMenuItem>Security</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={toggleTheme}>
                  {isDark ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                  {isDark ? 'Light mode' : 'Dark mode'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Privacy policy</DropdownMenuItem>
                <DropdownMenuItem>Terms and conditions</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />
    </Sidebar>
  )
}
