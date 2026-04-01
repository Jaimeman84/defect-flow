"use server"
import { revalidatePath } from "next/cache"
import { createLabel, updateLabel, deleteLabel } from "@/services/label.service"

export async function createLabelAction(name: string, color: string) {
  await createLabel(name, color)
  revalidatePath("/settings")
}

export async function updateLabelAction(id: string, name: string, color: string) {
  await updateLabel(id, name, color)
  revalidatePath("/settings")
}

export async function deleteLabelAction(id: string) {
  await deleteLabel(id)
  revalidatePath("/settings")
}
