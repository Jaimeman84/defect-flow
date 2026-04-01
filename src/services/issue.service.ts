import { prisma } from "@/lib/prisma";
import { getNextIssueNumber } from "./project.service";
import { ALLOWED_STATUS_TRANSITIONS } from "@/lib/constants";
import type {
  CreateIssueInput,
  UpdateIssueInput,
  IssueFilters,
  IssueSortOptions,
  IssueWithRelations,
  IssueListItem,
} from "@/types/issue.types";
import type { IssueStatus } from "@/lib/constants";

const ISSUE_INCLUDE = {
  labels: { include: { label: true } },
  project: { select: { id: true, name: true, slug: true, color: true } },
  _count: { select: { comments: true, attachments: true } },
};

const ISSUE_FULL_INCLUDE = {
  labels: { include: { label: true } },
  comments: { orderBy: { createdAt: "asc" as const } },
  attachments: { orderBy: { createdAt: "asc" as const } },
  statusHistory: { orderBy: { createdAt: "asc" as const } },
  project: { select: { id: true, name: true, slug: true, color: true } },
};

function buildWhereClause(filters: IssueFilters) {
  const where: Record<string, unknown> = {
    deletedAt: filters.includeDeleted ? undefined : null,
  };

  if (filters.projectId) where.projectId = filters.projectId;

  if (filters.status) {
    where.status = Array.isArray(filters.status)
      ? { in: filters.status }
      : filters.status;
  }

  if (filters.severity) {
    where.severity = Array.isArray(filters.severity)
      ? { in: filters.severity }
      : filters.severity;
  }

  if (filters.priority) {
    where.priority = Array.isArray(filters.priority)
      ? { in: filters.priority }
      : filters.priority;
  }

  if (filters.issueType) where.issueType = filters.issueType;
  if (filters.aiIssueCategory) where.aiIssueCategory = filters.aiIssueCategory;
  if (filters.assigneeId) where.assigneeId = filters.assigneeId;

  if (filters.labelId) {
    where.labels = { some: { labelId: filters.labelId } };
  }

  if (filters.search) {
    where.title = { contains: filters.search };
  }

  return where;
}

export async function getIssues(
  filters: IssueFilters = {},
  sort: IssueSortOptions = { sortBy: "createdAt", sortDir: "desc" },
  page = 1,
  limit = 25
) {
  const where = buildWhereClause(filters);
  const skip = (page - 1) * limit;

  const [issues, total] = await Promise.all([
    prisma.issue.findMany({
      where,
      include: ISSUE_INCLUDE,
      orderBy: { [sort.sortBy]: sort.sortDir },
      skip,
      take: limit,
    }),
    prisma.issue.count({ where }),
  ]);

  return {
    issues: issues as unknown as IssueListItem[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getIssueById(id: string): Promise<IssueWithRelations | null> {
  const issue = await prisma.issue.findUnique({
    where: { id, deletedAt: null },
    include: ISSUE_FULL_INCLUDE,
  });
  return issue as unknown as IssueWithRelations | null;
}

export async function createIssue(input: CreateIssueInput) {
  const issueNumber = await getNextIssueNumber(input.projectId);
  const { labelIds, ...rest } = input;

  const issue = await prisma.issue.create({
    data: {
      ...rest,
      issueNumber,
      labels: labelIds?.length
        ? { create: labelIds.map((labelId) => ({ labelId })) }
        : undefined,
    },
    include: ISSUE_FULL_INCLUDE,
  }) as unknown as IssueWithRelations;

  // Record initial status history
  await prisma.statusHistory.create({
    data: {
      issueId: issue.id,
      fromStatus: null,
      toStatus: "NEW",
      changedBy: input.reporterId ?? "system",
      note: "Issue reported",
    },
  });

  return issue;
}

export async function updateIssue(id: string, input: UpdateIssueInput) {
  const { labelIds, ...rest } = input;

  if (labelIds !== undefined) {
    await prisma.labelOnIssue.deleteMany({ where: { issueId: id } });
  }

  return prisma.issue.update({
    where: { id },
    data: {
      ...rest,
      ...(labelIds !== undefined && {
        labels: {
          create: labelIds.map((labelId) => ({ labelId })),
        },
      }),
    },
    include: ISSUE_FULL_INCLUDE,
  }) as unknown as IssueWithRelations;
}

export async function deleteIssue(id: string) {
  return prisma.issue.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

export async function changeIssueStatus(
  id: string,
  newStatus: IssueStatus,
  note?: string,
  changedBy?: string
) {
  const issue = await prisma.issue.findUnique({
    where: { id },
    select: { status: true },
  });

  if (!issue) throw new Error("Issue not found");

  const allowed = ALLOWED_STATUS_TRANSITIONS[issue.status as IssueStatus];
  if (!allowed.includes(newStatus)) {
    throw new Error(
      `Cannot transition from ${issue.status} to ${newStatus}`
    );
  }

  const [updated] = await Promise.all([
    prisma.issue.update({
      where: { id },
      data: { status: newStatus },
      include: ISSUE_FULL_INCLUDE,
    }),
    prisma.statusHistory.create({
      data: {
        issueId: id,
        fromStatus: issue.status,
        toStatus: newStatus,
        changedBy: changedBy ?? "system",
        note,
      },
    }),
  ]);

  return updated as unknown as IssueWithRelations;
}

export async function getIssueStatusHistory(id: string) {
  return prisma.statusHistory.findMany({
    where: { issueId: id },
    orderBy: { createdAt: "asc" },
  });
}
