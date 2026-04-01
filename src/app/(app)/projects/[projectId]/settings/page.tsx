import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { PageContainer } from "@/components/layout/page-container"
import { ProjectForm } from "@/components/projects/project-form"
import { getProjectById } from "@/services/project.service"
import { ArchiveProjectButton } from "./archive-button"

interface Props { params: Promise<{ projectId: string }> }

export default async function ProjectSettingsPage({ params }: Props) {
  const { projectId } = await params
  const project = await getProjectById(projectId)
  if (!project) notFound()

  return (
    <>
      <Header title={`${project.name} · Settings`} />
      <PageContainer>
        <div className="mx-auto max-w-lg space-y-8">
          <div>
            <h2 className="mb-4 text-lg font-semibold">Project Settings</h2>
            <ProjectForm project={project} />
          </div>
          <div className="rounded-lg border border-destructive/30 p-4 space-y-2">
            <h3 className="font-medium text-destructive">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">Archive this project. Issues will be preserved but the project will be hidden.</p>
            <ArchiveProjectButton projectId={project.id} />
          </div>
        </div>
      </PageContainer>
    </>
  )
}
