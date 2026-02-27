import { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNavigation } from './NavigationContext'
import { NavItem } from './navigation'

interface SidebarNavItemProps {
  item: NavItem
}

export function SidebarNavItem({ item }: SidebarNavItemProps) {
  const { activeSection, activeSubItem, navMode, setActiveSection, setHoveredSection, navigateTo } =
    useNavigation()
  const [isOpen, setIsOpen] = useState(false)
  const isHoveringRef = useRef({ trigger: false, content: false })
  const closeTimeoutRef = useRef<number | null>(null)
  const isActive = activeSection === item.id

  const handleClick = () => {
    if (navMode !== 'dropdown') {
      setActiveSection(item.id)
    }
  }

  const handleSubItemClick = (subItemId: string) => {
    navigateTo(item.id, subItemId)
    setIsOpen(false)
  }

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }, [])

  const scheduleClose = useCallback(() => {
    clearCloseTimeout()
    closeTimeoutRef.current = window.setTimeout(() => {
      if (!isHoveringRef.current.trigger && !isHoveringRef.current.content) {
        setIsOpen(false)
      }
    }, 100)
  }, [clearCloseTimeout])

  const handleTriggerEnter = useCallback(() => {
    isHoveringRef.current.trigger = true
    clearCloseTimeout()
    setIsOpen(true)
  }, [clearCloseTimeout])

  const handleTriggerLeave = useCallback(() => {
    isHoveringRef.current.trigger = false
    scheduleClose()
  }, [scheduleClose])

  const handleContentEnter = useCallback(() => {
    isHoveringRef.current.content = true
    clearCloseTimeout()
  }, [clearCloseTimeout])

  const handleContentLeave = useCallback(() => {
    isHoveringRef.current.content = false
    scheduleClose()
  }, [scheduleClose])

  // Mode B: Dropdown mode - show dropdown on hover
  if (navMode === 'dropdown') {
    return (
      <SidebarMenuItem>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              data-active={isActive}
              data-state={isOpen ? 'open' : 'closed'}
              onMouseEnter={handleTriggerEnter}
              onMouseLeave={handleTriggerLeave}
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none',
                'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground',
                isActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="start"
            sideOffset={4}
            className="z-50 min-w-40"
            onMouseEnter={handleContentEnter}
            onMouseLeave={handleContentLeave}
          >
            {item.children.map((child) => (
              <DropdownMenuItem
                key={child.id}
                onClick={() => handleSubItemClick(child.id)}
                className={cn(
                  'cursor-pointer',
                  isActive && child.id === activeSubItem ? 'bg-accent' : ''
                )}
              >
                {child.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    )
  }

  // Mode D: Dual sidebar - icon-only with hover tracking
  if (navMode === 'dual-sidebar') {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={isActive}
          tooltip={item.title}
          onMouseEnter={() => setHoveredSection(item.id)}
          onMouseLeave={() => setHoveredSection(null)}
          onClick={() => setActiveSection(item.id)}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  // Modes A & C: Standard click behavior
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
        onClick={handleClick}
      >
        <a href={item.children[0]?.href || '#'}>
          <item.icon />
          <span>{item.title}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
