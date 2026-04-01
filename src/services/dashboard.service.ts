import { prisma } from "@/lib/prisma";
import { DEFAULT_WORKSPACE_ID, STATUS_CONFIG, SEVERITY_CONFIG } from "@/lib/constants";
import type { IssueStatus, Severity } from "@/lib/constants";
import type { DashboardStats, StatusBreakdown, SeverityBreakdown, ProjectSummary } from "@/types/dashboard.types";

export async function getDashboardStats(workspaceId = DEFAULT_WORKSPACE_ID): Promise<DashboardStats> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalOpen,
    totalClosed,
    critical,
    inProgress,
    readyForRetest,
    closedToday,
    totalIssues,
    aiIssues,
  ] = await Promise.all([
    prisma.issue.count({
      where: {
        project: { workspaceId },
        deletedAt: null,
        status: { notIn: ["CLOSED", "REJECTED", "DUPLICATE"] },
      },
    }),
    prisma.issue.count({
      where: {
        project: { workspaceId },
        deletedAt: null,
        status: "CLOSED",
      },
    }),
    prisma.issue.count({
      where: {
        project: { workspaceId },
        deletedAt: null,
        severity: "CRITICAL",
        status: { notIn: ["CLOSED", "REJECTED", "DUPLICATE"] },
      },
    }),
    prisma.issue.count({
      where: { project: { workspaceId }, deletedAt: null, status: "IN_PROGRESS" },
    }),
    prisma.issue.count({
      where: { project: { workspaceId }, deletedAt: null, status: "READY_FOR_RETEST" },
    }),
    prisma.issue.count({
      where: {
        project: { workspaceId },
        deletedAt: null,
        status: "CLOSED",
        updatedAt: { gte: today },
      },
    }),
    prisma.issue.count({
      where: { project: { workspaceId }, deletedAt: null },
    }),
    prisma.issue.count({
      where: { project: { workspaceId }, deletedAt: null, issueType: "AI_ISSUE" },
    }),
  ]);

  return { totalOpen, totalClosed, critical, inProgress, readyForRetest, closedToday, totalIssues, aiIssues };
}

export async function getIssuesByStatus(workspaceId = DEFAULT_WORKSPACE_ID): Promise<StatusBreakdown[]> {
  const grouped = await prisma.issue.groupBy({
    by: ["status"],
    where: { project: { workspaceId }, deletedAt: null },
    _count: { status: true },
  });

  return (Object.keys(STATUS_CONFIG) as IssueStatus[]).map((status) => ({
    status,
    label: STATUS_CONFIG[status].label,
    count: grouped.find((g) => g.status === status)?._count.status ?? 0,
    color: STATUS_CONFIG[status].color,
  }));
}

export async function getIssuesBySeverity(workspaceId = DEFAULT_WORKSPACE_ID): Promise<SeverityBreakdown[]> {
  const grouped = await prisma.issue.groupBy({
    by: ["severity"],
    where: {
      project: { workspaceId },
      deletedAt: null,
      status: { notIn: ["CLOSED", "REJECTED", "DUPLICATE"] },
    },
    _count: { severity: true },
  });

  return (Object.keys(SEVERITY_CONFIG) as Severity[]).map((severity) => ({
    severity,
    label: SEVERITY_CONFIG[severity].label,
    count: grouped.find((g) => g.severity === severity)?._count.severity ?? 0,
    color: SEVERITY_CONFIG[severity].color,
  }));
}

export async function getRecentIssues(limit = 8, workspaceId = DEFAULT_WORKSPACE_ID) {
  return prisma.issue.findMany({
    where: { project: { workspaceId }, deletedAt: null },
    include: {
      project: { select: { id: true, name: true, slug: true, color: true } },
      labels: { include: { label: true } },
      _count: { select: { comments: true, attachments: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getProjectSummaries(workspaceId = DEFAULT_WORKSPACE_ID): Promise<ProjectSummary[]> {
  const projects = await prisma.project.findMany({
    where: { workspaceId, archivedAt: null },
    orderBy: { createdAt: "asc" },
  });

  return Promise.all(
    projects.map(async (p) => {
      const [openIssues, criticalIssues, totalIssues] = await Promise.all([
        prisma.issue.count({
          where: { projectId: p.id, deletedAt: null, status: { notIn: ["CLOSED", "REJECTED", "DUPLICATE"] } },
        }),
        prisma.issue.count({
          where: { projectId: p.id, deletedAt: null, severity: "CRITICAL", status: { notIn: ["CLOSED", "REJECTED", "DUPLICATE"] } },
        }),
        prisma.issue.count({ where: { projectId: p.id, deletedAt: null } }),
      ]);
      return { id: p.id, name: p.name, slug: p.slug, color: p.color, description: p.description, openIssues, criticalIssues, totalIssues };
    })
  );
}
