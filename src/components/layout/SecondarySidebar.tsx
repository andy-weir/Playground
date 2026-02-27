import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useNavigation } from './NavigationContext'
import { allNavigationItems } from './navigation'

export function SecondarySidebar() {
  const { navMode, activeSection, hoveredSection, activeSubItem, navigateTo, setHoveredSection } = useNavigation()
  const timeoutRef = useRef<number | null>(null)

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  if (navMode !== 'dual-sidebar') return null

  // Show hovered section's items, or fall back to active section
  const displaySection = hoveredSection || activeSection
  const sectionData = allNavigationItems.find(item => item.id === displaySection)

  const handleMouseEnter = () => {
    // Clear any pending timeout when entering the secondary sidebar
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    // Keep the hovered section active
    if (hoveredSection) {
      setHoveredSection(hoveredSection)
    }
  }

  const handleMouseLeave = () => {
    // Small delay before clearing hovered section
    timeoutRef.current = window.setTimeout(() => {
      setHoveredSection(null)
    }, 150)
  }

  return (
    <aside
      className="w-48 shrink-0 border-r bg-sidebar flex flex-col"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-3 text-sm font-medium text-sidebar-foreground border-b">
        {sectionData?.title}
      </div>
      <nav className="flex-1 p-2">
        {sectionData?.children.map(child => (
          <button
            key={child.id}
            onClick={() => navigateTo(displaySection, child.id)}
            className={cn(
              'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
              activeSection === displaySection && activeSubItem === child.id
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            )}
          >
            {child.title}
          </button>
        ))}
      </nav>
    </aside>
  )
}
