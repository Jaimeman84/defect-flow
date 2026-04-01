import { notFound } from "next/navigation"
import Link from "next/link"
import { Edit, Trash2, ArrowLeft } from "lucide-react"
import { Header } from "@/components/layout/header"
import { PageContainer } from "@/components/layout/page-container"
import { StatusBadge } from "@/components/issues/shared/status-badge"
import { SeverityBadge } from "@/components/issues/shared/severity-badge"
import { PriorityIndicator } from "@/components/issues/shared/priority-indicator"
import { IssueTypeIcon } from "@/components/issues/shared/issue-type-icon"
import { AICategoryBadge } from "@/components/issues/shared/ai-category-badge"
import { LabelChip } from "@/components/issues/shared/label-chip"
import { StatusChangeDialog } from "@/components/issues/issue-detail/status-change-dialog"
import { StatusTimeline } from "@/components/issues/issue-detail/status-timeline"
import { CommentList } from "@/components/comments/comment-list"
import { EvidencePanel } from "@/components/evidence/evidence-panel"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getIssueById } from "@/services/issue.service"
import { formatDateTime, formatRelativeTime } from "@/lib/formatters"
import { DeleteIssueButton } from "./delete-button"

interface Props { params: Promise<{ issueId: string }> }

export const dynamic = "force-dynamic"

export default async function IssueDetailPage({ params }: Props) {
  const { issueId } = await params
  const issue = await getIssueById(issueId)
  if (!issue) notFound()

  return (
    <>
      <Header
        title={issue.title}
        action={
          <div className="flex items-center gap-2">
            <Link href={`/projects/${issue.projectId}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <StatusChangeDialog issueId={issue.id} currentStatus={issue.status} />
            <Link href={`/issues/${issue.id}/edit`}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Edit className="h-3.5 w-3.5" />
                Edit
              </Button>
            </Link>
            <DeleteIssueButton issueId={issue.id} projectId={issue.projectId} />
          </div>
        }
      />
      <PageContainer>
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Issue Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <IssueTypeIcon type={issue.issueType} />
                  <span className="text-xs text-muted-foreground font-mono">
                    {issue.project.name}
                  </span>
                </div>
                <h1 className="text-xl font-semibold mb-3">{issue.title}</h1>
                <div className="flex flex-wrap gap-2 items-center">
                  <StatusBadge status={issue.status} />
                  <SeverityBadge severity={issue.severity} showDot />
                  <PriorityIndicator priority={issue.priority} showLabel />
                  {issue.aiIssueCategory && <AICategoryBadge category={issue.aiIssueCategory} />}
                  {issue.labels.map(({ label }) => (
                    <LabelChip key={label.id} name={label.name} color={label.color} />
                  ))}
                </div>
              </div>

              <Separator />

              {/* Description */}
              {issue.description && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{issue.description}</p>
                </div>
              )}

              {/* Steps */}
              {issue.stepsToReproduce && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Steps to Reproduce</h3>
                  <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">{issue.stepsToReproduce}</pre>
                </div>
              )}

              {/* Expected / Actual */}
              {(issue.expectedResult || issue.actualResult) && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {issue.expectedResult && (
                    <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-3">
                      <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">Expected</p>
                      <p className="text-sm text-green-800 dark:text-green-300 whitespace-pre-wrap">{issue.expectedResult}</p>
                    </div>
                  )}
                  {issue.actualResult && (
                    <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
                      <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">Actual</p>
                      <p className="text-sm text-red-800 dark:text-red-300 whitespace-pre-wrap">{issue.actualResult}</p>
                    </div>
                  )}
                </div>
              )}

              <Separator />

              {/* Evidence */}
              <div>
                <h3 className="text-sm font-medium mb-3">Evidence</h3>
                <EvidencePanel issueId={issue.id} attachments={issue.attachments} />
              </div>

              <Separator />

              {/* Comments */}
              <div>
                <h3 className="text-sm font-medium mb-3">
                  Comments {issue.comments.length > 0 && `(${issue.comments.length})`}
                </h3>
                <CommentList comments={issue.comments} issueId={issue.id} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Project</span>
                    <Link href={`/projects/${issue.projectId}`} className="font-medium hover:underline">
                      {issue.project.name}
                    </Link>
                  </div>
                  {issue.environment && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Environment</span>
                      <span className="font-medium text-right max-w-[60%] truncate">{issue.environment}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span className="text-right">{formatRelativeTime(issue.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Updated</span>
                    <span className="text-right">{formatRelativeTime(issue.updatedAt)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Status History */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Status History</CardTitle>
                </CardHeader>
                <CardContent>
                  <StatusTimeline history={issue.statusHistory} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  )
}
