"use client"
import { useState, useTransition } from "react"
import { Link2, FileText, Upload, Trash2, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropZone } from "./drop-zone"
import { AddLinkForm } from "./add-link-form"
import { AddTextNoteForm } from "./add-text-note-form"
import { deleteAttachmentAction } from "@/app/actions/attachment.actions"
import { formatFileSize, formatRelativeTime } from "@/lib/formatters"
import { useToast } from "@/hooks/use-toast"
import type { Attachment } from "@prisma/client"

interface EvidencePanelProps {
  issueId: string
  attachments: Attachment[]
}

type AddMode = "file" | "link" | "note" | null

export function EvidencePanel({ issueId, attachments }: EvidencePanelProps) {
  const [addMode, setAddMode] = useState<AddMode>(null)
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const files = attachments.filter((a) => a.type === "FILE")
  const links = attachments.filter((a) => a.type === "LINK")
  const notes = attachments.filter((a) => a.type === "TEXT_NOTE")

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteAttachmentAction(id, issueId)
        toast({ title: "Attachment deleted" })
      } catch {
        toast({ title: "Failed to delete", variant: "destructive" })
      }
    })
  }

  const toggleNote = (id: string) => {
    setExpandedNotes((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-4">
      {/* Add Evidence Buttons */}
      <div className="flex gap-2">
        <Button
          variant={addMode === "file" ? "secondary" : "outline"}
          size="sm"
          className="gap-1.5"
          onClick={() => setAddMode(addMode === "file" ? null : "file")}
        >
          <Upload className="h-3.5 w-3.5" />
          File
        </Button>
        <Button
          variant={addMode === "link" ? "secondary" : "outline"}
          size="sm"
          className="gap-1.5"
          onClick={() => setAddMode(addMode === "link" ? null : "link")}
        >
          <Link2 className="h-3.5 w-3.5" />
          Link
        </Button>
        <Button
          variant={addMode === "note" ? "secondary" : "outline"}
          size="sm"
          className="gap-1.5"
          onClick={() => setAddMode(addMode === "note" ? null : "note")}
        >
          <FileText className="h-3.5 w-3.5" />
          Note
        </Button>
      </div>

      {/* Add Forms */}
      {addMode === "file" && <DropZone issueId={issueId} />}
      {addMode === "link" && <AddLinkForm issueId={issueId} onDone={() => setAddMode(null)} />}
      {addMode === "note" && <AddTextNoteForm issueId={issueId} onDone={() => setAddMode(null)} />}

      {/* Files */}
      {files.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Files ({files.length})</p>
          <div className="space-y-1">
            {files.map((f) => (
              <div key={f.id} className="flex items-center gap-2 rounded-md border p-2">
                {f.mimeType?.startsWith("image/") && f.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.url} alt={f.filename ?? ""} className="h-10 w-10 rounded object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground">
                    {f.mimeType?.split("/")[1]?.toUpperCase().slice(0, 4) ?? "FILE"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{f.filename}</p>
                  <p className="text-xs text-muted-foreground">
                    {f.sizeBytes ? formatFileSize(f.sizeBytes) : ""} · {formatRelativeTime(f.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {f.url && (
                    <a href={f.url} target="_blank" rel="noreferrer">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </a>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(f.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {links.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Links ({links.length})</p>
          <div className="space-y-1">
            {links.map((l) => (
              <div key={l.id} className="flex items-center gap-2 rounded-md border p-2">
                <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{l.title ?? l.url}</p>
                  <p className="truncate text-xs text-muted-foreground">{l.url}</p>
                </div>
                <div className="flex items-center gap-1">
                  <a href={l.url ?? "#"} target="_blank" rel="noreferrer">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </a>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(l.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {notes.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Notes ({notes.length})</p>
          <div className="space-y-1">
            {notes.map((n) => {
              const isExpanded = expandedNotes.has(n.id)
              return (
                <div key={n.id} className="rounded-md border p-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <p className="flex-1 text-sm font-medium">{n.title ?? "Note"}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => toggleNote(n.id)}
                    >
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(n.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  {isExpanded && n.textContent && (
                    <pre className="mt-2 overflow-auto rounded bg-muted p-2 text-xs font-mono whitespace-pre-wrap max-h-64">
                      {n.textContent}
                    </pre>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {attachments.length === 0 && addMode === null && (
        <p className="text-center text-sm text-muted-foreground py-4">
          No evidence attached. Add files, links, or notes above.
        </p>
      )}
    </div>
  )
}
