import { useState, Fragment } from 'react'
import { ChevronRight, FolderKanban, MoreHorizontal } from 'lucide-react'
import { CampaignTypePill } from './CampaignTypePill'
import { StatusPill } from './StatusPill'
import { cn } from '@/lib/utils'
import type { Campaign, Flight } from '@/data/sampleCampaigns'
import { getProjectName, getCampaignsForFlight } from '@/data/sampleCampaigns'
import type { ColumnDef } from '@/lib/columnConfig'

interface CampaignTableProps {
  campaigns: Campaign[]
  flights: Flight[]
  groupByProject: boolean
  visibleColumns: ColumnDef[]
}

// --- Cell renderers ---

function formatNumber(value: number | undefined): string {
  if (value === undefined || value === null) return '—'
  if (value === 0) return '0'
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`
  return value.toLocaleString()
}

function formatCurrency(value: number | undefined): string {
  if (value === undefined || value === null) return '—'
  if (value === 0) return '$0'
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

function formatPercent(value: number | undefined): string {
  if (value === undefined || value === null) return '—'
  return `${value}%`
}

function formatCurrencyDecimal(value: number | undefined): string {
  if (value === undefined || value === null) return '—'
  if (value === 0) return '$0.00'
  return `$${value.toFixed(2)}`
}

function getCellValue(campaign: Campaign, columnId: string): string {
  switch (columnId) {
    case 'createdDate': return campaign.createdDate || '—'
    case 'startDate': return campaign.startDate || '—'
    case 'endDate': return campaign.endDate || '—'
    case 'views': return formatNumber(campaign.views)
    case 'clicks': return formatNumber(campaign.clicks)
    case 'spend': return formatCurrency(campaign.spend)
    case 'budget': return formatCurrency(campaign.budget)
    case 'conversions': return formatNumber(campaign.conversions)
    case 'conversionValue': return formatCurrency(campaign.conversionValue)
    case 'emailSends': return formatNumber(campaign.emailSends)
    case 'deliveries': return formatNumber(campaign.deliveries)
    case 'hardBounces': return formatNumber(campaign.hardBounces)
    case 'hardBounceRate': return formatPercent(campaign.hardBounceRate)
    case 'unsubscribes': return formatNumber(campaign.unsubscribes)
    case 'emailOpenRate': return formatPercent(campaign.emailOpenRate)
    case 'emailCtr': return formatPercent(campaign.emailCtr)
    case 'uniqueClicks': return formatNumber(campaign.uniqueClicks)
    case 'duration': return campaign.duration || '—'
    case 'cpm': return formatCurrencyDecimal(campaign.cpm)
    case 'adCtr': return formatPercent(campaign.adCtr)
    case 'cpc': return formatCurrencyDecimal(campaign.cpc)
    case 'cpa': return formatCurrencyDecimal(campaign.cpa)
    case 'partnerSpend': return formatCurrency(campaign.partnerSpend)
    case 'monetizationValue': return formatCurrency(campaign.monetizationValue)
    case 'targetViews': return formatNumber(campaign.targetViews)
    case 'seen': return formatNumber(campaign.seen)
    case 'budgetProgress': return campaign.budgetProgress !== undefined ? `${campaign.budgetProgress}%` : '—'
    case 'responses': return formatNumber(campaign.responses)
    case 'participants': return formatNumber(campaign.participants)
    case 'flight': return campaign.flight || '—'
    default: return '—'
  }
}

// --- Row components ---

function CampaignRow({ campaign, isFlightChild = false, columns }: {
  campaign: Campaign
  isFlightChild?: boolean
  columns: ColumnDef[]
}) {
  return (
    <tr className={cn('border-b border-border/50 hover:bg-muted/50 transition-colors', isFlightChild && 'bg-muted/20')}>
      {columns.map((col) => {
        if (col.id === 'name') {
          return (
            <td key={col.id} className="px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="w-4 shrink-0" />
                <div>
                  <span className="font-medium text-sm">{campaign.name}</span>
                  <span className="block text-xs text-muted-foreground">{getProjectName(campaign.projectId)}</span>
                </div>
              </div>
            </td>
          )
        }
        if (col.id === 'type') {
          return (
            <td key={col.id} className="px-4 py-3">
              <CampaignTypePill type={campaign.type} size="sm" />
            </td>
          )
        }
        if (col.id === 'status') {
          return (
            <td key={col.id} className="px-4 py-3">
              <StatusPill status={campaign.status} />
            </td>
          )
        }
        return (
          <td key={col.id} className="px-4 py-3 text-sm text-muted-foreground">
            {getCellValue(campaign, col.id)}
          </td>
        )
      })}
      {/* Actions column */}
      <td className="px-4 py-3">
        <button className="rounded-md p-1 text-muted-foreground hover:bg-muted transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </td>
    </tr>
  )
}

function FlightRow({ flight, columns }: { flight: Flight; columns: ColumnDef[] }) {
  const [expanded, setExpanded] = useState(false)
  const childCampaigns = getCampaignsForFlight(flight.id)

  return (
    <>
      <tr
        className={cn(
          'border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer',
          expanded && 'bg-muted/30'
        )}
        onClick={() => setExpanded(!expanded)}
      >
        {columns.map((col) => {
          if (col.id === 'name') {
            return (
              <td key={col.id} className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <ChevronRight
                    className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', expanded && 'rotate-90')}
                  />
                  <div>
                    <span className="font-medium text-sm">{flight.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {getProjectName(flight.projectId)} · {childCampaigns.length} campaigns
                    </span>
                  </div>
                </div>
              </td>
            )
          }
          if (col.id === 'type') {
            return (
              <td key={col.id} className="px-4 py-3">
                <CampaignTypePill type="flight" size="sm" />
              </td>
            )
          }
          if (col.id === 'status') {
            return (
              <td key={col.id} className="px-4 py-3">
                <StatusPill status={flight.status} />
              </td>
            )
          }
          if (col.id === 'createdDate') {
            return <td key={col.id} className="px-4 py-3 text-sm text-muted-foreground">{flight.createdDate}</td>
          }
          if (col.id === 'startDate') {
            return <td key={col.id} className="px-4 py-3 text-sm text-muted-foreground">{flight.startDate || '—'}</td>
          }
          if (col.id === 'endDate') {
            return <td key={col.id} className="px-4 py-3 text-sm text-muted-foreground">{flight.endDate || '—'}</td>
          }
          return <td key={col.id} className="px-4 py-3 text-sm text-muted-foreground">—</td>
        })}
        <td className="px-4 py-3">
          <button
            className="rounded-md p-1 text-muted-foreground hover:bg-muted transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </td>
      </tr>
      {expanded &&
        childCampaigns.map((campaign) => (
          <CampaignRow key={campaign.id} campaign={campaign} isFlightChild columns={columns} />
        ))}
    </>
  )
}

function ProjectGroupHeader({ projectId, count, expanded, onToggle, colSpan }: {
  projectId: string
  count: number
  expanded: boolean
  onToggle: () => void
  colSpan: number
}) {
  return (
    <tr
      className="bg-muted/40 cursor-pointer hover:bg-muted/60 transition-colors"
      onClick={onToggle}
    >
      <td colSpan={colSpan} className="px-4 py-2.5">
        <div className="flex items-center gap-2">
          <ChevronRight
            className={cn('h-4 w-4 text-muted-foreground transition-transform', expanded && 'rotate-90')}
          />
          <FolderKanban className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold">{getProjectName(projectId)}</span>
          <span className="text-xs text-muted-foreground">({count} campaigns)</span>
        </div>
      </td>
    </tr>
  )
}

export function CampaignTable({ campaigns, flights, groupByProject, visibleColumns }: CampaignTableProps) {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set(
    [...new Set(campaigns.map((c) => c.projectId))]
  ))

  const toggleProject = (projectId: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev)
      if (next.has(projectId)) next.delete(projectId)
      else next.add(projectId)
      return next
    })
  }

  const standaloneCampaigns = campaigns.filter((c) => !c.flightId)
  const visibleFlights = flights.filter((f) =>
    f.campaignIds.some((id) => campaigns.find((c) => c.id === id))
  )

  const totalColSpan = visibleColumns.length + 1 // +1 for actions

  const renderRows = (projectCampaigns: Campaign[], projectFlights: Flight[]) => {
    const rows: JSX.Element[] = []
    for (const flight of projectFlights) {
      rows.push(<FlightRow key={flight.id} flight={flight} columns={visibleColumns} />)
    }
    for (const campaign of projectCampaigns) {
      rows.push(<CampaignRow key={campaign.id} campaign={campaign} columns={visibleColumns} />)
    }
    return rows
  }

  return (
    <div className="rounded-lg border border-border overflow-x-auto">
      <table className="w-full min-w-max">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            {visibleColumns.map((col) => (
              <th
                key={col.id}
                className={cn(
                  'px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider',
                  col.width
                )}
              >
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3 w-[50px]"></th>
          </tr>
        </thead>
        <tbody>
          {groupByProject ? (
            (() => {
              const projectIds = [...new Set([
                ...standaloneCampaigns.map((c) => c.projectId),
                ...visibleFlights.map((f) => f.projectId),
              ])]
              return projectIds.map((projectId) => {
                const projectStandalone = standaloneCampaigns.filter((c) => c.projectId === projectId)
                const projectFlights = visibleFlights.filter((f) => f.projectId === projectId)
                const totalCount = projectStandalone.length + projectFlights.reduce(
                  (acc, f) => acc + f.campaignIds.length, 0
                )
                const isExpanded = expandedProjects.has(projectId)

                return (
                  <Fragment key={projectId}>
                    <ProjectGroupHeader
                      projectId={projectId}
                      count={totalCount}
                      expanded={isExpanded}
                      onToggle={() => toggleProject(projectId)}
                      colSpan={totalColSpan}
                    />
                    {isExpanded && renderRows(projectStandalone, projectFlights)}
                  </Fragment>
                )
              })
            })()
          ) : (
            renderRows(standaloneCampaigns, visibleFlights)
          )}
        </tbody>
      </table>
    </div>
  )
}
