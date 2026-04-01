import { cn } from "@/lib/utils"
import { SEVERITY_CONFIG } from "@/lib/constants"
import type { Severity } from "@/lib/constants"

interface SeverityBadgeProps {
  severity: Severity | string
  className?: string
  showDot?: boolean
}

export function SeverityBadge({ severity, className, showDot = false }: SeverityBadgeProps) {
  const config = SEVERITY_CONFIG[severity as Severity]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        config.bgColor,
        config.textColor,
        className
      )}
    >
      {showDot && <span className={cn("h-1.5 w-1.5 rounded-full", config.dotColor)} />}
      {config.label}
    </span>
  )
}
