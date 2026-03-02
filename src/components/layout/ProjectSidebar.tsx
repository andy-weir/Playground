import { ChevronUp, ArrowLeft, Moon, Sun, PanelLeftClose, PanelLeft, Check, Building2 } from 'lucide-react'
import { useState } from 'react'

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SidebarNavItem } from './SidebarNavItem'
import { projectNavigationItems, projectSettingsItem, sampleProjects } from './navigation'
import { useNavigation } from './NavigationContext'

export function ProjectSidebar() {
  const { navMode, activeProject, setActiveProject, exitProject } = useNavigation()
  const { toggleSidebar, state } = useSidebar()
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  )

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  if (!activeProject) return null

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="border-b border-sidebar-border pb-2 mb-2">
            <div className="flex items-center gap-1 w-full">
              {/* Workspace/Account Dropdown - hidden when collapsed */}
              <div className="flex-1 group-data-[collapsible=icon]:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="w-full bg-white border border-gray-200 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <Building2 className="size-4" />
                      </div>
                      <div className="grid w-max text-left text-sm leading-tight">
                        <span className="truncate font-semibold">Acme Nonprofit</span>
                        <span className="truncate text-xs text-muted-foreground">
                          Essential Plan
                        </span>
                      </div>
                      <ChevronUp className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side="bottom"
                    align="start"
                    sideOffset={4}
                  >
                    <DropdownMenuItem className="gap-2 p-2">
                      <div className="flex size-6 items-center justify-center rounded-sm border">
                        <Building2 className="size-4 shrink-0" />
                      </div>
                      <span className="font-medium">Acme Nonprofit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="gap-2 p-2 cursor-pointer"
                      onClick={exitProject}
                    >
                      <div className="flex size-6 items-center justify-center rounded-sm border">
                        <Building2 className="size-4 shrink-0" />
                      </div>
                      <span>Beta Foundation</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 p-2">
                      <div className="flex size-6 items-center justify-center rounded-sm border bg-background">
                        <span className="text-xs">+</span>
                      </div>
                      <span className="text-muted-foreground">Create workspace</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
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
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground group-hover/collapse:hidden">
                      <Building2 className="size-4" />
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

          {/* Back to Workspace Button */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={exitProject}
              tooltip="Back to Workspace"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Workspace</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Project Dropdown */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <span className="text-sm font-semibold">
                      {activeProject.name.charAt(0)}
                    </span>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{activeProject.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      Project
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="start"
                sideOffset={4}
              >
                {sampleProjects.map((project) => (
                  <DropdownMenuItem
                    key={project.id}
                    className="gap-2 p-2 cursor-pointer"
                    onClick={() => setActiveProject(project)}
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      <span className="text-xs font-medium">
                        {project.name.charAt(0)}
                      </span>
                    </div>
                    <span className={activeProject.id === project.id ? 'font-medium' : ''}>
                      {project.name}
                    </span>
                    {activeProject.id === project.id && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 p-2 cursor-pointer"
                  onClick={exitProject}
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border bg-background">
                    <ArrowLeft className="size-3" />
                  </div>
                  <span className="text-muted-foreground">Exit to Workspace</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Project Navigation Items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {projectNavigationItems.map((item) => (
                <SidebarNavItem key={`${navMode}-project-${item.id}`} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Theme Control */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={toggleTheme}
                  tooltip={isDark ? 'Light mode' : 'Dark mode'}
                >
                  {isDark ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                  <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {/* Project Settings */}
          <SidebarNavItem key={`${navMode}-project-settings`} item={projectSettingsItem} />

          {/* User Menu */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
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
                <DropdownMenuItem>Account settings</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
