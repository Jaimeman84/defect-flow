"use client"
import { useState, useTransition } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { addCommentAction } from "@/app/actions/comment.actions"
import { useToast } from "@/hooks/use-toast"

interface CommentFormProps {
  issueId: string
}

export function CommentForm({ issueId }: CommentFormProps) {
  const [body, setBody] = useState("")
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim()) return
    startTransition(async () => {
      try {
        await addCommentAction(issueId, body, "QA Tester")
        setBody("")
        toast({ title: "Comment added" })
      } catch {
        toast({ title: "Failed to add comment", variant: "destructive" })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Add a comment..."
        className="min-h-[80px] text-sm"
      />
      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={!body.trim() || isPending}>
          {isPending ? "Posting..." : "Post Comment"}
        </Button>
      </div>
    </form>
  )
}
