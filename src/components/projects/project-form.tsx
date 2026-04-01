"use client"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createProjectSchema } from "@/lib/validations/project.schema"
import { PROJECT_COLORS } from "@/lib/constants"
import { createProjectAction, updateProjectAction } from "@/app/actions/project.actions"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { z } from "zod"
import type { Project } from "@prisma/client"

type Schema = z.infer<typeof createProjectSchema>

interface ProjectFormProps {
  project?: Project
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Schema>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: project?.name ?? "",
      description: project?.description ?? "",
      color: project?.color ?? "#6366f1",
    },
  })

  const selectedColor = watch("color")

  const onSubmit = (data: Schema) => {
    startTransition(async () => {
      try {
        const fd = new FormData()
        fd.append("name", data.name)
        if (data.description) fd.append("description", data.description)
        if (data.color) fd.append("color", data.color)
        if (project) {
          await updateProjectAction(project.id, fd)
        } else {
          await createProjectAction(fd)
        }
      } catch (e: unknown) {
        if (e instanceof Error && e.message?.includes("NEXT_REDIRECT")) return
        toast({ title: "Error", description: String(e), variant: "destructive" })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name">Project Name *</Label>
        <Input id="name" {...register("name")} placeholder="e.g. ShopApp v2.1" />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} placeholder="What are you testing?" className="min-h-[80px]" />
      </div>

      <div className="space-y-1.5">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {PROJECT_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue("color", color)}
              className={cn(
                "h-7 w-7 rounded-full transition-transform hover:scale-110",
                selectedColor === color && "ring-2 ring-offset-2 ring-primary scale-110"
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : project ? "Save Changes" : "Create Project"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  )
}
