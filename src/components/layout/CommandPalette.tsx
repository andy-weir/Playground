import { useState, useEffect, useCallback, useRef } from 'react'
import { Search, Megaphone, FolderKanban, Users2, FileText, Heart, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface CommandItem {
  id: string
  name: string
  type: 'campaign' | 'project' | 'group' | 'content' | 'donation-form'
  description?: string
}

// Sample data for demonstration
const sampleItems: CommandItem[] = [
  // Campaigns
  { id: 'c1', name: 'Spring Fundraiser Email', type: 'campaign', description: 'Email campaign' },
  { id: 'c2', name: 'Year-End Appeal', type: 'campaign', description: 'Email campaign' },
  { id: 'c3', name: 'Monthly Newsletter', type: 'campaign', description: 'Email campaign' },
  { id: 'c4', name: 'Awareness Display Ads', type: 'campaign', description: 'Ad campaign' },
  // Projects
  { id: 'p1', name: 'Spring Gala', type: 'project' },
  { id: 'p2', name: 'Annual Fundraiser', type: 'project' },
  { id: 'p3', name: 'Q4 Campaign', type: 'project' },
  // Groups
  { id: 'g1', name: 'Major Donors', type: 'group', description: '1,234 people' },
  { id: 'g2', name: 'Newsletter Subscribers', type: 'group', description: '5,678 people' },
  { id: 'g3', name: 'Event Attendees 2024', type: 'group', description: '892 people' },
  { id: 'g4', name: 'Lapsed Donors', type: 'group', description: '456 people' },
  // Content
  { id: 't1', name: 'Thank You Email Template', type: 'content' },
  { id: 't2', name: 'Event Invitation Template', type: 'content' },
  { id: 't3', name: 'Donation Receipt', type: 'content' },
  // Donation Forms
  { id: 'd1', name: 'General Donation Form', type: 'donation-form' },
  { id: 'd2', name: 'Gala Ticket Purchase', type: 'donation-form' },
  { id: 'd3', name: 'Monthly Giving Form', type: 'donation-form' },
]

const typeConfig = {
  campaign: { icon: Megaphone, label: 'Campaigns' },
  project: { icon: FolderKanban, label: 'Projects' },
  group: { icon: Users2, label: 'Groups' },
  content: { icon: FileText, label: 'Content' },
  'donation-form': { icon: Heart, label: 'Donation Forms' },
}

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Filter items based on query
  const filteredItems = query
    ? sampleItems.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
    : sampleItems

  // Group items by type
  const groupedItems = filteredItems.reduce<Record<string, CommandItem[]>>(
    (acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = []
      }
      acc[item.type]!.push(item)
      return acc
    },
    {}
  )

  // Flatten for keyboard navigation
  const flatItems = Object.values(groupedItems).flat()

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current && flatItems.length > 0) {
      const selectedElement = listRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      )
      selectedElement?.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex, flatItems.length])

  const handleSelect = useCallback(
    (item: CommandItem) => {
      // TODO: Navigate to the selected item
      console.log('Selected:', item)
      onOpenChange(false)
    },
    [onOpenChange]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((i) => Math.min(i + 1, flatItems.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((i) => Math.max(i - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (flatItems[selectedIndex]) {
            handleSelect(flatItems[selectedIndex])
          }
          break
      }
    },
    [flatItems, selectedIndex, handleSelect]
  )

  // Get the flat index for an item
  const getFlatIndex = (type: string, indexInGroup: number) => {
    let index = 0
    for (const [groupType, items] of Object.entries(groupedItems)) {
      if (groupType === type) {
        return index + indexInGroup
      }
      index += items.length
    }
    return index
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Search</DialogTitle>
        {/* Search Input */}
        <motion.div
          className="flex items-center border-b px-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search campaigns, projects, groups, content..."
            className="h-12 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </motion.div>

        {/* Results */}
        <div
          ref={listRef}
          className="max-h-[400px] overflow-y-auto p-2"
        >
          <AnimatePresence mode="wait">
            {flatItems.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="py-6 text-center text-sm text-muted-foreground"
              >
                No results found for "{query}"
              </motion.div>
            ) : (
              <motion.div
                key={query || 'all'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                {Object.entries(groupedItems).map(([type, items], groupIndex) => {
                  const config = typeConfig[type as keyof typeof typeConfig]
                  const Icon = config.icon

                  return (
                    <motion.div
                      key={type}
                      className="mb-2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.2,
                        delay: groupIndex * 0.03,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                    >
                      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        {config.label}
                      </div>
                      {items.map((item, indexInGroup) => {
                        const flatIndex = getFlatIndex(type, indexInGroup)
                        const isSelected = flatIndex === selectedIndex

                        return (
                          <motion.button
                            key={item.id}
                            data-index={flatIndex}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setSelectedIndex(flatIndex)}
                            className={cn(
                              'relative flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm',
                              'text-foreground'
                            )}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                              duration: 0.15,
                              delay: (groupIndex * items.length + indexInGroup) * 0.02
                            }}
                          >
                            {/* Animated selection background */}
                            {isSelected && (
                              <motion.div
                                layoutId="command-selection"
                                className="absolute inset-0 bg-accent rounded-md"
                                initial={false}
                                transition={{
                                  type: 'spring',
                                  stiffness: 500,
                                  damping: 35,
                                }}
                              />
                            )}
                            <Icon className="relative h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="relative flex-1 truncate text-left">
                              {item.name}
                            </span>
                            {item.description && (
                              <span className="relative text-xs text-muted-foreground">
                                {item.description}
                              </span>
                            )}
                            <AnimatePresence>
                              {isSelected && (
                                <motion.div
                                  initial={{ opacity: 0, x: -4 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 4 }}
                                  transition={{ duration: 0.15 }}
                                >
                                  <ArrowRight className="relative h-4 w-4 shrink-0 text-muted-foreground" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.button>
                        )
                      })}
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.div
          className="flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono">↑</kbd>
              <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono">↓</kbd>
              <span className="ml-1">Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono">↵</kbd>
              <span className="ml-1">Select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono">Esc</kbd>
              <span className="ml-1">Close</span>
            </span>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
