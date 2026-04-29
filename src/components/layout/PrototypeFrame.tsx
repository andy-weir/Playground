import { ReactNode } from 'react'
import { ChevronLeft, GitBranch } from 'lucide-react'
import { Prototype } from '@/prototypes'

interface PrototypeFrameProps {
  prototype: Prototype
  children: ReactNode
}

export function PrototypeFrame({ prototype, children }: PrototypeFrameProps) {
  return (
    <div className="flex h-svh flex-col">
      <div className="flex h-11 shrink-0 items-center gap-3 border-b bg-background px-3">
        <a
          href="#/"
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeft className="h-4 w-4" />
          Feathr Prototype Playground
        </a>
        <div className="h-4 w-px bg-border" />
        <span className="text-sm font-medium">{prototype.title}</span>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <GitBranch className="h-3.5 w-3.5" />
          <code className="font-mono">{prototype.branch}</code>
        </div>
      </div>
      <div
        className="relative min-h-0 flex-1 overflow-auto transform-gpu"
        style={{ ['--app-height' as string]: 'calc(100svh - 2.75rem)' }}
      >
        {children}
      </div>
    </div>
  )
}
