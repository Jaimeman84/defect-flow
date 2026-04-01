import { prisma } from "@/lib/prisma";
import { getStorageProvider } from "./storage";
import { MAX_UPLOAD_SIZE_BYTES, ALLOWED_MIME_TYPES } from "@/lib/constants";

export async function getAttachmentsByIssue(issueId: string) {
  return prisma.attachment.findMany({
    where: { issueId },
    orderBy: { createdAt: "asc" },
  });
}

export async function uploadFile(issueId: string, file: File) {
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    throw new Error(`File too large. Maximum size is 10MB.`);
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed.`);
  }

  const storage = getStorageProvider();
  const { url, storagePath } = await storage.upload(file, issueId);

  return prisma.attachment.create({
    data: {
      issueId,
      type: "FILE",
      filename: file.name,
      url,
      storagePath,
      mimeType: file.type,
      sizeBytes: file.size,
    },
  });
}

export async function addLink(issueId: string, url: string, title?: string) {
  return prisma.attachment.create({
    data: { issueId, type: "LINK", url, title: title ?? url },
  });
}

export async function addTextNote(
  issueId: string,
  content: string,
  title?: string
) {
  return prisma.attachment.create({
    data: {
      issueId,
      type: "TEXT_NOTE",
      textContent: content,
      title: title ?? "Note",
    },
  });
}

export async function deleteAttachment(id: string) {
  const attachment = await prisma.attachment.findUnique({ where: { id } });
  if (!attachment) throw new Error("Attachment not found");

  if (attachment.storagePath) {
    const storage = getStorageProvider();
    await storage.delete(attachment.storagePath);
  }

  return prisma.attachment.delete({ where: { id } });
}
