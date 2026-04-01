import { prisma } from "@/lib/prisma";
import { DEFAULT_WORKSPACE_ID } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import type { CreateProjectInput, UpdateProjectInput, ProjectWithSummary } from "@/types/project.types";

export async function getProjects(workspaceId = DEFAULT_WORKSPACE_ID) {
  const projects = await prisma.project.findMany({
    where: { workspaceId, archivedAt: null },
    include: {
      _count: { select: { issues: { where: { deletedAt: null } } } },
    },
    orderBy: { createdAt: "asc" },
  });

  const projectsWithStats = await Promise.all(
    projects.map(async (p) => {
      const [openIssues, criticalIssues] = await Promise.all([
        prisma.issue.count({
          where: {
            projectId: p.id,
            deletedAt: null,
            status: { notIn: ["CLOSED", "REJECTED", "DUPLICATE"] },
          },
        }),
        prisma.issue.count({
          where: {
            projectId: p.id,
            deletedAt: null,
            severity: "CRITICAL",
            status: { notIn: ["CLOSED", "REJECTED", "DUPLICATE"] },
          },
        }),
      ]);
      return { ...p, openIssues, criticalIssues } as ProjectWithSummary;
    })
  );

  return projectsWithStats;
}

export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      _count: { select: { issues: { where: { deletedAt: null } } } },
    },
  });
}

export async function getProjectBySlug(slug: string, workspaceId = DEFAULT_WORKSPACE_ID) {
  return prisma.project.findUnique({
    where: { workspaceId_slug: { workspaceId, slug } },
    include: {
      _count: { select: { issues: { where: { deletedAt: null } } } },
    },
  });
}

export async function createProject(input: CreateProjectInput) {
  const workspaceId = input.workspaceId ?? DEFAULT_WORKSPACE_ID;
  const slug = slugify(input.name);

  return prisma.project.create({
    data: {
      workspaceId,
      name: input.name,
      slug,
      description: input.description,
      color: input.color ?? "#6366f1",
    },
  });
}

export async function updateProject(id: string, input: UpdateProjectInput) {
  return prisma.project.update({
    where: { id },
    data: {
      name: input.name,
      description: input.description,
      color: input.color,
    },
  });
}

export async function archiveProject(id: string) {
  return prisma.project.update({
    where: { id },
    data: { archivedAt: new Date() },
  });
}

export async function getNextIssueNumber(projectId: string): Promise<number> {
  const last = await prisma.issue.findFirst({
    where: { projectId },
    orderBy: { issueNumber: "desc" },
    select: { issueNumber: true },
  });
  return (last?.issueNumber ?? 0) + 1;
}
