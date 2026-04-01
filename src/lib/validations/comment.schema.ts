import { z } from "zod";

export const createCommentSchema = z.object({
  body: z.string().min(1, "Comment cannot be empty").max(5000, "Comment too long"),
  authorName: z.string().optional(),
});

export type CreateCommentSchema = z.infer<typeof createCommentSchema>;
