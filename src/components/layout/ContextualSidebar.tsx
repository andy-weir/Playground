import { useState } from 'react'
import { ChevronDown, ChevronUp, Building2, Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNavigation } from './NavigationContext'
import { allNavigationItems } from './navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function ContextualSidebar() {
  const { navMode, activeSection, activeSubItem, setActiveSection, navigateTo } = useNavigation()
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  )

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  if (navMode !== 'contextual') return null

  const currentSection = allNavigationItems.find(item => item.id === activeSection)

  return (
    <aside className="w-56 shrink-0 border-r bg-sidebar flex flex-col">
      {/* Account Switcher */}
      <div className="p-2 border-b">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'flex w-full items-center gap-2 rounded-lg p-2',
                'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              )}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Building2 className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Acme Nonprofit</span>
                <span className="truncate text-xs text-muted-foreground">
                  Essential Plan
                </span>
              </div>
              <ChevronUp className="size-4" />
            </button>
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

      {/* Section Picker */}
      <div className="p-2 border-b">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'flex w-full items-center justify-between rounded-md px-3 py-2',
                'bg-sidebar-accent text-sidebar-accent-foreground',
                'hover:bg-sidebar-accent/80'
              )}
            >
              <div className="flex items-center gap-2">
                {currentSection && <currentSection.icon className="h-4 w-4" />}
                <span className="font-medium">{currentSection?.title || 'Select section'}</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-48"
            side="bottom"
            align="start"
            sideOffset={4}
          >
            {allNavigationItems.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  'gap-2 cursor-pointer',
                  activeSection === item.id && 'bg-accent'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Sub-items */}
      <nav className="flex-1 p-2 overflow-y-auto">
        {currentSection?.children.map(child => (
          <button
            key={child.id}
            onClick={() => navigateTo(activeSection, child.id)}
            className={cn(
              'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
              activeSubItem === child.id
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            )}
          >
            {child.title}
          </button>
        ))}
      </nav>

      {/* Theme Toggle & User Menu */}
      <div className="p-2 border-t mt-auto">
        <button
          onClick={toggleTheme}
          className={cn(
            'flex w-full items-center gap-2 rounded-lg px-3 py-2 mb-1',
            'text-sidebar-foreground hover:bg-sidebar-accent/50'
          )}
        >
          {isDark ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span className="text-sm">{isDark ? 'Light mode' : 'Dark mode'}</span>
        </button>
      </div>
      <div className="p-2 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'flex w-full items-center gap-2 rounded-lg p-2',
                'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              )}
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
              <ChevronUp className="size-4" />
            </button>
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
      </div>
    </aside>
  )
}
