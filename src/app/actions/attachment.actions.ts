"use server"
import { revalidatePath } from "next/cache"
import { uploadFile, addLink, addTextNote, deleteAttachment } from "@/services/attachment.service"

export async function uploadFileAction(issueId: string, formData: FormData) {
  const file = formData.get("file") as File
  if (!file || file.size === 0) throw new Error("No file provided")
  await uploadFile(issueId, file)
  revalidatePath(`/issues/${issueId}`)
}

export async function addLinkAction(issueId: string, url: string, title?: string) {
  await addLink(issueId, url, title)
  revalidatePath(`/issues/${issueId}`)
}

export async function addTextNoteAction(issueId: string, content: string, title?: string) {
  await addTextNote(issueId, content, title)
  revalidatePath(`/issues/${issueId}`)
}

export async function deleteAttachmentAction(id: string, issueId: string) {
  await deleteAttachment(id)
  revalidatePath(`/issues/${issueId}`)
}
