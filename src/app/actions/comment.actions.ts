"use server"
import { revalidatePath } from "next/cache"
import { createComment, deleteComment } from "@/services/comment.service"

export async function addCommentAction(issueId: string, body: string, authorName?: string) {
  if (!body.trim()) throw new Error("Comment cannot be empty")
  await createComment(issueId, body.trim(), authorName)
  revalidatePath(`/issues/${issueId}`)
}

export async function deleteCommentAction(id: string, issueId: string) {
  await deleteComment(id)
  revalidatePath(`/issues/${issueId}`)
}
