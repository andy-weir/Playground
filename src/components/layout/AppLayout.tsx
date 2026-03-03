import { ReactNode } from 'react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { ProjectSidebar } from './ProjectSidebar'
import { SecondaryNav } from './SecondaryNav'
import { SecondarySidebar } from './SecondarySidebar'
import { NavModeToggle } from './NavModeToggle'
import { NavigationProvider, useNavigation } from './NavigationContext'

interface AppLayoutProps {
  children: ReactNode
}

function AppLayoutContent({ children }: AppLayoutProps) {
  const { activeProject, navMode, sidebarOpen, setSidebarOpen } = useNavigation()

  // Dual-sidebar mode with active project: Use ProjectSidebar (original behavior)
  if (activeProject && navMode === 'dual-sidebar') {
    return (
      <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <ProjectSidebar />
        <SecondarySidebar />
        <SidebarInset>
          <SecondaryNav />
          <main className="flex-1 overflow-auto p-4">{children}</main>
        </SidebarInset>
        <NavModeToggle />
      </SidebarProvider>
    )
  }

  // All other cases: Use AppSidebar (includes accordion-sidebar mode)
  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <AppSidebar />
      <SecondarySidebar />
      <SidebarInset>
        <SecondaryNav />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </SidebarInset>
      <NavModeToggle />
    </SidebarProvider>
  )
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <NavigationProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </NavigationProvider>
  )
}
