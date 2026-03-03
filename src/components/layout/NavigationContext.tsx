import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'

export interface Project {
  id: string
  name: string
}

interface NavigationContextValue {
  activeSection: string
  activeSubItem: string
  hoveredSection: string | null
  activeProject: Project | null
  sidebarOpen: boolean
  setActiveSection: (section: string) => void
  setActiveSubItem: (subItem: string) => void
  setHoveredSection: (section: string | null) => void
  navigateTo: (section: string, subItem: string) => void
  setActiveProject: (project: Project | null) => void
  exitProject: () => void
  setSidebarOpen: (open: boolean) => void
}

const NavigationContext = createContext<NavigationContextValue | undefined>(
  undefined
)

interface NavigationProviderProps {
  children: ReactNode
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [activeSubItem, setActiveSubItem] = useState('overview')
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [activeProject, setActiveProjectState] = useState<Project | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

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

  return (
    <NavigationContext.Provider
      value={{
        activeSection,
        activeSubItem,
        hoveredSection,
        activeProject,
        sidebarOpen,
        setActiveSection,
        setActiveSubItem,
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
