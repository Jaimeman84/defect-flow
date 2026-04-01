"use client"
import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { addLinkAction } from "@/app/actions/attachment.actions"
import { useToast } from "@/hooks/use-toast"

interface AddLinkFormProps {
  issueId: string
  onDone?: () => void
}

export function AddLinkForm({ issueId, onDone }: AddLinkFormProps) {
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    startTransition(async () => {
      try {
        await addLinkAction(issueId, url, title || undefined)
        toast({ title: "Link added" })
        setUrl("")
        setTitle("")
        onDone?.()
      } catch {
        toast({ title: "Failed to add link", variant: "destructive" })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://..."
        type="url"
        required
        className="h-9 text-sm"
      />
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (optional)"
        className="h-9 text-sm"
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={!url || isPending}>
          {isPending ? "Adding..." : "Add Link"}
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
