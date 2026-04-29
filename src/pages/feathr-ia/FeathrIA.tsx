import { Fragment, useCallback, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  Bell,
  ChevronRight,
  Download,
  FileText,
  HelpCircle,
  Info,
  Plus,
  RotateCcw,
  Search,
  Check,
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
import CampaignsPage from '@/pages/CampaignsPage'
import type { CampaignType } from '@/lib/campaignTypes'

import {
  GROUPS,
  IA,
  IANode,
  PATHS,
  TREE_TEST_TASKS,
  isAncestor,
  shuffleArray,
  type TreeTestAnswer,
  type TreeTestSession,
} from './data'

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

// Maps Feathr IA campaign nodes to the CampaignsPage typeFilter.
// Nodes mapped to undefined render the unfiltered table.
const CAMPAIGN_TABLE_NODES: Record<string, CampaignType | undefined> = {
  campaigns: undefined,
  'campaigns-all': undefined,
  'campaigns-other': undefined,
  'campaigns-ads': 'ads',
  'campaigns-email': 'email',
  'campaigns-google': 'google-ad-grants',
  'campaigns-meta': 'meta',
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
  const [createOpen, setCreateOpen] = useState(false)

  // Tree test research state
  const [session, setSession] = useState<TreeTestSession | null>(null)
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [participantId, setParticipantId] = useState('')
  const nodesVisitedRef = useRef<string[]>([])
  const taskStartRef = useRef<number>(0)

  const { showInternal, showGroups, treeMode } = settings

  const path = PATHS[currentId] ?? []
  const node = path[path.length - 1]
  const depth = Math.max(0, path.length - 1)
  const visibleChildren = useMemo(
    () => (node?.children ?? []).filter((c) => filterInternal(c, showInternal)),
    [node, showInternal]
  )

  const taskOrder = session?.taskOrder ?? []
  const currentTask = session
    ? TREE_TEST_TASKS.find((t) => t.id === taskOrder[currentTaskIndex])
    : null
  const allTasksDone = session ? currentTaskIndex >= taskOrder.length : false
  const showNavContent = !treeMode || (session && !allTasksDone)

  const navigate = useCallback((id: string) => {
    if (!PATHS[id]) return
    setCurrentId(id)
    nodesVisitedRef.current = [...nodesVisitedRef.current, id]
    const main = document.getElementById('feathr-ia-main')
    if (main) main.scrollTop = 0
  }, [])

  const startSession = useCallback(() => {
    const order = shuffleArray(TREE_TEST_TASKS.map((t) => t.id))
    setSession({
      participantId,
      startedAt: Date.now(),
      answers: [],
      taskOrder: order,
    })
    setCurrentTaskIndex(0)
    setCurrentId('dashboard')
    nodesVisitedRef.current = ['dashboard']
    taskStartRef.current = Date.now()
  }, [participantId])

  const recordAnswer = useCallback(() => {
    if (!session || !currentTask) return
    const answerPath = PATHS[currentId]
    if (!answerPath) return

    const labels = answerPath.slice(1).map((n) => n.label)
    const isSuccess = currentTask.expectedAnswers.includes(currentId)
    const isDirect = isSuccess && nodesVisitedRef.current.length <= answerPath.length

    const answer: TreeTestAnswer = {
      taskId: currentTask.id,
      path: labels,
      nodeId: currentId,
      pathVisited: [...nodesVisitedRef.current],
      startTime: taskStartRef.current,
      endTime: Date.now(),
      success: isSuccess,
      direct: isDirect,
    }

    setSession((prev) => {
      if (!prev) return prev
      return { ...prev, answers: [...prev.answers, answer] }
    })
    setCurrentTaskIndex((prev) => prev + 1)
    setCurrentId('dashboard')
    nodesVisitedRef.current = ['dashboard']
    taskStartRef.current = Date.now()
  }, [session, currentTask, currentId])

  const exportResults = useCallback(() => {
    if (!session) return
    const data = {
      participantId: session.participantId,
      startedAt: new Date(session.startedAt).toISOString(),
      exportedAt: new Date().toISOString(),
      tasks: session.answers.map((a) => {
        const task = TREE_TEST_TASKS.find((t) => t.id === a.taskId)
        return {
          taskId: a.taskId,
          prompt: task?.prompt,
          category: task?.category,
          researchQuestion: task?.researchQuestion,
          answeredAt: a.nodeId,
          pathLabels: a.path,
          nodesVisited: a.pathVisited,
          timeMs: a.endTime - a.startTime,
          success: a.success,
          direct: a.direct,
        }
      }),
      summary: {
        totalTasks: session.answers.length,
        successes: session.answers.filter((a) => a.success).length,
        directSuccesses: session.answers.filter((a) => a.direct).length,
        avgTimeMs: session.answers.length
          ? Math.round(
              session.answers.reduce((s, a) => s + (a.endTime - a.startTime), 0) /
                session.answers.length
            )
          : 0,
      },
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tree-test-${session.participantId}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [session])

  const reset = () => {
    setCurrentId('dashboard')
    setSettings(DEFAULT_SETTINGS)
    setSession(null)
    setCurrentTaskIndex(0)
    setParticipantId('')
    nodesVisitedRef.current = []
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
          {/* Tree test: participant ID entry */}
          {treeMode && !session && (
            <Card className="mx-auto mt-10 max-w-sm p-6 text-center">
              <h3 className="text-lg font-bold">Tree Test Session</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter a participant ID to begin. You'll be shown {TREE_TEST_TASKS.length} tasks in random order.
              </p>
              <Input
                value={participantId}
                onChange={(e) => setParticipantId(e.target.value)}
                placeholder="Participant ID (e.g., P01)"
                className="mt-4"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && participantId.trim()) startSession()
                }}
              />
              <Button
                onClick={startSession}
                disabled={!participantId.trim()}
                className="mt-3 w-full"
              >
                Start Session
              </Button>
            </Card>
          )}

          {/* Tree test: completion screen */}
          {treeMode && session && allTasksDone && (
            <>
              <Card className="mb-4 border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900 dark:bg-emerald-950/40">
                <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
                  Session Complete
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  All {session.answers.length} tasks recorded for participant{' '}
                  <strong>{session.participantId}</strong>.
                </p>
                <div className="mt-4 flex justify-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {session.answers.filter((a) => a.success).length}/{session.answers.length}
                    </div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Success
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {session.answers.filter((a) => a.direct).length}/{session.answers.length}
                    </div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Direct
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {session.answers.length
                        ? Math.round(
                            session.answers.reduce(
                              (s, a) => s + (a.endTime - a.startTime),
                              0
                            ) /
                              session.answers.length /
                              1000
                          )
                        : 0}
                      s
                    </div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Avg Time
                    </div>
                  </div>
                </div>
                <Button onClick={exportResults} className="mt-4 gap-2">
                  <Download className="h-4 w-4" />
                  Download Results (JSON)
                </Button>
              </Card>

              {/* Answer log for completed session */}
              <AnswerLog answers={session.answers} />
            </>
          )}

          {/* Tree test: active task banner + prompt */}
          {treeMode && session && !allTasksDone && currentTask && (
            <>
              <div className="mb-4 flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
                <div className="flex-1">
                  <div className="text-sm font-semibold text-primary">
                    Tree-test mode
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
              <Card className="mb-4 border-primary/20 p-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Task {currentTaskIndex + 1} of {taskOrder.length}
                </div>
                <div className="mt-1 text-base font-semibold leading-relaxed">
                  {currentTask.prompt}
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground">
                  {currentTask.category}
                </div>
              </Card>
            </>
          )}

          {/* Normal navigation content */}
          {showNavContent && node && (
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

              {node.id === 'campaigns' && (
                <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

              {node.id in CAMPAIGN_TABLE_NODES ? (
                <CampaignsPage typeFilter={CAMPAIGN_TABLE_NODES[node.id]} />
              ) : visibleChildren.length === 0 ? (
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

              {/* In-progress answer log during active session */}
              {treeMode && session && !allTasksDone && session.answers.length > 0 && (
                <div className="mt-4">
                  <AnswerLog answers={session.answers} />
                </div>
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
            onChange={(e) => {
              setSettings((s) => ({ ...s, treeMode: e.target.checked }))
              if (!e.target.checked) {
                setSession(null)
                setCurrentTaskIndex(0)
                setParticipantId('')
                nodesVisitedRef.current = []
              }
            }}
            className="h-4 w-4 cursor-pointer accent-primary"
          />
          Tree-test mode
        </label>
        <Button size="sm" variant="outline" onClick={reset} className="h-7 gap-1.5 text-xs">
          <RotateCcw className="h-3 w-3" />
          Reset prototype
        </Button>
        <p className="text-[11px] leading-snug text-muted-foreground">
          In tree-test mode, enter a participant ID, complete {TREE_TEST_TASKS.length} tasks, then
          export results as JSON for synthesis.
        </p>
      </Card>
    </div>
  )
}

function AnswerLog({ answers }: { answers: TreeTestAnswer[] }) {
  return (
    <Card className="p-4">
      <h4 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        Recorded answers ({answers.length})
      </h4>
      <div className="space-y-1">
        {answers.map((a, i) => {
          return (
            <div
              key={`${a.taskId}-${a.endTime}`}
              className={cn(
                'flex items-center gap-2 rounded-md px-2 py-1.5 font-mono text-xs',
                a.success
                  ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
                  : 'bg-destructive/10 text-destructive'
              )}
            >
              <span className="font-semibold text-muted-foreground">{i + 1}.</span>
              <span className="flex-1 truncate">{a.path.join(' > ')}</span>
              <span className="ml-auto text-[11px] font-semibold">
                {a.success ? (a.direct ? 'Direct' : 'Indirect') : 'Fail'}
              </span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
