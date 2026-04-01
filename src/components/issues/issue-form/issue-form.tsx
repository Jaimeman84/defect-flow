"use client"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createIssueSchema, updateIssueSchema } from "@/lib/validations/issue.schema"
import { AI_CATEGORY_CONFIG } from "@/lib/constants"
import { createIssueAction, updateIssueAction } from "@/app/actions/issue.actions"
import { useToast } from "@/hooks/use-toast"
import type { z } from "zod"
import type { Project, Label as PrismaLabel } from "@prisma/client"
import type { IssueType } from "@/lib/constants"
import type { IssueWithRelations } from "@/types/issue.types"

type CreateSchema = z.infer<typeof createIssueSchema>

interface IssueFormProps {
  projects: Project[]
  labels: PrismaLabel[]
  issue?: IssueWithRelations
  defaultProjectId?: string
}

export function IssueForm({ projects, labels, issue, defaultProjectId }: IssueFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const isEdit = !!issue

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateSchema>({
    resolver: zodResolver(isEdit ? updateIssueSchema : createIssueSchema) as never,
    defaultValues: {
      projectId: issue?.projectId ?? defaultProjectId ?? projects[0]?.id ?? "",
      title: issue?.title ?? "",
      description: issue?.description ?? "",
      issueType: (issue?.issueType ?? "BUG") as IssueType,
      severity: (issue?.severity ?? "MEDIUM") as never,
      priority: (issue?.priority ?? "MEDIUM") as never,
      environment: issue?.environment ?? "",
      stepsToReproduce: issue?.stepsToReproduce ?? "",
      expectedResult: issue?.expectedResult ?? "",
      actualResult: issue?.actualResult ?? "",
      aiIssueCategory: (issue?.aiIssueCategory ?? undefined) as never,
      labelIds: issue?.labels.map((l) => l.labelId) ?? [],
    },
  })

  const issueType = watch("issueType")
  const selectedLabels = watch("labelIds") ?? []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    startTransition(async () => {
      try {
        const fd = new FormData()
        Object.entries(data).forEach(([k, v]) => {
          if (v === undefined || v === null) return
          if (k === "labelIds" && Array.isArray(v)) {
            v.forEach((id) => fd.append("labelIds", id))
          } else {
            fd.append(k, String(v))
          }
        })
        if (isEdit) {
          await updateIssueAction(issue.id, fd)
        } else {
          await createIssueAction(fd)
        }
      } catch (e: unknown) {
        if (e instanceof Error && e.message?.includes("NEXT_REDIRECT")) return
        toast({ title: "Error", description: String(e), variant: "destructive" })
      }
    })
  }

  const toggleLabel = (id: string) => {
    const current = selectedLabels
    const next = current.includes(id)
      ? current.filter((l) => l !== id)
      : [...current, id]
    setValue("labelIds", next)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Project */}
      {!isEdit && (
        <div className="space-y-1.5">
          <Label htmlFor="projectId">Project *</Label>
          <Select
            value={watch("projectId")}
            onValueChange={(v) => setValue("projectId", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.projectId && <p className="text-xs text-destructive">{errors.projectId.message}</p>}
        </div>
      )}

      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" {...register("title")} placeholder="Short, descriptive bug title" />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      {/* Issue Type */}
      <div className="space-y-1.5">
        <Label>Issue Type</Label>
        <div className="flex gap-2">
          {(["BUG", "AI_ISSUE"] as IssueType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setValue("issueType", t)
                if (t === "BUG") setValue("aiIssueCategory", undefined)
              }}
              className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                issueType === t
                  ? "border-primary bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {t === "BUG" ? "🐛 Bug" : "🤖 AI Issue"}
            </button>
          ))}
        </div>
      </div>

      {/* AI Category (conditional) */}
      {issueType === "AI_ISSUE" && (
        <div className="space-y-1.5">
          <Label>AI Issue Category *</Label>
          <Select
            value={watch("aiIssueCategory") ?? ""}
            onValueChange={(v) => setValue("aiIssueCategory", v as never)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select AI issue category" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(AI_CATEGORY_CONFIG).map(([key, cfg]) => (
                <SelectItem key={key} value={key}>
                  <div>
                    <div className="font-medium">{cfg.label}</div>
                    <div className="text-xs text-muted-foreground">{cfg.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Severity + Priority */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Severity</Label>
          <Select value={watch("severity")} onValueChange={(v) => setValue("severity", v as never)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"].map((s) => (
                <SelectItem key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Priority</Label>
          <Select value={watch("priority")} onValueChange={(v) => setValue("priority", v as never)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["URGENT", "HIGH", "MEDIUM", "LOW"].map((p) => (
                <SelectItem key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Environment */}
      <div className="space-y-1.5">
        <Label htmlFor="environment">Environment</Label>
        <Input id="environment" {...register("environment")} placeholder="e.g. Staging v2.1, Production, iOS 17" />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} placeholder="Describe the bug..." className="min-h-[100px]" />
      </div>

      {/* Steps */}
      <div className="space-y-1.5">
        <Label htmlFor="stepsToReproduce">Steps to Reproduce</Label>
        <Textarea id="stepsToReproduce" {...register("stepsToReproduce")} placeholder="1. Navigate to...&#10;2. Click...&#10;3. Observe..." className="min-h-[100px] font-mono text-sm" />
      </div>

      {/* Expected / Actual */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="expectedResult">Expected Result</Label>
          <Textarea id="expectedResult" {...register("expectedResult")} placeholder="What should happen" className="min-h-[80px]" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="actualResult">Actual Result</Label>
          <Textarea id="actualResult" {...register("actualResult")} placeholder="What actually happened" className="min-h-[80px]" />
        </div>
      </div>

      {/* Labels */}
      {labels.length > 0 && (
        <div className="space-y-1.5">
          <Label>Labels</Label>
          <div className="flex flex-wrap gap-2">
            {labels.map((l) => {
              const selected = selectedLabels.includes(l.id)
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => toggleLabel(l.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    selected ? "text-white ring-2 ring-offset-1" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                  style={selected ? { backgroundColor: l.color } : {}}
                >
                  {selected && <span className="mr-1">✓</span>}
                  {l.name}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : isEdit ? "Save Changes" : "Create Issue"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
