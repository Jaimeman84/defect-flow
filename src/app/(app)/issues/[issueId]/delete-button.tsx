"use client"
import { useTransition } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteIssueAction } from "@/app/actions/issue.actions"
import { useToast } from "@/hooks/use-toast"

interface DeleteIssueButtonProps {
  issueId: string
  projectId: string
}

export function DeleteIssueButton({ issueId, projectId }: DeleteIssueButtonProps) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleDelete = () => {
    if (!confirm("Delete this issue? This cannot be undone.")) return
    startTransition(async () => {
      try {
        await deleteIssueAction(issueId, projectId)
      } catch {
        toast({ title: "Failed to delete issue", variant: "destructive" })
      }
    })
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-destructive hover:text-destructive"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
