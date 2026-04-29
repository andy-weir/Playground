import { Fragment, useMemo, useState } from 'react'
import {
  ArrowRight,
  Bell,
  ChevronRight,
  FileText,
  HelpCircle,
  Info,
  Plus,
  RotateCcw,
  Search,
  Check,
  Trash2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

import { GROUPS, IA, IANode, PATHS, isAncestor } from './data'

interface Answer {
  path: string[]
  at: number
}

interface Settings {
  showInternal: boolean
  showGroups: boolean
  treeMode: boolean
}

const DEFAULT_SETTINGS: Settings = {
  showInternal: true,
  showGroups: true,
  treeMode: false,
}

const TOP_NODES = IA.children!

function filterInternal(node: IANode, showInternal: boolean) {
  if (node.internal && !showInternal) return false
  return true
}

function describeLevel(node: IANode, path: IANode[], visibleChildCount: number) {
  if (path.length === 1) return 'Top-level destination'
  if (node.type === 'leaf') return 'Leaf page — end of this navigation path'
  if (node.type === 'template') return 'Dynamic record — one per item the user has created'
  return `Section with ${visibleChildCount} child${visibleChildCount === 1 ? '' : 'ren'}`
}

function InternalPill() {
  return (
    <span className="inline-flex items-center rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-destructive">
      Internal
    </span>
  )
}

function HintPill() {
  return (
    <span className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-900 dark:bg-amber-950 dark:text-amber-200">
      ⚠ note
    </span>
  )
}

interface NavItemProps {
  node: IANode
  active: boolean
  onClick: () => void
}

function NavItem({ node, active, onClick }: NavItemProps) {
  const Icon = node.icon ?? FileText
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group/item flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm font-medium transition-colors',
        'border-l-[3px] border-transparent',
        active
          ? 'border-l-primary bg-primary/10 text-primary'
          : 'text-foreground hover:bg-accent hover:text-accent-foreground'
      )}
    >
      <Icon
        className={cn(
          'h-4 w-4 shrink-0',
          active ? 'text-primary' : 'text-muted-foreground'
        )}
      />
      <span className="truncate">{node.label}</span>
      {node.internal && (
        <span className="ml-auto">
          <InternalPill />
        </span>
      )}
    </button>
  )
}

interface CardItemProps {
  node: IANode
  showInternal: boolean
  onClick: () => void
}

function NodeCard({ node, showInternal, onClick }: CardItemProps) {
  const isLeaf = !node.children || node.children.length === 0
  const isTemplate = node.type === 'template'
  const childCount = (node.children ?? []).filter((c) => filterInternal(c, showInternal)).length

  const meta = isTemplate
    ? 'Dynamic record'
    : isLeaf
      ? 'Leaf page'
      : `${childCount} item${childCount === 1 ? '' : 's'}`

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      className="group flex cursor-pointer flex-col gap-1.5 p-4 transition-all hover:border-foreground/20 hover:shadow-sm"
    >
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className="truncate">{node.label}</span>
        {node.internal && <InternalPill />}
        {isLeaf && !isTemplate && (
          <FileText className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
        )}
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{meta}</span>
        {node.hint && <HintPill />}
      </div>
      {(!isLeaf || isTemplate) && (
        <div className="mt-auto flex justify-end pt-1 text-muted-foreground">
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      )}
    </Card>
  )
}

function PseudoContent({ label }: { label: string }) {
  return (
    <Card className="p-5">
      <div className="mb-3 text-sm font-semibold">{label} page</div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-full" />
      </div>
      <p className="mt-4 border-t pt-3 text-xs text-muted-foreground">
        Leaf endpoint — in production this would render the actual {label.toLowerCase()} page.
      </p>
    </Card>
  )
}

function DepthBadge({ depth }: { depth: number }) {
  const tone =
    depth >= 4
      ? 'bg-destructive/10 text-destructive'
      : depth >= 3
        ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
        : 'bg-primary/10 text-primary'
  return (
    <span
      className={cn(
        'whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold',
        tone
      )}
      title="Path depth from root"
    >
      Depth {depth}
      {depth >= 3 ? ' — review' : ''}
    </span>
  )
}

function IANote({ hint }: { hint: string }) {
  return (
    <div className="mb-4 flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200">
      <Info className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        <strong className="font-semibold">IA note:</strong> {hint}
      </div>
    </div>
  )
}

