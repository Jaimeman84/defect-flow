"use server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createProject, updateProject, archiveProject } from "@/services/project.service"
import { createProjectSchema, updateProjectSchema } from "@/lib/validations/project.schema"

export async function createProjectAction(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    color: formData.get("color") || undefined,
  }
  const parsed = createProjectSchema.parse(raw)
  const project = await createProject(parsed)
  revalidatePath("/projects")
  revalidatePath("/dashboard")
  redirect(`/projects/${project.id}`)
}

export async function updateProjectAction(id: string, formData: FormData) {
  const raw = {
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    color: formData.get("color") || undefined,
  }
  const parsed = updateProjectSchema.parse(raw)
  await updateProject(id, parsed)
  revalidatePath(`/projects/${id}`)
  revalidatePath("/projects")
  redirect(`/projects/${id}`)
}

export async function archiveProjectAction(id: string) {
  await archiveProject(id)
  revalidatePath("/projects")
  revalidatePath("/dashboard")
  redirect("/projects")
}
