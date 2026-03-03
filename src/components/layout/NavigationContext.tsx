import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react'

const FAVORITES_STORAGE_KEY = 'feathr-favorite-projects'

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
  favoriteProjectIds: string[]
  setActiveSection: (section: string) => void
  setActiveSubItem: (subItem: string) => void
  setHoveredSection: (section: string | null) => void
  navigateTo: (section: string, subItem: string) => void
  setActiveProject: (project: Project | null) => void
  exitProject: () => void
  setSidebarOpen: (open: boolean) => void
  toggleFavorite: (projectId: string) => void
  isFavorite: (projectId: string) => boolean
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
  const [favoriteProjectIds, setFavoriteProjectIds] = useState<string[]>(() => {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteProjectIds))
  }, [favoriteProjectIds])

  const toggleFavorite = useCallback((projectId: string) => {
    setFavoriteProjectIds((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    )
  }, [])

  const isFavorite = useCallback(
    (projectId: string) => favoriteProjectIds.includes(projectId),
    [favoriteProjectIds]
  )

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
        favoriteProjectIds,
        setActiveSection,
        setActiveSubItem,
        setHoveredSection,
        navigateTo,
        setActiveProject,
        exitProject,
        setSidebarOpen,
        toggleFavorite,
        isFavorite,
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
