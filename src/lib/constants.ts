// App-layer type definitions (SQLite stores as strings)
export type IssueStatus = "NEW" | "TRIAGED" | "IN_PROGRESS" | "READY_FOR_RETEST" | "CLOSED" | "REJECTED" | "DUPLICATE";
export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
export type Priority = "URGENT" | "HIGH" | "MEDIUM" | "LOW";
export type IssueType = "BUG" | "AI_ISSUE";
export type AIIssueCategory = "HALLUCINATION" | "PROMPT_INJECTION" | "DATA_LEAKAGE" | "BIAS_OR_TOXICITY" | "UNSAFE_OUTPUT" | "INCONSISTENT_RESPONSE" | "CONTEXT_FAILURE" | "INSTRUCTION_FOLLOWING_FAILURE" | "OTHER";
export type AttachmentType = "FILE" | "LINK" | "TEXT_NOTE";
export type UserRole = "ADMIN" | "MEMBER" | "VIEWER";

export const APP_NAME = "Defect Flow";
export const DEFAULT_WORKSPACE_ID = "ws_default";
export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "text/plain",
  "text/csv",
  "application/json",
  "text/html",
  "video/mp4",
  "video/webm",
];

export const STATUS_CONFIG: Record<
  IssueStatus,
  { label: string; color: string; bgColor: string; textColor: string; description: string }
> = {
  NEW: {
    label: "New",
    color: "#3b82f6",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-700 dark:text-blue-300",
    description: "Newly reported, awaiting triage",
  },
  TRIAGED: {
    label: "Triaged",
    color: "#8b5cf6",
    bgColor: "bg-violet-100 dark:bg-violet-900/30",
    textColor: "text-violet-700 dark:text-violet-300",
    description: "Reviewed and confirmed valid",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "#f59e0b",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    textColor: "text-amber-700 dark:text-amber-300",
    description: "Actively being worked on",
  },
  READY_FOR_RETEST: {
    label: "Ready for Retest",
    color: "#14b8a6",
    bgColor: "bg-teal-100 dark:bg-teal-900/30",
    textColor: "text-teal-700 dark:text-teal-300",
    description: "Fix deployed, awaiting QA verification",
  },
  CLOSED: {
    label: "Closed",
    color: "#22c55e",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    textColor: "text-green-700 dark:text-green-300",
    description: "Verified fixed and closed",
  },
  REJECTED: {
    label: "Rejected",
    color: "#6b7280",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    textColor: "text-gray-600 dark:text-gray-400",
    description: "Not a valid bug",
  },
  DUPLICATE: {
    label: "Duplicate",
    color: "#6b7280",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    textColor: "text-gray-600 dark:text-gray-400",
    description: "Already tracked in another issue",
  },
};

export const SEVERITY_CONFIG: Record<
  Severity,
  { label: string; color: string; bgColor: string; textColor: string; dotColor: string }
> = {
  CRITICAL: {
    label: "Critical",
    color: "#dc2626",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    textColor: "text-red-700 dark:text-red-300",
    dotColor: "bg-red-500",
  },
  HIGH: {
    label: "High",
    color: "#ea580c",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    textColor: "text-orange-700 dark:text-orange-300",
    dotColor: "bg-orange-500",
  },
  MEDIUM: {
    label: "Medium",
    color: "#ca8a04",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    textColor: "text-yellow-700 dark:text-yellow-300",
    dotColor: "bg-yellow-500",
  },
  LOW: {
    label: "Low",
    color: "#2563eb",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-700 dark:text-blue-300",
    dotColor: "bg-blue-400",
  },
  INFO: {
    label: "Info",
    color: "#6b7280",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    textColor: "text-gray-600 dark:text-gray-400",
    dotColor: "bg-gray-400",
  },
};

export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; icon: string }
> = {
  URGENT: { label: "Urgent", color: "text-red-500", icon: "⚡" },
  HIGH: { label: "High", color: "text-orange-500", icon: "↑" },
  MEDIUM: { label: "Medium", color: "text-yellow-500", icon: "→" },
  LOW: { label: "Low", color: "text-blue-400", icon: "↓" },
};

export const ISSUE_TYPE_CONFIG: Record<
  IssueType,
  { label: string; color: string; bgColor: string; textColor: string }
> = {
  BUG: {
    label: "Bug",
    color: "#ef4444",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    textColor: "text-red-600 dark:text-red-400",
  },
  AI_ISSUE: {
    label: "AI Issue",
    color: "#8b5cf6",
    bgColor: "bg-violet-50 dark:bg-violet-900/20",
    textColor: "text-violet-600 dark:text-violet-400",
  },
};

export const AI_CATEGORY_CONFIG: Record<
  AIIssueCategory,
  { label: string; description: string; defaultSeverity: Severity }
> = {
  HALLUCINATION: {
    label: "Hallucination",
    description: "Model generates factually incorrect or fabricated content",
    defaultSeverity: "HIGH",
  },
  PROMPT_INJECTION: {
    label: "Prompt Injection",
    description: "User input overrides or manipulates the system prompt",
    defaultSeverity: "CRITICAL",
  },
  DATA_LEAKAGE: {
    label: "Data Leakage",
    description: "Model reveals training data, PII, or system internals",
    defaultSeverity: "CRITICAL",
  },
  BIAS_OR_TOXICITY: {
    label: "Bias / Toxicity",
    description: "Model produces biased, discriminatory, or toxic output",
    defaultSeverity: "HIGH",
  },
  UNSAFE_OUTPUT: {
    label: "Unsafe Output",
    description: "Model generates content that could cause harm",
    defaultSeverity: "CRITICAL",
  },
  INCONSISTENT_RESPONSE: {
    label: "Inconsistent Response",
    description: "Model gives contradictory answers to equivalent questions",
    defaultSeverity: "MEDIUM",
  },
  CONTEXT_FAILURE: {
    label: "Context Failure",
    description: "Model loses or misuses context window information",
    defaultSeverity: "MEDIUM",
  },
  INSTRUCTION_FOLLOWING_FAILURE: {
    label: "Instruction-Following Failure",
    description: "Model ignores or misinterprets explicit instructions",
    defaultSeverity: "MEDIUM",
  },
  OTHER: {
    label: "Other",
    description: "AI issue not fitting existing categories",
    defaultSeverity: "MEDIUM",
  },
};

export const ALLOWED_STATUS_TRANSITIONS: Record<IssueStatus, IssueStatus[]> = {
  NEW: ["TRIAGED", "REJECTED", "DUPLICATE"],
  TRIAGED: ["IN_PROGRESS", "REJECTED", "DUPLICATE"],
  IN_PROGRESS: ["READY_FOR_RETEST", "TRIAGED"],
  READY_FOR_RETEST: ["CLOSED", "IN_PROGRESS"],
  CLOSED: ["IN_PROGRESS"],
  REJECTED: ["TRIAGED"],
  DUPLICATE: ["TRIAGED"],
};

export const PROJECT_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444",
  "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#3b82f6", "#06b6d4", "#a855f7", "#84cc16",
];

export const LABEL_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#14b8a6", "#3b82f6", "#6366f1", "#8b5cf6",
  "#ec4899", "#6b7280", "#dc2626", "#16a34a",
];
