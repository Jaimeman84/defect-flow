import { Attachment } from "@prisma/client";

export type { Attachment };

export interface UploadResult {
  url: string;
  storagePath: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}

export interface AddLinkInput {
  url: string;
  title?: string;
}

export interface AddTextNoteInput {
  content: string;
  title?: string;
}
