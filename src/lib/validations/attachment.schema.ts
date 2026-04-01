import { z } from "zod";

export const addLinkSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  title: z.string().optional(),
});

export const addTextNoteSchema = z.object({
  content: z.string().min(1, "Note cannot be empty").max(50000),
  title: z.string().optional(),
});

export type AddLinkSchema = z.infer<typeof addLinkSchema>;
export type AddTextNoteSchema = z.infer<typeof addTextNoteSchema>;
