import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react'

export type NavMode = 'standard' | 'dropdown' | 'global' | 'dual-sidebar' | 'contextual'

interface NavigationContextValue {
  activeSection: string
  activeSubItem: string
  navMode: NavMode
  hoveredSection: string | null
  setActiveSection: (section: string) => void
  setActiveSubItem: (subItem: string) => void
  setNavMode: (mode: NavMode) => void
  setHoveredSection: (section: string | null) => void
  navigateTo: (section: string, subItem: string) => void
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
  const [navMode, setNavModeState] = useState<NavMode>(() => {
    const stored = localStorage.getItem(NAV_MODE_STORAGE_KEY)
    return (stored as NavMode) || 'standard'
  })

  const setNavMode = useCallback((mode: NavMode) => {
    setNavModeState(mode)
    localStorage.setItem(NAV_MODE_STORAGE_KEY, mode)
  }, [])

  const navigateTo = useCallback((section: string, subItem: string) => {
    setActiveSection(section)
    setActiveSubItem(subItem)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem(NAV_MODE_STORAGE_KEY)
    if (stored && ['standard', 'dropdown', 'global', 'dual-sidebar', 'contextual'].includes(stored)) {
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
        setActiveSection,
        setActiveSubItem,
        setNavMode,
        setHoveredSection,
        navigateTo,
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
