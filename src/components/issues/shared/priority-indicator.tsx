import { cn } from "@/lib/utils"
import { PRIORITY_CONFIG } from "@/lib/constants"
import type { Priority } from "@/lib/constants"

interface PriorityIndicatorProps {
  priority: Priority | string
  showLabel?: boolean
  className?: string
}

export function PriorityIndicator({ priority, showLabel = false, className }: PriorityIndicatorProps) {
  const config = PRIORITY_CONFIG[priority as Priority]
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs", config.color, className)}>
      <span>{config.icon}</span>
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}
