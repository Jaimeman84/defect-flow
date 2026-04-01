import {
  Issue,
  Comment,
  Attachment,
  Label,
  LabelOnIssue,
  StatusHistory,
} from "@prisma/client";
import type { IssueStatus, Severity, Priority, IssueType, AIIssueCategory } from "@/lib/constants";

// Re-typed Issue with proper union types (Prisma stores as String in SQLite)
export type TypedIssue = Omit<Issue, "status" | "severity" | "priority" | "issueType" | "aiIssueCategory"> & {
  status: IssueStatus;
  severity: Severity;
  priority: Priority;
  issueType: IssueType;
  aiIssueCategory: AIIssueCategory | null;
};

export type IssueWithRelations = TypedIssue & {
  comments: Comment[];
  attachments: Attachment[];
  labels: (LabelOnIssue & { label: Label })[];
  statusHistory: StatusHistory[];
  project: { id: string; name: string; slug: string; color: string };
};

export type IssueListItem = TypedIssue & {
  labels: (LabelOnIssue & { label: Label })[];
  _count: { comments: number; attachments: number };
  project: { id: string; name: string; slug: string; color: string };
};

export interface CreateIssueInput {
  projectId: string;
  title: string;
  description?: string;
  issueType: IssueType;
  severity: Severity;
  priority: Priority;
  environment?: string;
  stepsToReproduce?: string;
  expectedResult?: string;
  actualResult?: string;
  aiIssueCategory?: AIIssueCategory;
  labelIds?: string[];
  reporterId?: string;
  assigneeId?: string;
}

export interface UpdateIssueInput {
  title?: string;
  description?: string;
  issueType?: IssueType;
  severity?: Severity;
  priority?: Priority;
  environment?: string;
  stepsToReproduce?: string;
  expectedResult?: string;
  actualResult?: string;
  aiIssueCategory?: AIIssueCategory;
  labelIds?: string[];
  assigneeId?: string;
}

export interface IssueFilters {
  projectId?: string;
  status?: IssueStatus | IssueStatus[];
  severity?: Severity | Severity[];
  priority?: Priority | Priority[];
  issueType?: IssueType;
  aiIssueCategory?: AIIssueCategory;
  labelId?: string;
  search?: string;
  assigneeId?: string;
  includeDeleted?: boolean;
}

export interface IssueSortOptions {
  sortBy: "createdAt" | "updatedAt" | "severity" | "priority" | "status";
  sortDir: "asc" | "desc";
}
