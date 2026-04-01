import { prisma } from "@/lib/prisma";

export async function getCommentsByIssue(issueId: string) {
  return prisma.comment.findMany({
    where: { issueId },
    orderBy: { createdAt: "asc" },
  });
}

export async function createComment(
  issueId: string,
  body: string,
  authorName?: string
) {
  return prisma.comment.create({
    data: { issueId, body, authorName: authorName ?? "QA Tester" },
  });
}

export async function deleteComment(id: string) {
  return prisma.comment.delete({ where: { id } });
}
