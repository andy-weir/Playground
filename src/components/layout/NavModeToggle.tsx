import { Settings2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useNavigation, NavMode } from './NavigationContext'
import { cn } from '@/lib/utils'

const navModeOptions: { value: NavMode; label: string; description: string }[] =
  [
    {
      value: 'standard',
      label: 'Mode A: Standard',
      description: 'Click sidebar, secondary nav updates',
    },
    {
      value: 'dropdown',
      label: 'Mode B: Dropdown',
      description: 'Dropdown appears on sidebar items',
    },
    {
      value: 'global',
      label: 'Mode C: Global',
      description: 'All sections visible in secondary nav',
    },
    {
      value: 'dual-sidebar',
      label: 'Mode D: Dual Sidebar',
      description: 'Icon sidebar + secondary sidebar for sub-items',
    },
    {
      value: 'contextual',
      label: 'Mode E: Contextual',
      description: 'Section picker + contextual sub-items sidebar',
    },
  ]

export function NavModeToggle() {
  const { navMode, setNavMode } = useNavigation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-50 h-10 w-10 rounded-full shadow-lg"
        >
          <Settings2 className="h-5 w-5" />
          <span className="sr-only">Navigation mode settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end" className="w-64" sideOffset={8}>
        <DropdownMenuLabel>Navigation Mode</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {navModeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setNavMode(option.value)}
            className={cn(
              'flex flex-col items-start gap-1 py-2',
              navMode === option.value && 'bg-accent'
            )}
          >
            <div className="flex w-full items-center justify-between">
              <span className="font-medium">{option.label}</span>
              {navMode === option.value && <Check className="h-4 w-4" />}
            </div>
            <span className="text-xs text-muted-foreground">
              {option.description}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
