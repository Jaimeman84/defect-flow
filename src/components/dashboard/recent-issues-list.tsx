import Link from "next/link"
import { formatRelativeTime } from "@/lib/formatters"
import { StatusBadge } from "@/components/issues/shared/status-badge"
import { SeverityBadge } from "@/components/issues/shared/severity-badge"
import { IssueTypeIcon } from "@/components/issues/shared/issue-type-icon"

interface RecentIssuesListProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  issues: any[]
}

export function RecentIssuesList({ issues }: RecentIssuesListProps) {
  if (issues.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">No issues yet.</p>
  }
  return (
    <div className="space-y-0">
      {issues.map((issue) => (
        <Link
          key={issue.id}
          href={`/issues/${issue.id}`}
          className="flex items-center gap-3 rounded-md px-2 py-2.5 hover:bg-muted/50 transition-colors"
        >
          <IssueTypeIcon type={issue.issueType} className="shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">{issue.title}</p>
            <p className="text-xs text-muted-foreground">{issue.project.name}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <SeverityBadge severity={issue.severity} />
            <StatusBadge status={issue.status} />
            <span className="text-xs text-muted-foreground hidden sm:block">
              {formatRelativeTime(issue.createdAt)}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
