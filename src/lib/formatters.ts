import { STATUS_CONFIG, SEVERITY_CONFIG, PRIORITY_CONFIG, AI_CATEGORY_CONFIG } from "./constants";
import type { IssueStatus, Severity, Priority, AIIssueCategory } from "./constants";

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(date);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getStatusLabel(status: IssueStatus): string {
  return STATUS_CONFIG[status]?.label ?? status;
}

export function getSeverityLabel(severity: Severity): string {
  return SEVERITY_CONFIG[severity]?.label ?? severity;
}

export function getPriorityLabel(priority: Priority): string {
  return PRIORITY_CONFIG[priority]?.label ?? priority;
}

export function getAICategoryLabel(category: AIIssueCategory): string {
  return AI_CATEGORY_CONFIG[category]?.label ?? category;
}

export function formatIssueId(projectSlug: string, issueNumber: number): string {
  return `${projectSlug.toUpperCase().slice(0, 3)}-${issueNumber}`;
}
