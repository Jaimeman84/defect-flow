import Link from "next/link"
import { Bug, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { ProjectWithSummary } from "@/types/project.types"

interface ProjectCardProps {
  project: ProjectWithSummary
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full shrink-0"
              style={{ backgroundColor: project.color }}
            />
            <h3 className="font-semibold truncate">{project.name}</h3>
          </div>
          {project.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Bug className="h-4 w-4" />
              <span>{project.openIssues} open</span>
            </div>
            {project.criticalIssues > 0 && (
              <div className="flex items-center gap-1 text-red-500">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>{project.criticalIssues} critical</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
