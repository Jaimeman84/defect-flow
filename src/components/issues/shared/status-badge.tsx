import { cn } from "@/lib/utils"
import { STATUS_CONFIG } from "@/lib/constants"
import type { IssueStatus } from "@/lib/constants"

interface StatusBadgeProps {
  status: IssueStatus | string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status as IssueStatus]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        config.bgColor,
        config.textColor,
        className
      )}
    >
      {config.label}
    </span>
  )
}
