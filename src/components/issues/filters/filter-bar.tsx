"use client"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { SearchInput } from "./search-input"
import { X } from "lucide-react"
import type { Label } from "@prisma/client"

interface FilterBarProps {
  labels: Label[]
  projectId?: string
}

const STATUS_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "TRIAGED", label: "Triaged" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "READY_FOR_RETEST", label: "Ready for Retest" },
  { value: "CLOSED", label: "Closed" },
  { value: "REJECTED", label: "Rejected" },
  { value: "DUPLICATE", label: "Duplicate" },
]

const SEVERITY_OPTIONS = [
  { value: "CRITICAL", label: "Critical" },
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
  { value: "INFO", label: "Info" },
]

const PRIORITY_OPTIONS = [
  { value: "URGENT", label: "Urgent" },
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
]

const TYPE_OPTIONS = [
  { value: "BUG", label: "Bug" },
  { value: "AI_ISSUE", label: "AI Issue" },
]

export function FilterBar({ labels, projectId }: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== "all") {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete("page")
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  const clearAll = useCallback(() => {
    const params = new URLSearchParams()
    if (projectId) params.set("projectId", projectId)
    router.push(`${pathname}?${params.toString()}`)
  }, [pathname, router, projectId])

  const hasFilters =
    searchParams.has("status") ||
    searchParams.has("severity") ||
    searchParams.has("priority") ||
    searchParams.has("type") ||
    searchParams.has("labelId") ||
    searchParams.has("search")

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchInput
        value={searchParams.get("search") ?? ""}
        onChange={(val) => updateParam("search", val || null)}
      />

      <Select
        value={searchParams.get("status") ?? "all"}
        onValueChange={(val) => updateParam("status", val)}
      >
        <SelectTrigger className="h-9 w-36">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {STATUS_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("severity") ?? "all"}
        onValueChange={(val) => updateParam("severity", val)}
      >
        <SelectTrigger className="h-9 w-32">
          <SelectValue placeholder="Severity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Severities</SelectItem>
          {SEVERITY_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("priority") ?? "all"}
        onValueChange={(val) => updateParam("priority", val)}
      >
        <SelectTrigger className="h-9 w-32">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          {PRIORITY_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("type") ?? "all"}
        onValueChange={(val) => updateParam("type", val)}
      >
        <SelectTrigger className="h-9 w-28">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {TYPE_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {labels.length > 0 && (
        <Select
          value={searchParams.get("labelId") ?? "all"}
          onValueChange={(val) => updateParam("labelId", val)}
        >
          <SelectTrigger className="h-9 w-32">
            <SelectValue placeholder="Label" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Labels</SelectItem>
            {labels.map((l) => (
              <SelectItem key={l.id} value={l.id}>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: l.color }} />
                  {l.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearAll} className="h-9 gap-1.5 text-muted-foreground">
          <X className="h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  )
}