export default function FeathrIA() {
  const [currentId, setCurrentId] = useState<string>('dashboard')
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [justAddedIdx, setJustAddedIdx] = useState<number>(-1)
  const [createOpen, setCreateOpen] = useState(false)

  const { showInternal, showGroups, treeMode } = settings

  const path = PATHS[currentId] ?? []
  const node = path[path.length - 1]
  const depth = Math.max(0, path.length - 1)
  const visibleChildren = useMemo(
    () => (node?.children ?? []).filter((c) => filterInternal(c, showInternal)),
    [node, showInternal]
  )

  const navigate = (id: string) => {
    if (!PATHS[id]) return
    setCurrentId(id)
    const main = document.getElementById('feathr-ia-main')
    if (main) main.scrollTop = 0
  }

  const recordAnswer = () => {
    if (!node) return
    const labels = path.slice(1).map((n) => n.label)
    const next = [...answers, { path: labels, at: Date.now() }]
    setAnswers(next)
    setJustAddedIdx(next.length - 1)
    window.setTimeout(() => setJustAddedIdx(-1), 1700)
  }

  const reset = () => {
    setCurrentId('dashboard')
    setSettings(DEFAULT_SETTINGS)
    setAnswers([])
    setJustAddedIdx(-1)
  }

  const utilityItems = TOP_NODES.filter((c) => c.section === 'utility').filter((c) =>
    filterInternal(c, showInternal)
  )
  const createNode = TOP_NODES.find((c) => c.id === 'create')

  return (
    <div
      className="grid h-full grid-rows-[56px_minmax(0,1fr)] bg-muted/30"
      style={{ gridTemplateColumns: '248px 1fr' }}
    >
      {/* Top bar */}
      <header className="col-span-2 flex items-center gap-3 border-b bg-background px-4">
        <div className="flex w-[216px] items-center gap-2 font-semibold text-primary">
          <span
            aria-hidden
            className="inline-block h-5 w-5 rounded-md bg-gradient-to-br from-primary to-primary/70"
          />
          <span>Feathr</span>
        </div>

        <Breadcrumb className="flex-1">
          <BreadcrumbList>
            {path.slice(1).map((n, i) => {
              const isLast = i === path.length - 2
              return (
                <Fragment key={n.id}>
                  {i > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{n.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <button type="button" onClick={() => navigate(n.id)}>
                          {n.label}
                        </button>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-1.5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              disabled
              placeholder="Search…"
              aria-label="Search Feathr (disabled in prototype)"
              className="h-8 w-56 pl-8 text-sm"
            />
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Help">
            <HelpCircle className="h-4 w-4" />
          </Button>
          <Avatar className="h-7 w-7 cursor-pointer">
            <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
              A
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Sidebar */}
      <nav
        aria-label="Primary"
        className="flex flex-col overflow-y-auto border-r bg-background py-2"
      >
        {/* Create button */}
        <div className="px-2">
          <DropdownMenu open={createOpen} onOpenChange={setCreateOpen}>
            <DropdownMenuTrigger asChild>
              <Button className="w-full justify-center gap-2" aria-haspopup="menu">
                <Plus className="h-4 w-4" />
                Create
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={6}
              className="w-[--radix-dropdown-menu-trigger-width] min-w-[220px]"
            >
              <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Create new
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {createNode?.children?.map((c) => {
                const Icon = c.icon ?? FileText
                return (
                  <DropdownMenuItem
                    key={c.id}
                    onClick={() => {
                      navigate(c.id)
                      setCreateOpen(false)
                    }}
                    className="gap-2.5"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1">{c.label}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Workspace groups */}
        <div className="mt-1 flex flex-col gap-1">
          {showGroups ? (
            GROUPS.map((group) => {
              const items = TOP_NODES.filter((c) => c.section === group.section).filter((c) =>
                filterInternal(c, showInternal)
              )
              if (items.length === 0) return null
              return (
                <div key={group.section} className={cn('px-2', group.label && 'mt-2')}>
                  {group.label && (
                    <div className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {group.label}
                    </div>
                  )}
                  <div className="flex flex-col gap-0.5">
                    {items.map((item) => (
                      <NavItem
                        key={item.id}
                        node={item}
                        active={
                          item.id === currentId || isAncestor(item.id, currentId)
                        }
                        onClick={() => navigate(item.id)}
                      />
                    ))}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="flex flex-col gap-0.5 px-2">
              {TOP_NODES.filter((c) =>
                ['overview', 'programs', 'library', 'insights'].includes(c.section ?? '')
              )
                .filter((c) => filterInternal(c, showInternal))
                .map((item) => (
                  <NavItem
                    key={item.id}
                    node={item}
                    active={item.id === currentId || isAncestor(item.id, currentId)}
                    onClick={() => navigate(item.id)}
                  />
                ))}
            </div>
          )}
        </div>

        {/* Utility section */}
        <div className="mt-auto flex flex-col gap-0.5 border-t px-2 pt-2">
          {utilityItems.map((item) => (
            <NavItem
              key={item.id}
              node={item}
              active={item.id === currentId || isAncestor(item.id, currentId)}
              onClick={() => navigate(item.id)}
            />
          ))}
        </div>
      </nav>

      {/* Main */}
      <main id="feathr-ia-main" className="overflow-y-auto p-6">
        <div className="mx-auto max-w-6xl">
          {treeMode && (
            <div className="mb-4 flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
              <div className="flex-1">
                <div className="text-sm font-semibold text-primary">
                  Tree-test mode is on
                </div>
                <div className="text-xs text-primary/80">
                  Navigate to where you'd find your answer, then confirm.
                </div>
              </div>
              <Button onClick={recordAnswer} className="gap-1.5">
                <Check className="h-4 w-4" />
                I'd find it here
              </Button>
            </div>
          )}

          {node && (
            <>
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                    {node.label}
                    {node.internal && <InternalPill />}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {describeLevel(node, path, visibleChildren.length)}
                  </p>
                </div>
                <DepthBadge depth={depth} />
              </div>

              {node.hint && <IANote hint={node.hint} />}

              {visibleChildren.length === 0 ? (
                <PseudoContent label={node.label} />
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {visibleChildren.map((child) => (
                    <NodeCard
                      key={child.id}
                      node={child}
                      showInternal={showInternal}
                      onClick={() => navigate(child.id)}
                    />
                  ))}
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
                  Children: {visibleChildren.length}
                </span>
                <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
                  Path: /{path.map((p) => p.id).slice(1).join('/')}
                </span>
                {node.type === 'template' && (
                  <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-medium text-violet-900 dark:bg-violet-950 dark:text-violet-200">
                    Dynamic record
                  </span>
                )}
              </div>

              {treeMode && (
                <Card className="mt-4 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Recorded answers {answers.length > 0 && `(${answers.length})`}
                    </h4>
                    {answers.length > 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 gap-1 px-2 text-[11px]"
                        onClick={() => {
                          setAnswers([])
                          setJustAddedIdx(-1)
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                        Clear
                      </Button>
                    )}
                  </div>
                  {answers.length === 0 ? (
                    <p className="text-xs italic text-muted-foreground">
                      No answers recorded yet. Navigate and click "I'd find it here" to log a path.
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {answers.map((a, i) => (
                        <div
                          key={a.at}
                          className={cn(
                            'flex items-center gap-2 rounded-md px-2 py-1.5 font-mono text-xs transition-colors',
                            i === justAddedIdx
                              ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
                              : 'bg-muted text-foreground'
                          )}
                        >
                          <span className="font-semibold text-muted-foreground">
                            {i + 1}.
                          </span>
                          <span>{a.path.join(' › ')}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )}
            </>
          )}
        </div>
      </main>

      {/* Floating controls */}
      <Card className="fixed bottom-4 right-4 z-50 flex w-[280px] flex-col gap-2 p-3 text-xs shadow-lg">
        <div className="flex items-center justify-between border-b pb-2 text-[12px] font-bold">
          Prototype controls
        </div>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={showInternal}
            onChange={(e) => setSettings((s) => ({ ...s, showInternal: e.target.checked }))}
            className="h-4 w-4 cursor-pointer accent-primary"
          />
          Show internal-only items
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={showGroups}
            onChange={(e) => setSettings((s) => ({ ...s, showGroups: e.target.checked }))}
            className="h-4 w-4 cursor-pointer accent-primary"
          />
          Group sidebar sections
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={treeMode}
            onChange={(e) => setSettings((s) => ({ ...s, treeMode: e.target.checked }))}
            className="h-4 w-4 cursor-pointer accent-primary"
          />
          Tree-test mode
        </label>
        <Button size="sm" variant="outline" onClick={reset} className="h-7 gap-1.5 text-xs">
          <RotateCcw className="h-3 w-3" />
          Reset prototype
        </Button>
        <p className="text-[11px] leading-snug text-muted-foreground">
          In tree-test mode, navigate to where you'd find the answer, then click{' '}
          <strong>Confirm</strong>. Recorded answers appear on the page.
        </p>
      </Card>
    </div>
  )
}
