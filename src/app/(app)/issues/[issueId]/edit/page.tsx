import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { PageContainer } from "@/components/layout/page-container"
import { IssueForm } from "@/components/issues/issue-form/issue-form"
import { getIssueById } from "@/services/issue.service"
import { getProjects } from "@/services/project.service"
import { getLabels } from "@/services/label.service"

export const dynamic = "force-dynamic"

interface Props { params: Promise<{ issueId: string }> }

export default async function EditIssuePage({ params }: Props) {
  const { issueId } = await params
  const [issue, projects, labels] = await Promise.all([
    getIssueById(issueId),
    getProjects(),
    getLabels(),
  ])

  if (!issue) notFound()

  return (
    <>
      <Header title="Edit Issue" />
      <PageContainer>
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-6 text-xl font-semibold">Edit Issue</h2>
          <IssueForm projects={projects} labels={labels} issue={issue} />
        </div>
      </PageContainer>
    </>
  )
}
