import { prisma } from "@/lib/prisma";

export async function getLabels() {
  return prisma.label.findMany({ orderBy: { name: "asc" } });
}

export async function createLabel(name: string, color: string) {
  return prisma.label.create({ data: { name, color } });
}

export async function updateLabel(id: string, name: string, color: string) {
  return prisma.label.update({ where: { id }, data: { name, color } });
}

export async function deleteLabel(id: string) {
  return prisma.label.delete({ where: { id } });
}
