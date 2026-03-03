import { ChevronUp, ChevronRight, Building2, PanelLeftClose, PanelLeft, Moon, Sun } from 'lucide-react'
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
import { navigationItems, projectsItem, accountsItem, settingsItem, sampleProjects } from './navigation'
import { useNavigation } from './NavigationContext'

export function AppSidebar() {
  const { navMode, activeProject, setActiveProject } = useNavigation()
  const { toggleSidebar, state } = useSidebar()
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  )

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
                  <DropdownMenuItem className="gap-2 p-2">
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
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarNavItem key={`${navMode}-${item.id}`} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Projects Section */}
        <SidebarGroup className="mt-4 pt-4 border-t border-sidebar-border">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarNavItem key={`${navMode}-${projectsItem.id}`} item={projectsItem} />
              {/* Saved Projects List - hidden when collapsed */}
              {sampleProjects.map((project) => {
                const isActive = activeProject?.id === project.id
                return (
                  <SidebarMenuItem key={project.id} className="group-data-[collapsible=icon]:hidden">
                    <SidebarMenuButton
                      className={
                        isActive
                          ? 'pl-8 bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                          : 'pl-8 text-muted-foreground'
                      }
                      onClick={() => setActiveProject(project)}
                    >
                      <span className="flex-1 truncate">{project.name}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Accounts Section */}
        <SidebarGroup className="mt-4 pt-4 border-t border-sidebar-border">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarNavItem key={`${navMode}-${accountsItem.id}`} item={accountsItem} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
          <SidebarNavItem key={`${navMode}-settings`} item={settingsItem} />
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
