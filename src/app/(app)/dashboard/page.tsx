import { Bug, AlertTriangle, Clock, CheckCircle, Zap, BrainCircuit } from "lucide-react"
import { Header } from "@/components/layout/header"
import { PageContainer } from "@/components/layout/page-container"
import { SectionHeader } from "@/components/layout/section-header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { IssuesByStatusChart } from "@/components/dashboard/issues-by-status-chart"
import { IssuesBySeverityChart } from "@/components/dashboard/issues-by-severity-chart"
import { RecentIssuesList } from "@/components/dashboard/recent-issues-list"
import { ProjectCard } from "@/components/projects/project-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getDashboardStats,
  getIssuesByStatus,
  getIssuesBySeverity,
  getRecentIssues,
  getProjectSummaries,
} from "@/services/dashboard.service"
import { getProjects } from "@/services/project.service"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  let stats, statusData, severityData, recentIssues, projectSummaries, projects

  try {
    ;[stats, statusData, severityData, recentIssues, projectSummaries, projects] =
      await Promise.all([
        getDashboardStats(),
        getIssuesByStatus(),
        getIssuesBySeverity(),
        getRecentIssues(8),
        getProjectSummaries(),
        getProjects(),
      ])
  } catch (e: unknown) {
    const isDbMissing =
      e instanceof Error && e.message.includes("does not exist in the current database")
    return (
      <>
        <Header title="Dashboard" description="Overview of all issues and projects" />
        <PageContainer>
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="max-w-md rounded-lg border border-dashed p-10 text-center">
              <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-amber-500" />
              <h2 className="mb-2 text-lg font-semibold">
                {isDbMissing ? "Database not set up" : "Something went wrong"}
              </h2>
              <p className="mb-6 text-sm text-muted-foreground">
                {isDbMissing
                  ? "The database tables don't exist yet. Run the following commands in your terminal to get started:"
                  : String(e)}
              </p>
              {isDbMissing && (
                <pre className="rounded-md bg-muted px-4 py-3 text-left text-sm font-mono">
                  {"npx prisma db push\nnpm run db:seed"}
                </pre>
              )}
            </div>
          </div>
        </PageContainer>
      </>
    )
  }

  return (
    <>
      <Header title="Dashboard" description="Overview of all issues and projects" />
      <PageContainer>
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            <StatsCard
              title="Open Issues"
              value={stats!.totalOpen}
              icon={Bug}
              description="Across all projects"
              iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            />
            <StatsCard
              title="Critical"
              value={stats.critical}
              icon={AlertTriangle}
              description="Needs immediate attention"
              iconClassName="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            />
            <StatsCard
              title="In Progress"
              value={stats.inProgress}
              icon={Zap}
              description="Currently being fixed"
              iconClassName="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
            />
            <StatsCard
              title="Ready for Retest"
              value={stats.readyForRetest}
              icon={Clock}
              description="Awaiting QA verification"
              iconClassName="bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400"
            />
            <StatsCard
              title="Closed Today"
              value={stats.closedToday}
              icon={CheckCircle}
              description="Verified and resolved"
              iconClassName="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
            />
            <StatsCard
              title="AI Issues"
              value={stats.aiIssues}
              icon={BrainCircuit}
              description="LLM / AI defects"
              iconClassName="bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
            />
          </div>

          {/* Charts */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Issues by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <IssuesByStatusChart data={statusData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Open Issues by Severity</CardTitle>
              </CardHeader>
              <CardContent>
                <IssuesBySeverityChart data={severityData} />
              </CardContent>
            </Card>
          </div>

          {/* Projects + Recent Issues */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Recent Issues</CardTitle>
                </CardHeader>
                <CardContent className="px-2">
                  <RecentIssuesList issues={recentIssues} />
                </CardContent>
              </Card>
            </div>
            <div>
              <SectionHeader title="Projects" className="mb-3" />
              <div className="space-y-3">
                {projects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  )
}
