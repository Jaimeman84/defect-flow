"use client"
import { useState, useTransition } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { addTextNoteAction } from "@/app/actions/attachment.actions"
import { useToast } from "@/hooks/use-toast"

interface AddTextNoteFormProps {
  issueId: string
  onDone?: () => void
}

export function AddTextNoteForm({ issueId, onDone }: AddTextNoteFormProps) {
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    startTransition(async () => {
      try {
        await addTextNoteAction(issueId, content, title || undefined)
        toast({ title: "Note added" })
        setContent("")
        setTitle("")
        onDone?.()
      } catch {
        toast({ title: "Failed to add note", variant: "destructive" })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (optional)"
        className="h-9 text-sm"
      />
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Paste prompt/completion pair, stack trace, log output..."
        className="min-h-[120px] font-mono text-xs"
        required
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={!content.trim() || isPending}>
          {isPending ? "Adding..." : "Add Note"}
        </Button>
        {onDone && (
          <Button type="button" variant="outline" size="sm" onClick={onDone}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
