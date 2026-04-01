import { StatusBadge } from "../shared/status-badge"
import { formatDateTime } from "@/lib/formatters"
import type { StatusHistory } from "@prisma/client"

interface StatusTimelineProps {
  history: StatusHistory[]
}

export function StatusTimeline({ history }: StatusTimelineProps) {
  return (
    <div className="space-y-2">
      {history.map((entry, i) => (
        <div key={entry.id} className="flex items-start gap-3 text-sm">
          <div className="flex flex-col items-center">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-border bg-background text-xs font-medium text-muted-foreground">
              {i + 1}
            </div>
            {i < history.length - 1 && (
              <div className="mt-1 h-4 w-px bg-border" />
            )}
          </div>
          <div className="flex-1 pb-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {entry.fromStatus && (
                <>
                  <StatusBadge status={entry.fromStatus as never} />
                  <span className="text-muted-foreground">→</span>
                </>
              )}
              <StatusBadge status={entry.toStatus as never} />
            </div>
            {entry.note && (
              <p className="mt-1 text-xs text-muted-foreground">{entry.note}</p>
            )}
            <p className="mt-0.5 text-xs text-muted-foreground">
              {entry.changedBy && <span className="font-medium">{entry.changedBy} · </span>}
              {formatDateTime(entry.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
