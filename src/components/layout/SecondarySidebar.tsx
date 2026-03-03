import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronsUpDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNavigation } from './NavigationContext'
import {
  allNavigationItems,
  projectNavigationItems,
  projectSettingsItem,
  sampleProjects,
} from './navigation'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const sidebarVariants = {
  hidden: {
    width: 0,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
  visible: {
    width: 224, // w-56 = 14rem = 224px
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
}

export function SecondarySidebar() {
  const {
    activeSection,
    hoveredSection,
    activeSubItem,
    activeProject,
    navigateTo,
    setHoveredSection,
    setActiveProject,
  } = useNavigation()
  const timeoutRef = useRef<number | null>(null)

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const isProjectMode = activeProject !== null

  // For workspace mode, check if current section has children
  const navigationItems = activeProject
    ? [...projectNavigationItems, projectSettingsItem]
    : allNavigationItems

  const displaySection = hoveredSection || activeSection
  const sectionData = navigationItems.find((item) => item.id === displaySection)
  const hasSecondaryNav = sectionData?.children && sectionData.children.length > 0

  // Should we show the sidebar?
  const shouldShow = isProjectMode || hasSecondaryNav

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (hoveredSection) {
      setHoveredSection(hoveredSection)
    }
  }

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setHoveredSection(null)
    }, 150)
  }

  // Check if any children have nested items (need accordion)
  const hasNestedItems = sectionData?.children?.some(
    (child) => child.children && child.children.length > 0
  )

  return (
    <AnimatePresence mode="wait">
      {shouldShow && (
        <motion.aside
          key={isProjectMode ? 'project-sidebar' : `workspace-${displaySection}`}
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="shrink-0 border-r bg-sidebar flex flex-col overflow-hidden"
          onMouseEnter={!isProjectMode ? handleMouseEnter : undefined}
          onMouseLeave={!isProjectMode ? handleMouseLeave : undefined}
        >
          <div className="w-56">
            {isProjectMode ? (
              // Project Mode Sidebar
              <>
                {/* Project Switcher */}
                <div className="p-2 border-b">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-semibold text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
                      <span className="truncate">{activeProject.name}</span>
                      <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-52">
                      {sampleProjects.map((project) => (
                        <DropdownMenuItem
                          key={project.id}
                          onClick={() => setActiveProject(project)}
                          className="flex items-center justify-between"
                        >
                          <span>{project.name}</span>
                          {activeProject.id === project.id && (
                            <Check className="h-4 w-4" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Project Accordion Navigation */}
                <nav className="flex-1 overflow-y-auto p-2">
                  <Accordion
                    type="single"
                    collapsible
                    key={`project-${activeSection}`}
                    defaultValue={activeSection}
                    className="w-full flex flex-col gap-1"
                  >
                    {[...projectNavigationItems, projectSettingsItem].map((item) => {
                      const Icon = item.icon
                      const firstChildId = item.children[0]?.id

                      return (
                        <AccordionItem
                          key={item.id}
                          value={item.id}
                          className="border-none"
                        >
                          <AccordionTrigger
                            className="rounded-md p-2 font-normal hover:no-underline hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
                            onClick={(e) => {
                              const isChevronClick = (e.target as HTMLElement).closest('[data-accordion-chevron]') !== null
                              if (!isChevronClick && firstChildId) {
                                navigateTo(item.id, firstChildId)
                              }
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-0 pt-1">
                            <div className="flex flex-col gap-1">
                              {item.children.map((child) => {
                                const isActive =
                                  activeSection === item.id &&
                                  activeSubItem === child.id

                                return (
                                  <button
                                    key={child.id}
                                    onClick={() => navigateTo(item.id, child.id)}
                                    className={cn(
                                      'rounded-md p-2 pl-8 text-sm transition-colors text-left',
                                      isActive
                                        ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                    )}
                                  >
                                    {child.title}
                                  </button>
                                )
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    })}
                  </Accordion>
                </nav>
              </>
            ) : (
              // Workspace Mode Sidebar
              <>
                <div className="p-2 border-b">
                  <div className="px-2 py-1.5 text-sm font-semibold text-sidebar-foreground">
                    {sectionData?.title}
                  </div>
                </div>
                <nav className="flex-1 p-2 overflow-y-auto">
                  {hasNestedItems ? (
                    <Accordion
                      type="multiple"
                      className="w-full flex flex-col gap-1"
                      key={displaySection}
                      defaultValue={
                        sectionData?.children
                          ?.filter((child) => child.children && child.children.length > 0)
                          .map((child) => child.id) || []
                      }
                    >
                      {sectionData?.children?.map((child) => {
                        if (child.children && child.children.length > 0) {
                          const firstChildId = child.children[0]?.id

                          return (
                            <AccordionItem
                              key={child.id}
                              value={child.id}
                              className="border-none"
                            >
                              <AccordionTrigger
                                className="rounded-md p-2 font-normal hover:no-underline hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
                                onClick={(e) => {
                                  const isChevronClick = (e.target as HTMLElement).closest('[data-accordion-chevron]') !== null
                                  if (!isChevronClick && firstChildId) {
                                    navigateTo(displaySection, firstChildId)
                                  }
                                }}
                              >
                                {child.title}
                              </AccordionTrigger>
                              <AccordionContent className="pb-0 pt-1">
                                <div className="flex flex-col gap-1">
                                  {child.children.map((subChild) => {
                                    const isActive =
                                      activeSection === displaySection &&
                                      activeSubItem === subChild.id

                                    return (
                                      <button
                                        key={subChild.id}
                                        onClick={() => navigateTo(displaySection, subChild.id)}
                                        className={cn(
                                          'rounded-md p-2 pl-8 text-sm transition-colors text-left',
                                          isActive
                                            ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                                            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                        )}
                                      >
                                        {subChild.title}
                                      </button>
                                    )
                                  })}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          )
                        } else {
                          const isActive =
                            activeSection === displaySection && activeSubItem === child.id

                          return (
                            <button
                              key={child.id}
                              onClick={() => navigateTo(displaySection, child.id)}
                              className={cn(
                                'w-full text-left rounded-md p-2 text-sm transition-colors',
                                isActive
                                  ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                              )}
                            >
                              {child.title}
                            </button>
                          )
                        }
                      })}
                    </Accordion>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {sectionData?.children?.map((child) => {
                        const isActive =
                          activeSection === displaySection && activeSubItem === child.id

                        return (
                          <button
                            key={child.id}
                            onClick={() => navigateTo(displaySection, child.id)}
                            className={cn(
                              'w-full text-left rounded-md p-2 text-sm transition-colors',
                              isActive
                                ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                            )}
                          >
                            {child.title}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </nav>
              </>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
