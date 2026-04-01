import { Header } from "@/components/layout/header"
import { PageContainer } from "@/components/layout/page-container"
import { IssueForm } from "@/components/issues/issue-form/issue-form"
import { getProjects } from "@/services/project.service"
import { getLabels } from "@/services/label.service"

export const dynamic = "force-dynamic"

interface Props { searchParams: Promise<{ projectId?: string }> }

export default async function NewIssuePage({ searchParams }: Props) {
  const sp = await searchParams
  const [projects, labels] = await Promise.all([getProjects(), getLabels()])

  return (
    <>
      <Header title="New Issue" />
      <PageContainer>
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-6 text-xl font-semibold">Report a Bug</h2>
          {projects.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">
                You need at least one project before creating an issue.{" "}
                <a href="/projects/new" className="text-primary underline">Create a project</a> first.
              </p>
            </div>
          ) : (
            <IssueForm projects={projects} labels={labels} defaultProjectId={sp.projectId} />
          )}
        </div>
      </PageContainer>
    </>
  )
}
