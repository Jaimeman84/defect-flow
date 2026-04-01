"use client"
import { useState, useTransition } from "react"
import { Trash2, Edit2, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LABEL_COLORS } from "@/lib/constants"
import { updateLabelAction, deleteLabelAction } from "@/app/actions/label.actions"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { Label } from "@prisma/client"

interface LabelListProps {
  labels: Label[]
}

export function LabelList({ labels }: LabelListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editColor, setEditColor] = useState("")
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const startEdit = (label: Label) => {
    setEditingId(label.id)
    setEditName(label.name)
    setEditColor(label.color)
  }

  const saveEdit = (id: string) => {
    startTransition(async () => {
      try {
        await updateLabelAction(id, editName, editColor)
        toast({ title: "Label updated" })
        setEditingId(null)
      } catch {
        toast({ title: "Failed to update label", variant: "destructive" })
      }
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm("Delete this label? It will be removed from all issues.")) return
    startTransition(async () => {
      try {
        await deleteLabelAction(id)
        toast({ title: "Label deleted" })
      } catch {
        toast({ title: "Failed to delete label", variant: "destructive" })
      }
    })
  }

  return (
    <div className="space-y-2">
      {labels.map((label) => (
        <div key={label.id} className="flex items-center gap-3 rounded-md border p-2">
          {editingId === label.id ? (
            <>
              <div className="flex flex-wrap gap-1">
                {LABEL_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setEditColor(c)}
                    className={cn("h-5 w-5 rounded-full transition-transform hover:scale-110", editColor === c && "ring-2 ring-offset-1 ring-primary")}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-7 flex-1 text-sm" />
              <Button size="icon" className="h-7 w-7" onClick={() => saveEdit(label.id)} disabled={isPending}>
                <Check className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditingId(null)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </>
          ) : (
            <>
              <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: label.color }} />
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white"
                style={{ backgroundColor: label.color }}
              >
                {label.name}
              </span>
              <span className="flex-1" />
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => startEdit(label)}>
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(label.id)} disabled={isPending}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
