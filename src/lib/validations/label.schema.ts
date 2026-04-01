import { z } from "zod";

export const createLabelSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color"),
});

export const updateLabelSchema = createLabelSchema.partial();

export type CreateLabelSchema = z.infer<typeof createLabelSchema>;
export type UpdateLabelSchema = z.infer<typeof updateLabelSchema>;
