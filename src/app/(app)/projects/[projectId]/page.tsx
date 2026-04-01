import Link from "next/link"
import { notFound } from "next/navigation"
import { Plus, Settings } from "lucide-react"
import { Header } from "@/components/layout/header"
import { PageContainer } from "@/components/layout/page-container"
import { IssueList } from "@/components/issues/issue-list/issue-list"
import { FilterBar } from "@/components/issues/filters/filter-bar"
import { Button } from "@/components/ui/button"
import { getProjectById } from "@/services/project.service"
import { getIssues } from "@/services/issue.service"
import { getLabels } from "@/services/label.service"
import type { IssueStatus, Severity, Priority, IssueType } from "@/lib/constants"
import type { IssueListItem } from "@/types/issue.types"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ projectId: string }>
  searchParams: Promise<{ status?: string; severity?: string; priority?: string; type?: string; labelId?: string; search?: string }>
}

export default async function ProjectPage({ params, searchParams }: Props) {
  const { projectId } = await params
  const sp = await searchParams
  const [project, labels] = await Promise.all([
    getProjectById(projectId),
    getLabels(),
  ])

  if (!project) notFound()

  const { issues, total } = await getIssues(
    {
      projectId,
      status: sp.status as IssueStatus | undefined,
      severity: sp.severity as Severity | undefined,
      priority: sp.priority as Priority | undefined,
      issueType: sp.type as IssueType | undefined,
      labelId: sp.labelId,
      search: sp.search,
    },
    { sortBy: "createdAt", sortDir: "desc" }
  )

  return (
    <>
      <Header
        title={project.name}
        description={project.description ?? undefined}
        action={
          <div className="flex gap-2">
            <Link href={`/projects/${project.id}/settings`}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/issues/new?projectId=${project.id}`}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                New Issue
              </Button>
            </Link>
          </div>
        }
      />
      <PageContainer>
        <div className="space-y-4">
          <FilterBar labels={labels} projectId={projectId} />
          <IssueList issues={issues as IssueListItem[]} total={total} />
        </div>
      </PageContainer>
    </>
  )
}
