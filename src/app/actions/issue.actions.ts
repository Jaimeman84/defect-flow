"use server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createIssue, updateIssue, deleteIssue, changeIssueStatus } from "@/services/issue.service"
import { createIssueSchema, updateIssueSchema, changeStatusSchema } from "@/lib/validations/issue.schema"
import type { IssueStatus } from "@/lib/constants"

export async function createIssueAction(formData: FormData) {
  const raw = {
    projectId: formData.get("projectId"),
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    issueType: formData.get("issueType"),
    severity: formData.get("severity"),
    priority: formData.get("priority"),
    environment: formData.get("environment") || undefined,
    stepsToReproduce: formData.get("stepsToReproduce") || undefined,
    expectedResult: formData.get("expectedResult") || undefined,
    actualResult: formData.get("actualResult") || undefined,
    aiIssueCategory: formData.get("aiIssueCategory") || undefined,
    labelIds: formData.getAll("labelIds") as string[],
    assigneeId: formData.get("assigneeId") as string | undefined || undefined,
  }

  const parsed = createIssueSchema.parse(raw)
  const issue = await createIssue(parsed)
  revalidatePath("/issues")
  revalidatePath(`/projects/${parsed.projectId}`)
  redirect(`/issues/${issue.id}`)
}

export async function updateIssueAction(id: string, formData: FormData) {
  const raw = {
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    issueType: formData.get("issueType"),
    severity: formData.get("severity"),
    priority: formData.get("priority"),
    environment: formData.get("environment") || undefined,
    stepsToReproduce: formData.get("stepsToReproduce") || undefined,
    expectedResult: formData.get("expectedResult") || undefined,
    actualResult: formData.get("actualResult") || undefined,
    aiIssueCategory: formData.get("aiIssueCategory") || undefined,
    labelIds: formData.getAll("labelIds") as string[],
    assigneeId: formData.get("assigneeId") as string | undefined || undefined,
  }
  const parsed = updateIssueSchema.parse(raw)
  await updateIssue(id, parsed)
  revalidatePath(`/issues/${id}`)
  revalidatePath("/issues")
  redirect(`/issues/${id}`)
}

export async function deleteIssueAction(id: string, projectId: string) {
  await deleteIssue(id)
  revalidatePath("/issues")
  revalidatePath(`/projects/${projectId}`)
  redirect("/issues")
}

export async function changeStatusAction(id: string, newStatus: IssueStatus, note?: string) {
  await changeIssueStatus(id, newStatus, note, "QA Tester")
  revalidatePath(`/issues/${id}`)
  revalidatePath("/issues")
  revalidatePath("/dashboard")
}
