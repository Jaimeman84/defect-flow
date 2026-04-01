import Link from "next/link"
import { Bug, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title?: string
  description?: string
  showCreate?: boolean
}

export function EmptyState({
  title = "No issues found",
  description = "Create your first issue to get started.",
  showCreate = true,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Bug className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="mb-1 text-base font-semibold">{title}</h3>
      <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      {showCreate && (
        <Link href="/issues/new">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            New Issue
          </Button>
        </Link>
      )}
    </div>
  )
}
