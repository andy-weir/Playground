import { ReactNode } from 'react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { SecondarySidebar } from './SecondarySidebar'
import { NavigationProvider, useNavigation } from './NavigationContext'

interface AppLayoutProps {
  children: ReactNode
}

function AppLayoutContent({ children }: AppLayoutProps) {
  const { sidebarOpen, setSidebarOpen } = useNavigation()

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <AppSidebar />
      <SecondarySidebar />
      <SidebarInset>
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </SidebarInset>
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
