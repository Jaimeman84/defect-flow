"use client"
import { useState, useTransition } from "react"
import { ChevronDown } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { StatusBadge } from "../shared/status-badge"
import { ALLOWED_STATUS_TRANSITIONS, STATUS_CONFIG } from "@/lib/constants"
import { changeStatusAction } from "@/app/actions/issue.actions"
import { useToast } from "@/hooks/use-toast"
import type { IssueStatus } from "@/lib/constants"

interface StatusChangeDialogProps {
  issueId: string
  currentStatus: IssueStatus | string
}

export function StatusChangeDialog({ issueId, currentStatus }: StatusChangeDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | null>(null)
  const [note, setNote] = useState("")
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const allowed = ALLOWED_STATUS_TRANSITIONS[currentStatus as IssueStatus] ?? []

  const handleConfirm = () => {
    if (!selectedStatus) return
    startTransition(async () => {
      try {
        await changeStatusAction(issueId, selectedStatus, note || undefined)
        toast({ title: "Status updated", description: `Changed to ${STATUS_CONFIG[selectedStatus].label}` })
        setOpen(false)
        setNote("")
        setSelectedStatus(null)
      } catch (e) {
        toast({ title: "Error", description: String(e), variant: "destructive" })
      }
    })
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => setOpen(true)}
        disabled={allowed.length === 0}
      >
        <StatusBadge status={currentStatus} />
        <ChevronDown className="h-3.5 w-3.5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Status</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Current status</Label>
              <StatusBadge status={currentStatus} />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Move to</Label>
              <div className="grid grid-cols-2 gap-2">
                {allowed.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`rounded-md border px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                      selectedStatus === status ? "border-primary bg-muted" : ""
                    }`}
                  >
                    <StatusBadge status={status} />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {STATUS_CONFIG[status].description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="note" className="text-xs text-muted-foreground mb-1 block">
                Note (optional)
              </Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add context for this status change..."
                className="min-h-[80px] text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirm} disabled={!selectedStatus || isPending}>
              {isPending ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
