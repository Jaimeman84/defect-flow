"use client"
import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { LABEL_COLORS } from "@/lib/constants"
import { createLabelAction, updateLabelAction } from "@/app/actions/label.actions"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { Label as PrismaLabel } from "@prisma/client"

interface LabelFormProps {
  label?: PrismaLabel
  onDone?: () => void
}

export function LabelForm({ label, onDone }: LabelFormProps) {
  const [name, setName] = useState(label?.name ?? "")
  const [color, setColor] = useState(label?.color ?? LABEL_COLORS[0])
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    startTransition(async () => {
      try {
        if (label) {
          await updateLabelAction(label.id, name, color)
          toast({ title: "Label updated" })
        } else {
          await createLabelAction(name, color)
          toast({ title: "Label created" })
          setName("")
        }
        onDone?.()
      } catch {
        toast({ title: "Error saving label", variant: "destructive" })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-end gap-3">
        <div className="flex-1 space-y-1">
          <Label htmlFor="label-name">Label Name</Label>
          <Input
            id="label-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Regression"
            className="h-9"
          />
        </div>
        <Button type="submit" size="sm" disabled={!name.trim() || isPending}>
          {isPending ? "Saving..." : label ? "Save" : "Add Label"}
        </Button>
        {onDone && (
          <Button type="button" variant="outline" size="sm" onClick={onDone}>Cancel</Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {LABEL_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setColor(c)}
            className={cn(
              "h-6 w-6 rounded-full transition-transform hover:scale-110",
              color === c && "ring-2 ring-offset-1 ring-primary scale-110"
            )}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
      {name && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Preview:</span>
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white"
            style={{ backgroundColor: color }}
          >
            {name}
          </span>
        </div>
      )}
    </form>
  )
}
