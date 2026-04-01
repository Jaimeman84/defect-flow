"use client"
import { useState } from "react"
import { LayoutList, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IssueRow } from "./issue-row"
import { IssueCard } from "./issue-card"
import { EmptyState } from "./empty-state"
import type { IssueListItem } from "@/types/issue.types"

interface IssueListProps {
  issues: IssueListItem[]
  total: number
}

export function IssueList({ issues, total }: IssueListProps) {
  const [view, setView] = useState<"list" | "grid">("list")

  if (issues.length === 0) {
    return <EmptyState />
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? "issue" : "issues"}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setView("list")}
          >
            <LayoutList className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setView("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {view === "list" ? (
        <div className="rounded-lg border bg-card overflow-hidden">
          {issues.map((issue) => (
            <IssueRow key={issue.id} issue={issue} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  )
}
