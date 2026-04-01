import { Header } from "@/components/layout/header"
import { PageContainer } from "@/components/layout/page-container"
import { SectionHeader } from "@/components/layout/section-header"
import { LabelForm } from "@/components/labels/label-form"
import { LabelList } from "@/components/labels/label-list"
import { Separator } from "@/components/ui/separator"
import { getLabels } from "@/services/label.service"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const labels = await getLabels()

  return (
    <>
      <Header title="Settings" description="Manage labels and workspace preferences" />
      <PageContainer>
        <div className="mx-auto max-w-2xl space-y-8">
          {/* Labels */}
          <div>
            <SectionHeader
              title="Labels"
              description="Organize issues with custom color-coded labels"
              className="mb-4"
            />
            <LabelForm />
            {labels.length > 0 && (
              <>
                <Separator className="my-4" />
                <LabelList labels={labels} />
              </>
            )}
          </div>

          <Separator />

          {/* About */}
          <div>
            <SectionHeader title="About" description="Defect Flow application information" className="mb-4" />
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Version: 0.1.0 MVP</p>
              <p>Database: SQLite (local)</p>
              <p>Storage: Local filesystem</p>
              <p>Auth: Not enabled (single workspace mode)</p>
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  )
}
