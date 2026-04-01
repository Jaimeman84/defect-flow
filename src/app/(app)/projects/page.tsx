import Link from "next/link"
import { Plus, FolderOpen } from "lucide-react"
import { Header } from "@/components/layout/header"
import { PageContainer } from "@/components/layout/page-container"
import { ProjectCard } from "@/components/projects/project-card"
import { Button } from "@/components/ui/button"
import { getProjects } from "@/services/project.service"

export const dynamic = "force-dynamic"

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <>
      <Header
        title="Projects"
        description={`${projects.length} project${projects.length !== 1 ? "s" : ""}`}
        action={
          <Link href="/projects/new">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              New Project
            </Button>
          </Link>
        }
      />
      <PageContainer>
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <FolderOpen className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-base font-semibold">No projects yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">Create your first project to start tracking bugs.</p>
            <Link href="/projects/new">
              <Button size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                New Project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </PageContainer>
    </>
  )
}
