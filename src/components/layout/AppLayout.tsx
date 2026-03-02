import { ReactNode } from 'react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebarClassic } from './AppSidebarClassic'
import { AppSidebarNew } from './AppSidebarNew'
import { TopBar } from './TopBar'
import { ExperienceBar } from '@/components/opt-in'
import { useFeatureFlag } from '@/hooks/use-feature-flag'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isEnabled } = useFeatureFlag('newNavigation')

  return (
    <SidebarProvider>
      {isEnabled ? <AppSidebarNew /> : <AppSidebarClassic />}
      <SidebarInset>
        <TopBar />
        <main className="flex-1 overflow-auto p-4 pb-16">{children}</main>
      </SidebarInset>
      {isEnabled && <ExperienceBar featureId="newNavigation" />}
    </SidebarProvider>
  )
}
