import { FileText, FolderKanban, Star, Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/layout'
import { useNavigation } from '@/components/layout/NavigationContext'
import { allNavigationItems, projectNavigationItems, projectSettingsItem, sampleProjects, sampleWorkspaces } from '@/components/layout/navigation'
import { cn } from '@/lib/utils'

function EmptyState() {
  return (
    <Card className="flex-1">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">Content Area</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          This is a placeholder for page content. Components, data tables, forms, or any other content would go here.
        </p>
      </CardContent>
    </Card>
  )
}

function ProjectsGrid() {
  const { setActiveProject, toggleFavorite, isFavorite } = useNavigation()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sampleProjects.map((project) => {
        const favorited = isFavorite(project.id)
        return (
          <Card
            key={project.id}
            className="group relative cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
            onClick={() => setActiveProject(project)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFavorite(project.id)
              }}
              className={cn(
                'absolute top-3 right-3 p-1 rounded-md transition-opacity z-10',
                'hover:bg-muted',
                favorited ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              )}
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star
                className={cn(
                  'h-4 w-4',
                  favorited
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground'
                )}
              />
            </button>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <FolderKanban className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">{project.name}</h3>
                <p className="text-sm text-muted-foreground">Click to open project</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function AccountsGrid() {
  const { toggleWorkspaceFavorite, isWorkspaceFavorite, activeWorkspace, setActiveWorkspace } = useNavigation()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sampleWorkspaces.map((workspace) => {
        const favorited = isWorkspaceFavorite(workspace.id)
        const isActive = activeWorkspace.id === workspace.id
        return (
          <Card
            key={workspace.id}
            className={cn(
              'group relative cursor-pointer hover:border-primary/50 hover:shadow-md transition-all',
              isActive && 'border-primary ring-1 ring-primary'
            )}
            onClick={() => setActiveWorkspace(workspace)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleWorkspaceFavorite(workspace.id)
              }}
              className={cn(
                'absolute top-3 right-3 p-1 rounded-md transition-opacity z-10',
                'hover:bg-muted',
                favorited ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              )}
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star
                className={cn(
                  'h-4 w-4',
                  favorited
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground'
                )}
              />
            </button>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={cn(
                'h-12 w-12 rounded-lg overflow-hidden ring-2',
                isActive ? 'ring-primary' : 'ring-transparent'
              )}>
                <img
                  src={workspace.image}
                  alt={workspace.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{workspace.name}</h3>
                  {isActive && <Check className="h-4 w-4 text-primary shrink-0" />}
                </div>
                <p className="text-sm text-muted-foreground">{workspace.plan}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default function Home() {
  const { activeSection, activeSubItem, activeProject } = useNavigation()

  // Projects page (no active project) - show projects grid
  const isProjectsPage = activeSection === 'projects' && !activeProject
  // Accounts page - show accounts grid
  const isAccountsPage = activeSection === 'accounts' && !activeProject

  // Get navigation items based on context
  const navigationItems = activeProject
    ? [...projectNavigationItems, projectSettingsItem]
    : allNavigationItems

  // Find current section
  const currentSection = navigationItems.find((item) => item.id === activeSection)
  const sectionTitle = currentSection?.title || 'Dashboard'

  // Find the active sub-item and its parent (for nested items)
  let parentItem: { id: string; title: string } | null = null
  let activeItem: { id: string; title: string } | null = null

  if (currentSection?.children) {
    for (const child of currentSection.children) {
      // Check if this child is the active item
      if (child.id === activeSubItem) {
        activeItem = child
        break
      }
      // Check if a nested child is the active item
      if (child.children) {
        const nestedChild = child.children.find((nc) => nc.id === activeSubItem)
        if (nestedChild) {
          parentItem = child
          activeItem = nestedChild
          break
        }
      }
    }
  }

  // Build breadcrumbs with full hierarchy
  const buildBreadcrumbs = () => {
    const crumbs = [{ label: 'Home', href: '#' }]

    if (activeProject) {
      crumbs.push({ label: activeProject.name, href: '#' })
    }

    crumbs.push({ label: sectionTitle, href: '#' })

    // Add parent item if we have nested navigation (e.g., People, Super Pixel)
    if (parentItem) {
      crumbs.push({ label: parentItem.title, href: '#' })
    }

    return crumbs
  }

  const breadcrumbs = buildBreadcrumbs()

  // Page title is the deepest selected item
  const pageTitle = (isProjectsPage || isAccountsPage) ? sectionTitle : (activeItem?.title || 'Overview')

  const renderContent = () => {
    if (isProjectsPage) return <ProjectsGrid />
    if (isAccountsPage) return <AccountsGrid />
    return <EmptyState />
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <PageHeader
        title={pageTitle}
        breadcrumbs={breadcrumbs}
      />
      {renderContent()}
    </div>
  )
}
