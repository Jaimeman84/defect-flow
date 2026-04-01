import { Header } from "@/components/layout/header"
import { PageContainer } from "@/components/layout/page-container"
import { IssueList } from "@/components/issues/issue-list/issue-list"
import { FilterBar } from "@/components/issues/filters/filter-bar"
import { getIssues } from "@/services/issue.service"
import { getLabels } from "@/services/label.service"
import type { IssueStatus, Severity, Priority, IssueType } from "@/lib/constants"
import type { IssueListItem } from "@/types/issue.types"

export const dynamic = "force-dynamic"

interface Props {
  searchParams: Promise<{
    status?: string; severity?: string; priority?: string
    type?: string; labelId?: string; search?: string; page?: string
  }>
}

export default async function IssuesPage({ searchParams }: Props) {
  const sp = await searchParams
  const [labels, result] = await Promise.all([
    getLabels(),
    getIssues(
      {
        status: sp.status as IssueStatus | undefined,
        severity: sp.severity as Severity | undefined,
        priority: sp.priority as Priority | undefined,
        issueType: sp.type as IssueType | undefined,
        labelId: sp.labelId,
        search: sp.search,
      },
      { sortBy: "createdAt", sortDir: "desc" },
      Number(sp.page ?? 1),
      50
    ),
  ])

  return (
    <>
      <Header title="All Issues" description="Issues across all projects" />
      <PageContainer>
        <div className="space-y-4">
          <FilterBar labels={labels} />
          <IssueList issues={result.issues as IssueListItem[]} total={result.total} />
        </div>
      </PageContainer>
    </>
  )
}
