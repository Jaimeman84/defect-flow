import { Header } from "@/components/layout/header"
import { PageContainer } from "@/components/layout/page-container"
import { ProjectForm } from "@/components/projects/project-form"

export default function NewProjectPage() {
  return (
    <>
      <Header title="New Project" />
      <PageContainer>
        <div className="mx-auto max-w-lg">
          <h2 className="mb-6 text-xl font-semibold">Create Project</h2>
          <ProjectForm />
        </div>
      </PageContainer>
    </>
  )
}
