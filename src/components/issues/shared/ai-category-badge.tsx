import { cn } from "@/lib/utils"
import { AI_CATEGORY_CONFIG } from "@/lib/constants"
import type { AIIssueCategory } from "@/lib/constants"

interface AICategoryBadgeProps {
  category: AIIssueCategory | string
  className?: string
}

export function AICategoryBadge({ category, className }: AICategoryBadgeProps) {
  const config = AI_CATEGORY_CONFIG[category as AIIssueCategory]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
        className
      )}
    >
      <span>🤖</span>
      {config?.label ?? category}
    </span>
  )
}
