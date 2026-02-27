import { ReactNode } from 'react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { SecondaryNav } from './SecondaryNav'
import { SecondarySidebar } from './SecondarySidebar'
import { ContextualSidebar } from './ContextualSidebar'
import { NavModeToggle } from './NavModeToggle'
import { NavigationProvider, useNavigation } from './NavigationContext'

interface AppLayoutProps {
  children: ReactNode
}

function AppLayoutContent({ children }: AppLayoutProps) {
  const { navMode } = useNavigation()

  // Mode E (contextual): Replace AppSidebar with ContextualSidebar
  if (navMode === 'contextual') {
    return (
      <div className="flex h-screen w-full">
        <ContextualSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-auto p-4">{children}</main>
        </div>
        <NavModeToggle />
      </div>
    )
  }

  // Mode D (dual-sidebar): Force collapsed state, other modes use default
  const sidebarProps = navMode === 'dual-sidebar'
    ? { defaultOpen: false }
    : {}

  return (
    <SidebarProvider key={navMode} {...sidebarProps}>
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
