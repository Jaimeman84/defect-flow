import { Project } from "@prisma/client";

export type ProjectWithSummary = Project & {
  _count: { issues: number };
  openIssues: number;
  criticalIssues: number;
};

export interface CreateProjectInput {
  name: string;
  description?: string;
  color?: string;
  workspaceId?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  color?: string;
}
