import { Bug, BrainCircuit } from "lucide-react"
import { cn } from "@/lib/utils"
import type { IssueType } from "@/lib/constants"

interface IssueTypeIconProps {
  type: IssueType | string
  className?: string
}

export function IssueTypeIcon({ type, className }: IssueTypeIconProps) {
  if (type === "AI_ISSUE") {
    return <BrainCircuit className={cn("h-4 w-4 text-violet-500", className)} />
  }
  return <Bug className={cn("h-4 w-4 text-red-500", className)} />
}
