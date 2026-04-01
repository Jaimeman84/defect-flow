"use client"
import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { archiveProjectAction } from "@/app/actions/project.actions"
import { useToast } from "@/hooks/use-toast"

export function ArchiveProjectButton({ projectId }: { projectId: string }) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          try {
            await archiveProjectAction(projectId)
          } catch {
            toast({ title: "Failed to archive project", variant: "destructive" })
          }
        })
      }}
    >
      {isPending ? "Archiving..." : "Archive Project"}
    </Button>
  )
}
