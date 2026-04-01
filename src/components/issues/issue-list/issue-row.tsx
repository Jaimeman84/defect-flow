import Link from "next/link"
import { formatRelativeTime } from "@/lib/formatters"
import { StatusBadge } from "../shared/status-badge"
import { SeverityBadge } from "../shared/severity-badge"
import { PriorityIndicator } from "../shared/priority-indicator"
import { IssueTypeIcon } from "../shared/issue-type-icon"
import { LabelChip } from "../shared/label-chip"
import { MessageSquare, Paperclip } from "lucide-react"
import type { IssueListItem } from "@/types/issue.types"

interface IssueRowProps {
  issue: IssueListItem
}

export function IssueRow({ issue }: IssueRowProps) {
  return (
    <Link
      href={`/issues/${issue.id}`}
      className="flex items-center gap-3 border-b px-4 py-3 hover:bg-muted/50 transition-colors"
    >
      <IssueTypeIcon type={issue.issueType} className="shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="truncate text-sm font-medium">{issue.title}</span>
          {issue.labels.map(({ label }) => (
            <LabelChip key={label.id} name={label.name} color={label.color} />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">
            {issue.project.name}
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(issue.createdAt)}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <PriorityIndicator priority={issue.priority} />
        <SeverityBadge severity={issue.severity} />
        <StatusBadge status={issue.status} />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {issue._count.comments > 0 && (
            <span className="flex items-center gap-0.5">
              <MessageSquare className="h-3 w-3" />
              {issue._count.comments}
            </span>
          )}
          {issue._count.attachments > 0 && (
            <span className="flex items-center gap-0.5">
              <Paperclip className="h-3 w-3" />
              {issue._count.attachments}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
