import { cn } from '@/lib/utils'
import { useNavigation } from './NavigationContext'
import { allNavigationItems, NavItem } from './navigation'

interface SecondaryNavProps {
  className?: string
}

function NavTabs({
  items,
  activeSubItem,
  activeSection,
  onSelect,
  sectionId,
}: {
  items: NavItem['children']
  activeSubItem: string
  activeSection: string
  onSelect: (subItemId: string) => void
  sectionId: string
}) {
  return (
    <div className="flex items-center gap-1">
      {items.map((item) => (
        <button
          key={`${sectionId}-${item.id}`}
          onClick={() => onSelect(item.id)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            activeSubItem === item.id && sectionId === activeSection
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground'
          )}
        >
          {item.title}
        </button>
      ))}
    </div>
  )
}

function StandardNav() {
  const { activeSection, activeSubItem, setActiveSubItem } = useNavigation()
  const currentSection = allNavigationItems.find(
    (item) => item.id === activeSection
  )

  if (!currentSection) return null

  return (
    <NavTabs
      items={currentSection.children}
      activeSubItem={activeSubItem}
      activeSection={activeSection}
      onSelect={setActiveSubItem}
      sectionId={activeSection}
    />
  )
}

function GlobalNav() {
  const { activeSection, activeSubItem, navigateTo } = useNavigation()

  return (
    <div className="flex items-center gap-6 overflow-x-auto">
      {allNavigationItems.map((section) => (
        <div key={section.id} className="flex items-center gap-1">
          <span className="mr-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {section.title}:
          </span>
          {section.children.map((item) => (
            <button
              key={`${section.id}-${item.id}`}
              onClick={() => navigateTo(section.id, item.id)}
              className={cn(
                'whitespace-nowrap rounded-md px-2 py-1 text-sm font-medium transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                activeSection === section.id && activeSubItem === item.id
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {item.title}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

export function SecondaryNav({ className }: SecondaryNavProps) {
  const { navMode } = useNavigation()

  // Mode B (dropdown): No secondary nav - dropdowns provide sub-item access
  // Mode D (dual-sidebar): No horizontal secondary nav - vertical sidebar provides sub-item access
  // Mode E (contextual): No horizontal secondary nav - contextual sidebar provides sub-item access
  if (navMode === 'dropdown' || navMode === 'dual-sidebar' || navMode === 'contextual') {
    return null
  }

  return (
    <nav
      className={cn(
        'flex h-10 shrink-0 items-center border-b bg-background px-4',
        className
      )}
    >
      {navMode === 'standard' ? <StandardNav /> : <GlobalNav />}
    </nav>
  )
}
