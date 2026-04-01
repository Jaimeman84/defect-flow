import { z } from "zod";

// Use z.enum with string literals since SQLite uses String fields

export const createIssueSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  title: z.string().min(1, "Title is required").max(500, "Title too long"),
  description: z.string().optional(),
  issueType: z.enum(["BUG", "AI_ISSUE"]),
  severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"]),
  priority: z.enum(["URGENT", "HIGH", "MEDIUM", "LOW"]),
  environment: z.string().optional(),
  stepsToReproduce: z.string().optional(),
  expectedResult: z.string().optional(),
  actualResult: z.string().optional(),
  aiIssueCategory: z.enum([
    "HALLUCINATION",
    "PROMPT_INJECTION",
    "DATA_LEAKAGE",
    "BIAS_OR_TOXICITY",
    "UNSAFE_OUTPUT",
    "INCONSISTENT_RESPONSE",
    "CONTEXT_FAILURE",
    "INSTRUCTION_FOLLOWING_FAILURE",
    "OTHER",
  ]).optional(),
  labelIds: z.array(z.string()).optional(),
  assigneeId: z.string().optional(),
});

export const updateIssueSchema = createIssueSchema.partial().omit({ projectId: true });

export const changeStatusSchema = z.object({
  status: z.enum(["NEW", "TRIAGED", "IN_PROGRESS", "READY_FOR_RETEST", "CLOSED", "REJECTED", "DUPLICATE"]),
  note: z.string().optional(),
});

export type CreateIssueSchema = z.infer<typeof createIssueSchema>;
export type UpdateIssueSchema = z.infer<typeof updateIssueSchema>;
export type ChangeStatusSchema = z.infer<typeof changeStatusSchema>;
