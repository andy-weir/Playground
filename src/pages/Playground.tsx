import { ArrowRight, GitBranch } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { prototypes } from '@/prototypes'

function formatDate(iso: string) {
  const [year, month, day] = iso.split('-').map(Number) as [number, number, number]
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function Playground() {
  const sorted = [...prototypes]
    .reverse()
    .sort((a, b) => (b.mergedAt ?? b.createdAt).localeCompare(a.mergedAt ?? a.createdAt))

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-12">
          <h1 className="text-3xl font-semibold tracking-tight">
            Prototype Playground
          </h1>
          <p className="mt-2 text-muted-foreground">
            A directory of prototypes merged into{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">main</code>
            . Click any card to open the prototype.
          </p>
        </header>

        <div className="flex flex-col gap-4">
          {sorted.map((p) => (
            <Card
              key={p.slug}
              className="group h-full cursor-pointer p-6 transition-colors hover:border-foreground/20 hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              role="link"
              tabIndex={0}
              onClick={() => {
                window.location.hash = `/${p.slug}`
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  window.location.hash = `/${p.slug}`
                }
              }}
            >
              <div className="flex h-full flex-col">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold leading-tight">
                    {p.title}
                  </h2>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="mb-6 text-sm text-muted-foreground">
                  {p.description}
                </p>
                <div className="mt-auto flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <GitBranch className="h-3.5 w-3.5" />
                    <code className="font-mono">{p.branch}</code>
                  </span>
                  {p.prNumber !== undefined && (
                    <>
                      <span className="text-border">·</span>
                      <a
                        href={`https://github.com/andy-weir/Playground/pull/${p.prNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="font-mono hover:text-foreground hover:underline"
                      >
                        #{p.prNumber}
                      </a>
                    </>
                  )}
                  <span className="text-border">·</span>
                  <span>
                    {p.mergedAt
                      ? `Merged ${formatDate(p.mergedAt)}`
                      : `Created ${formatDate(p.createdAt)}`}
                  </span>
                  <span className="text-border">·</span>
                  <span>Created by {p.author}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {prototypes.length === 0 && (
          <Card className="p-12 text-center text-sm text-muted-foreground">
            No prototypes yet. Merge a branch and add an entry to{' '}
            <code className="rounded bg-muted px-1.5 py-0.5">
              src/prototypes.tsx
            </code>
            .
          </Card>
        )}
      </div>
    </div>
  )
}
