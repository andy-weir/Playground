import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { ChevronRight } from 'lucide-react'
import { useNavigation } from './NavigationContext'
import { NavItem } from './navigation'

interface SidebarNavItemProps {
  item: NavItem
}

export function SidebarNavItem({ item }: SidebarNavItemProps) {
  const { activeSection, activeProject, setActiveSection, setHoveredSection, navigateTo, setActiveProject } =
    useNavigation()

  // Don't show workspace nav items as active when in project mode
  const isInProjectMode = activeProject !== null
  const isActive = isInProjectMode ? false : activeSection === item.id

  const hasSecondaryNav = item.children && item.children.length > 0

  // Find the first selectable sub-item (handles accordion case)
  const getFirstSubItemId = () => {
    if (!item.children || item.children.length === 0) return null
    const firstChild = item.children[0]
    // If first child has nested children (accordion), return first nested child
    if (firstChild?.children && firstChild.children.length > 0) {
      return firstChild.children[0]?.id
    }
    return firstChild?.id
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        tooltip={item.title}
        onClick={() => {
          // Exit project mode when navigating to workspace sections
          if (isInProjectMode) {
            setActiveProject(null)
          }
          setHoveredSection(item.id)

          // If has secondary nav, navigate to first sub-item
          const firstSubItemId = getFirstSubItemId()
          if (firstSubItemId) {
            navigateTo(item.id, firstSubItemId)
          } else {
            setActiveSection(item.id)
          }
        }}
      >
        <item.icon className="h-4 w-4" />
        <span className="flex-1">{item.title}</span>
        {hasSecondaryNav && (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
