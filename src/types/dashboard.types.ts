import type { IssueStatus, Severity } from "@/lib/constants";

export interface DashboardStats {
  totalOpen: number;
  totalClosed: number;
  critical: number;
  inProgress: number;
  readyForRetest: number;
  closedToday: number;
  totalIssues: number;
  aiIssues: number;
}

export interface StatusBreakdown {
  status: IssueStatus;
  label: string;
  count: number;
  color: string;
}

export interface SeverityBreakdown {
  severity: Severity;
  label: string;
  count: number;
  color: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  slug: string;
  color: string;
  description: string | null;
  openIssues: number;
  criticalIssues: number;
  totalIssues: number;
}
