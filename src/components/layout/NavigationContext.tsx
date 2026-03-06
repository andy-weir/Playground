import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react'
import { Workspace, sampleWorkspaces } from './navigation'

const FAVORITES_STORAGE_KEY = 'feathr-favorite-projects'
const WORKSPACE_FAVORITES_STORAGE_KEY = 'feathr-favorite-workspaces'
const RECENT_WORKSPACES_STORAGE_KEY = 'feathr-recent-workspaces'
const ACTIVE_WORKSPACE_STORAGE_KEY = 'feathr-active-workspace'
const MAX_RECENT_WORKSPACES = 5

export interface Project {
  id: string
  name: string
}

interface NavigationContextValue {
  activeSection: string
  activeSubItem: string
  hoveredSection: string | null
  activeProject: Project | null
  activeWorkspace: Workspace
  sidebarOpen: boolean
  favoriteProjectIds: string[]
  favoriteWorkspaceIds: string[]
  recentWorkspaceIds: string[]
  setActiveSection: (section: string) => void
  setActiveSubItem: (subItem: string) => void
  setHoveredSection: (section: string | null) => void
  navigateTo: (section: string, subItem: string) => void
  setActiveProject: (project: Project | null) => void
  exitProject: () => void
  setActiveWorkspace: (workspace: Workspace) => void
  setSidebarOpen: (open: boolean) => void
  toggleFavorite: (projectId: string) => void
  isFavorite: (projectId: string) => boolean
  toggleWorkspaceFavorite: (workspaceId: string) => void
  isWorkspaceFavorite: (workspaceId: string) => boolean
  addRecentWorkspace: (workspaceId: string) => void
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
  const [favoriteWorkspaceIds, setFavoriteWorkspaceIds] = useState<string[]>(() => {
    const stored = localStorage.getItem(WORKSPACE_FAVORITES_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  })
  const [recentWorkspaceIds, setRecentWorkspaceIds] = useState<string[]>(() => {
    const stored = localStorage.getItem(RECENT_WORKSPACES_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  })
  const [activeWorkspace, setActiveWorkspaceState] = useState<Workspace>(() => {
    const stored = localStorage.getItem(ACTIVE_WORKSPACE_STORAGE_KEY)
    if (stored) {
      const workspace = sampleWorkspaces.find(w => w.id === stored)
      if (workspace) return workspace
    }
    return sampleWorkspaces[0]!
  })

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteProjectIds))
  }, [favoriteProjectIds])

  useEffect(() => {
    localStorage.setItem(WORKSPACE_FAVORITES_STORAGE_KEY, JSON.stringify(favoriteWorkspaceIds))
  }, [favoriteWorkspaceIds])

  useEffect(() => {
    localStorage.setItem(RECENT_WORKSPACES_STORAGE_KEY, JSON.stringify(recentWorkspaceIds))
  }, [recentWorkspaceIds])

  useEffect(() => {
    localStorage.setItem(ACTIVE_WORKSPACE_STORAGE_KEY, activeWorkspace.id)
  }, [activeWorkspace])

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

  const toggleWorkspaceFavorite = useCallback((workspaceId: string) => {
    setFavoriteWorkspaceIds((prev) =>
      prev.includes(workspaceId)
        ? prev.filter((id) => id !== workspaceId)
        : [...prev, workspaceId]
    )
  }, [])

  const isWorkspaceFavorite = useCallback(
    (workspaceId: string) => favoriteWorkspaceIds.includes(workspaceId),
    [favoriteWorkspaceIds]
  )

  const addRecentWorkspace = useCallback((workspaceId: string) => {
    setRecentWorkspaceIds((prev) => {
      const filtered = prev.filter((id) => id !== workspaceId)
      return [workspaceId, ...filtered].slice(0, MAX_RECENT_WORKSPACES)
    })
  }, [])

  const setActiveWorkspace = useCallback((workspace: Workspace) => {
    setActiveWorkspaceState(workspace)
    addRecentWorkspace(workspace.id)
  }, [addRecentWorkspace])

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
        activeWorkspace,
        sidebarOpen,
        favoriteProjectIds,
        favoriteWorkspaceIds,
        recentWorkspaceIds,
        setActiveSection,
        setActiveSubItem,
        setHoveredSection,
        navigateTo,
        setActiveProject,
        exitProject,
        setActiveWorkspace,
        setSidebarOpen,
        toggleFavorite,
        isFavorite,
        toggleWorkspaceFavorite,
        isWorkspaceFavorite,
        addRecentWorkspace,
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
