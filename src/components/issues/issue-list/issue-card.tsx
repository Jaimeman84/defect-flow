import Link from "next/link"
import { formatRelativeTime } from "@/lib/formatters"
import { StatusBadge } from "../shared/status-badge"
import { SeverityBadge } from "../shared/severity-badge"
import { PriorityIndicator } from "../shared/priority-indicator"
import { IssueTypeIcon } from "../shared/issue-type-icon"
import { LabelChip } from "../shared/label-chip"
import { AICategoryBadge } from "../shared/ai-category-badge"
import { MessageSquare, Paperclip } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { IssueListItem } from "@/types/issue.types"

interface IssueCardProps {
  issue: IssueListItem
}

export function IssueCard({ issue }: IssueCardProps) {
  return (
    <Link href={`/issues/${issue.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start gap-2 mb-2">
            <IssueTypeIcon type={issue.issueType} className="mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-snug line-clamp-2">{issue.title}</p>
            </div>
          </div>

          {issue.aiIssueCategory && (
            <div className="mb-2">
              <AICategoryBadge category={issue.aiIssueCategory} />
            </div>
          )}

          <div className="flex flex-wrap gap-1 mb-2">
            <StatusBadge status={issue.status} />
            <SeverityBadge severity={issue.severity} />
          </div>

          {issue.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {issue.labels.map(({ label }) => (
                <LabelChip key={label.id} name={label.name} color={label.color} />
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{issue.project.name}</span>
            <div className="flex items-center gap-2">
              <PriorityIndicator priority={issue.priority} />
              {issue._count.comments > 0 && (
                <span className="flex items-center gap-0.5">
                  <MessageSquare className="h-3 w-3" />
                  {issue._count.comments}
                </span>
              )}
              <span>{formatRelativeTime(issue.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
