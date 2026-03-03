import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react'

export type NavMode = 'dropdown' | 'dual-sidebar' | 'accordion-sidebar'

export interface Project {
  id: string
  name: string
}

interface NavigationContextValue {
  activeSection: string
  activeSubItem: string
  navMode: NavMode
  hoveredSection: string | null
  activeProject: Project | null
  sidebarOpen: boolean
  setActiveSection: (section: string) => void
  setActiveSubItem: (subItem: string) => void
  setNavMode: (mode: NavMode) => void
  setHoveredSection: (section: string | null) => void
  navigateTo: (section: string, subItem: string) => void
  setActiveProject: (project: Project | null) => void
  exitProject: () => void
  setSidebarOpen: (open: boolean) => void
}

const NavigationContext = createContext<NavigationContextValue | undefined>(
  undefined
)

const NAV_MODE_STORAGE_KEY = 'feathr-nav-mode'

interface NavigationProviderProps {
  children: ReactNode
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [activeSubItem, setActiveSubItem] = useState('overview')
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [activeProject, setActiveProjectState] = useState<Project | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [navMode, setNavModeState] = useState<NavMode>(() => {
    const stored = localStorage.getItem(NAV_MODE_STORAGE_KEY)
    return (stored as NavMode) || 'dual-sidebar'
  })

  const setNavMode = useCallback((mode: NavMode) => {
    setNavModeState(mode)
    localStorage.setItem(NAV_MODE_STORAGE_KEY, mode)
  }, [])

  const navigateTo = useCallback((section: string, subItem: string) => {
    setActiveSection(section)
    setActiveSubItem(subItem)
  }, [])

  const setActiveProject = useCallback((project: Project | null) => {
    setActiveProjectState(project)
    if (project) {
      // Reset to campaigns section when entering project mode
      setActiveSection('campaigns')
      setActiveSubItem('all')
    }
  }, [])

  const exitProject = useCallback(() => {
    setActiveProjectState(null)
    // Return to dashboard when exiting project
    setActiveSection('dashboard')
    setActiveSubItem('overview')
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem(NAV_MODE_STORAGE_KEY)
    if (stored && ['dropdown', 'dual-sidebar'].includes(stored)) {
      setNavModeState(stored as NavMode)
    }
  }, [])

  return (
    <NavigationContext.Provider
      value={{
        activeSection,
        activeSubItem,
        navMode,
        hoveredSection,
        activeProject,
        sidebarOpen,
        setActiveSection,
        setActiveSubItem,
        setNavMode,
        setHoveredSection,
        navigateTo,
        setActiveProject,
        exitProject,
        setSidebarOpen,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
