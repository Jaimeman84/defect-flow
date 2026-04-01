"use client"
import { useCallback, useState, useTransition } from "react"
import { Upload, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { uploadFileAction } from "@/app/actions/attachment.actions"
import { useToast } from "@/hooks/use-toast"

interface DropZoneProps {
  issueId: string
}

export function DropZone({ issueId }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files?.length) return
      const file = files[0]
      const formData = new FormData()
      formData.append("file", file)
      startTransition(async () => {
        try {
          await uploadFileAction(issueId, formData)
          toast({ title: "File uploaded", description: file.name })
        } catch (e) {
          toast({ title: "Upload failed", description: String(e), variant: "destructive" })
        }
      })
    },
    [issueId, toast]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  return (
    <label
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
        isDragOver
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      )}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={onDrop}
    >
      <input
        type="file"
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
        accept="image/*,application/pdf,text/plain,text/csv,application/json"
      />
      {isPending ? (
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      ) : (
        <>
          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">Drop file or click to upload</p>
          <p className="text-xs text-muted-foreground">PNG, JPG, PDF, TXT, JSON up to 10MB</p>
        </>
      )}
    </label>
  )
}
