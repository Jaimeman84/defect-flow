# folder-structure.md — Codebase Structure
# Defect Flow

**Version:** 1.0
**Date:** 2026-03-13
**Status:** Draft — MVP
**Framework:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Prisma, shadcn/ui

---

## 1. Root Project Structure

```
defect-flow/
├── .env                          # Environment variables (gitignored)
├── .env.example                  # Template for required env vars
├── .eslintrc.json                # ESLint configuration
├── .gitignore
├── components.json               # shadcn/ui component registry config
├── next.config.ts                # Next.js configuration
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
│
├── prisma/                       # Database schema and migrations
│   ├── schema.prisma             # Prisma schema (all models + enums)
│   ├── seed.ts                   # Seed script for demo data
│   └── migrations/               # Auto-generated migration files
│
├── public/                       # Static assets
│   ├── favicon.ico
│   ├── logo.svg
│   └── uploads/                  # Local file attachment storage (MVP)
│       └── .gitkeep              # Ensures directory exists in git
│
├── src/                          # All application source code
│   ├── app/                      # Next.js App Router
│   ├── components/               # React components
│   ├── lib/                      # Shared utilities and configuration
│   ├── services/                 # Business logic / service layer
│   ├── hooks/                    # Custom React hooks
│   ├── types/                    # TypeScript type definitions
│   └── styles/                   # Global styles
│
├── ARD.md
├── BRD.md
├── ICP.md
├── workflow.md
└── folder-structure.md
```

---

## 2. App Router Structure (`src/app/`)

```
src/app/
│
├── layout.tsx                    # Root layout: ThemeProvider, Toaster, fonts
├── page.tsx                      # Root route: redirects to /dashboard
├── globals.css                   # Tailwind base + CSS variables (light/dark)
│
├── (app)/                        # Route group: main authenticated shell
│   ├── layout.tsx                # App shell layout: Sidebar + Header + main
│   │
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard: stats, charts, recent issues
│   │
│   ├── projects/
│   │   ├── page.tsx              # Project list: all projects as cards
│   │   ├── new/
│   │   │   └── page.tsx          # Create project form
│   │   └── [projectId]/
│   │       ├── page.tsx          # Project detail: overview + issue list
│   │       ├── layout.tsx        # Project layout: breadcrumb, project header
│   │       └── settings/
│   │           └── page.tsx      # Project settings: edit, archive
│   │
│   ├── issues/
│   │   ├── page.tsx              # Global issue list: all projects, full filters
│   │   ├── new/
│   │   │   └── page.tsx          # Create issue form (project selectable)
│   │   └── [issueId]/
│   │       ├── page.tsx          # Issue detail: all fields, comments, evidence
│   │       └── edit/
│   │           └── page.tsx      # Edit issue form
│   │
│   └── settings/
│       └── page.tsx              # Workspace settings: labels, seed, preferences
│
└── api/                          # Route Handlers (REST API)
    └── v1/
        ├── projects/
        │   ├── route.ts          # GET /api/v1/projects, POST /api/v1/projects
        │   └── [id]/
        │       └── route.ts      # GET, PUT, DELETE /api/v1/projects/[id]
        │
        ├── issues/
        │   ├── route.ts          # GET /api/v1/issues, POST /api/v1/issues
        │   └── [id]/
        │       ├── route.ts      # GET, PUT, DELETE /api/v1/issues/[id]
        │       ├── status/
        │       │   └── route.ts  # PATCH /api/v1/issues/[id]/status
        │       ├── comments/
        │       │   └── route.ts  # GET, POST /api/v1/issues/[id]/comments
        │       ├── attachments/
        │       │   └── route.ts  # GET, POST /api/v1/issues/[id]/attachments
        │       └── history/
        │           └── route.ts  # GET /api/v1/issues/[id]/history
        │
        ├── attachments/
        │   └── [id]/
        │       └── route.ts      # DELETE /api/v1/attachments/[id]
        │
        └── labels/
            └── route.ts          # GET, POST /api/v1/labels
```

---

## 3. Components (`src/components/`)

```
src/components/
│
├── ui/                           # shadcn/ui primitives (auto-generated, do not modify)
│   ├── badge.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── checkbox.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── popover.tsx
│   ├── progress.tsx
│   ├── scroll-area.tsx
│   ├── select.tsx
│   ├── separator.tsx
│   ├── skeleton.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   ├── textarea.tsx
│   ├── toast.tsx
│   ├── toaster.tsx
│   └── tooltip.tsx
│
├── layout/                       # App shell and page structure
│   ├── app-shell.tsx             # Wraps sidebar + main content
│   ├── sidebar.tsx               # Left nav: Dashboard, Projects, Issues, Settings
│   ├── header.tsx                # Top bar: breadcrumbs, search, New Issue button
│   ├── page-container.tsx        # Max-width + padding wrapper
│   ├── section-header.tsx        # Page section title + optional action button
│   └── theme-toggle.tsx          # Dark/light mode toggle button
│
├── dashboard/                    # Dashboard-specific components
│   ├── stats-card.tsx            # Metric card: label + value + trend
│   ├── stats-grid.tsx            # Grid of stats-card components
│   ├── issues-by-status-chart.tsx # Donut or bar chart for status breakdown
│   ├── issues-by-severity-chart.tsx
│   ├── recent-issues-list.tsx    # Last N issues with status + severity
│   └── project-summary-cards.tsx # Project cards with issue counts
│
├── projects/                     # Project feature components
│   ├── project-card.tsx          # Project card: name, description, issue count
│   ├── project-list.tsx          # Grid/list of project cards
│   ├── project-form.tsx          # Create/edit project form (React Hook Form)
│   └── project-header.tsx        # Project detail page header: name, actions
│
├── issues/                       # Issue feature components (largest section)
│   ├── issue-list/
│   │   ├── issue-list.tsx        # Container: view toggle, list/table, pagination
│   │   ├── issue-table.tsx       # Table view of issues
│   │   ├── issue-card.tsx        # Card view of single issue
│   │   ├── issue-row.tsx         # Table row for single issue
│   │   └── empty-state.tsx       # Empty list with CTA to create issue
│   │
│   ├── issue-form/
│   │   ├── issue-form.tsx        # Unified create/edit form container
│   │   ├── issue-type-selector.tsx   # BUG vs AI_ISSUE toggle/select
│   │   ├── ai-category-select.tsx    # AI issue category dropdown (conditional)
│   │   ├── severity-select.tsx       # Severity dropdown with colored indicators
│   │   ├── priority-select.tsx       # Priority dropdown
│   │   ├── status-select.tsx         # Status select with transition validation
│   │   ├── label-picker.tsx          # Multi-select label picker
│   │   ├── environment-input.tsx     # Environment free text input
│   │   └── reproduction-steps.tsx    # Numbered steps textarea
│   │
│   ├── issue-detail/
│   │   ├── issue-detail.tsx      # Full detail layout container
│   │   ├── issue-header.tsx      # Title, status badge, action menu
│   │   ├── issue-metadata.tsx    # Sidebar: severity, priority, project, labels
│   │   ├── issue-description.tsx # Rendered description + repro steps
│   │   ├── status-timeline.tsx   # Visual history of status changes
│   │   └── status-change-dialog.tsx  # Modal: new status + optional note
│   │
│   ├── filters/
│   │   ├── filter-bar.tsx        # Full filter bar container
│   │   ├── search-input.tsx      # Debounced title search input
│   │   ├── status-filter.tsx     # Status multi-select filter
│   │   ├── severity-filter.tsx   # Severity filter
│   │   ├── priority-filter.tsx   # Priority filter
│   │   ├── type-filter.tsx       # Issue type filter (BUG / AI_ISSUE)
│   │   ├── label-filter.tsx      # Label filter
│   │   └── active-filters.tsx    # Shows applied filters as dismissible chips
│   │
│   └── shared/
│       ├── severity-badge.tsx    # Colored badge for severity values
│       ├── priority-indicator.tsx # Priority icon + label
│       ├── status-badge.tsx      # Colored badge for status values
│       ├── ai-category-badge.tsx # Badge for AI issue category
│       ├── issue-type-icon.tsx   # Bug icon vs AI icon
│       └── label-chip.tsx        # Small label tag with color
│
├── comments/                     # Comment feature components
│   ├── comment-list.tsx          # Thread of comments (ordered by createdAt)
│   ├── comment-item.tsx          # Single comment: author, body, timestamp
│   └── comment-form.tsx          # Add comment textarea + submit
│
├── evidence/                     # Evidence / attachment feature components
│   ├── evidence-panel.tsx        # Container: all three attachment types
│   ├── drop-zone.tsx             # Drag-and-drop file upload area
│   ├── file-attachment-card.tsx  # Uploaded file: icon, name, download, delete
│   ├── link-attachment-card.tsx  # Link attachment: title, URL, open, delete
│   ├── text-note-card.tsx        # Text note: content preview, expand, delete
│   ├── add-link-form.tsx         # URL + optional title form
│   ├── add-text-note-form.tsx    # Textarea form for text note
│   └── attachment-list.tsx       # Sorted list of all attachments
│
└── labels/                       # Label management components
    ├── label-list.tsx            # All labels with edit/delete
    ├── label-form.tsx            # Create/edit label: name + color picker
    └── color-picker.tsx          # Simple preset color palette selector
```

---

## 4. Service Layer (`src/services/`)

```
src/services/
│
├── issue.service.ts              # All issue CRUD + filtering + search
│   # getIssues(filters, pagination)
│   # getIssueById(id)
│   # createIssue(data)
│   # updateIssue(id, data)
│   # softDeleteIssue(id)
│   # changeIssueStatus(id, newStatus, note?)
│   # getIssueStatusHistory(id)
│   # searchIssues(query)
│
├── project.service.ts            # Project CRUD
│   # getProjects()
│   # getProjectById(id)
│   # createProject(data)
│   # updateProject(id, data)
│   # archiveProject(id)
│   # getProjectSummary(id)
│
├── comment.service.ts            # Comment operations
│   # getCommentsByIssue(issueId)
│   # createComment(issueId, body)
│   # deleteComment(id)
│
├── attachment.service.ts         # Attachment and evidence management
│   # getAttachmentsByIssue(issueId)
│   # uploadFile(issueId, file)       # Uses StorageProvider
│   # addLink(issueId, url, title?)
│   # addTextNote(issueId, content)
│   # deleteAttachment(id)
│
├── label.service.ts              # Label management
│   # getLabels()
│   # createLabel(name, color)
│   # updateLabel(id, data)
│   # deleteLabel(id)
│   # assignLabelToIssue(issueId, labelId)
│   # removeLabelFromIssue(issueId, labelId)
│
├── dashboard.service.ts          # Dashboard aggregation queries
│   # getDashboardStats()
│   # getIssuesByStatus()
│   # getIssuesBySeverity()
│   # getRecentIssues(limit)
│   # getProjectSummaries()
│
└── storage/                      # File storage abstraction
    ├── storage.interface.ts      # StorageProvider interface
    ├── local.storage.ts          # LocalStorageProvider (MVP: /public/uploads)
    └── index.ts                  # Exports active provider based on env config
```

---

## 5. Server Actions (`src/app/actions/`)

```
src/app/actions/
│
├── issue.actions.ts
│   # createIssueAction(formData: FormData)
│   # updateIssueAction(id: string, formData: FormData)
│   # deleteIssueAction(id: string)
│   # changeStatusAction(id: string, status: IssueStatus, note?: string)
│
├── project.actions.ts
│   # createProjectAction(formData: FormData)
│   # updateProjectAction(id: string, formData: FormData)
│   # archiveProjectAction(id: string)
│
├── comment.actions.ts
│   # addCommentAction(issueId: string, body: string)
│   # deleteCommentAction(id: string)
│
├── attachment.actions.ts
│   # uploadFileAction(issueId: string, formData: FormData)
│   # addLinkAction(issueId: string, url: string, title?: string)
│   # addTextNoteAction(issueId: string, content: string)
│   # deleteAttachmentAction(id: string)
│
└── label.actions.ts
    # createLabelAction(name: string, color: string)
    # updateLabelAction(id: string, name: string, color: string)
    # deleteLabelAction(id: string)
```

---

## 6. Hooks (`src/hooks/`)

```
src/hooks/
│
├── use-issue-filters.ts          # Manages filter state synced to URL params
├── use-debounce.ts               # Debounces search input value
├── use-file-upload.ts            # Manages drag-and-drop and upload state
├── use-issue-form.ts             # React Hook Form setup for issue create/edit
├── use-project-form.ts           # React Hook Form setup for project create/edit
├── use-status-transition.ts      # Validates allowed status transitions
└── use-toast.ts                  # shadcn/ui toast hook re-export
```

---

## 7. Types (`src/types/`)

```
src/types/
│
├── issue.types.ts                # Issue-related TypeScript types
│   # IssueWithRelations         (Issue + comments + attachments + labels + history)
│   # IssueListItem              (Issue + summary fields for list views)
│   # CreateIssueInput
│   # UpdateIssueInput
│   # IssueFilters
│   # IssueSortOptions
│
├── project.types.ts              # Project types
│   # ProjectWithSummary         (Project + issue counts by status)
│   # CreateProjectInput
│   # UpdateProjectInput
│
├── attachment.types.ts           # Attachment types
│   # AttachmentWithMeta
│   # UploadResult
│
├── dashboard.types.ts            # Dashboard aggregation types
│   # DashboardStats
│   # StatusBreakdown
│   # SeverityBreakdown
│
├── api.types.ts                  # API response envelope types
│   # ApiSuccess<T>
│   # ApiError
│   # PaginationMeta
│   # PaginatedResponse<T>
│
└── index.ts                      # Re-exports all types
```

---

## 8. Library / Utilities (`src/lib/`)

```
src/lib/
│
├── prisma.ts                     # Prisma client singleton (prevents connection pooling issues in dev)
├── utils.ts                      # cn() utility (clsx + tailwind-merge), common helpers
├── constants.ts                  # App-wide constants: status labels, severity colors, max file size
├── validations/                  # Zod schemas for form and API validation
│   ├── issue.schema.ts           # CreateIssue, UpdateIssue Zod schemas
│   ├── project.schema.ts         # CreateProject, UpdateProject Zod schemas
│   ├── comment.schema.ts
│   ├── attachment.schema.ts
│   └── label.schema.ts
└── formatters.ts                 # Date formatting, file size formatting, status display labels
```

---

## 9. Styles (`src/styles/`)

```
src/styles/
└── globals.css                   # (also at src/app/globals.css)
                                  # Tailwind directives
                                  # shadcn/ui CSS variable tokens (--background, --foreground, etc.)
                                  # Light and dark mode overrides
                                  # Custom utility classes
```

---

## 10. Prisma (`prisma/`)

```
prisma/
│
├── schema.prisma                 # Complete data model
│   # generator client
│   # datasource db (SQLite for MVP, env-configurable for Postgres)
│   # All model definitions (see ARD.md for full schema)
│   # All enum definitions
│
├── seed.ts                       # Demo data seeder
│   # Creates default Workspace
│   # Creates 2–3 sample Projects
│   # Creates 5–10 sample seeded Users
│   # Creates sample Labels (Feature, Regression, Smoke, AI-Safety, etc.)
│   # Creates 15–20 diverse sample Issues:
│   #   - Mix of BUG and AI_ISSUE types
│   #   - All status stages represented
│   #   - Mix of severities and priorities
│   #   - Sample comments and attachments
│   # Creates sample StatusHistory records
│
└── migrations/                   # Auto-generated by `prisma migrate dev`
    └── [timestamp]_init/
        └── migration.sql
```

---

## 11. Complete File Tree (condensed)

```
defect-flow/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/
│   └── uploads/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── actions/
│   │   │   ├── issue.actions.ts
│   │   │   ├── project.actions.ts
│   │   │   ├── comment.actions.ts
│   │   │   ├── attachment.actions.ts
│   │   │   └── label.actions.ts
│   │   ├── (app)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [projectId]/
│   │   │   │       ├── layout.tsx
│   │   │   │       ├── page.tsx
│   │   │   │       └── settings/page.tsx
│   │   │   ├── issues/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [issueId]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── edit/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── api/v1/
│   │       ├── projects/route.ts
│   │       ├── projects/[id]/route.ts
│   │       ├── issues/route.ts
│   │       ├── issues/[id]/route.ts
│   │       ├── issues/[id]/status/route.ts
│   │       ├── issues/[id]/comments/route.ts
│   │       ├── issues/[id]/attachments/route.ts
│   │       ├── issues/[id]/history/route.ts
│   │       ├── attachments/[id]/route.ts
│   │       └── labels/route.ts
│   ├── components/
│   │   ├── ui/                   (shadcn/ui primitives)
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── issues/
│   │   │   ├── issue-list/
│   │   │   ├── issue-form/
│   │   │   ├── issue-detail/
│   │   │   ├── filters/
│   │   │   └── shared/
│   │   ├── comments/
│   │   ├── evidence/
│   │   └── labels/
│   ├── services/
│   │   ├── issue.service.ts
│   │   ├── project.service.ts
│   │   ├── comment.service.ts
│   │   ├── attachment.service.ts
│   │   ├── label.service.ts
│   │   ├── dashboard.service.ts
│   │   └── storage/
│   │       ├── storage.interface.ts
│   │       ├── local.storage.ts
│   │       └── index.ts
│   ├── hooks/
│   │   ├── use-issue-filters.ts
│   │   ├── use-debounce.ts
│   │   ├── use-file-upload.ts
│   │   ├── use-issue-form.ts
│   │   ├── use-project-form.ts
│   │   ├── use-status-transition.ts
│   │   └── use-toast.ts
│   ├── types/
│   │   ├── issue.types.ts
│   │   ├── project.types.ts
│   │   ├── attachment.types.ts
│   │   ├── dashboard.types.ts
│   │   ├── api.types.ts
│   │   └── index.ts
│   └── lib/
│       ├── prisma.ts
│       ├── utils.ts
│       ├── constants.ts
│       ├── formatters.ts
│       └── validations/
│           ├── issue.schema.ts
│           ├── project.schema.ts
│           ├── comment.schema.ts
│           ├── attachment.schema.ts
│           └── label.schema.ts
├── .env.example
├── components.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 12. Key Conventions

### Naming Conventions

| Pattern | Example |
|---------|---------|
| Page components | `page.tsx` (Next.js convention) |
| Layout components | `layout.tsx` (Next.js convention) |
| Feature components | `kebab-case.tsx` (e.g., `issue-card.tsx`) |
| Server actions | `kebab-case.actions.ts` (e.g., `issue.actions.ts`) |
| Services | `kebab-case.service.ts` (e.g., `issue.service.ts`) |
| Hooks | `use-kebab-case.ts` (e.g., `use-issue-filters.ts`) |
| Types | `kebab-case.types.ts` (e.g., `issue.types.ts`) |
| Zod schemas | `kebab-case.schema.ts` (e.g., `issue.schema.ts`) |
| Constants | `SCREAMING_SNAKE_CASE` within `constants.ts` |

### Import Paths

Configure `tsconfig.json` path aliases:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/services/*": ["./src/services/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

### Component Patterns

- **Server Components by default** — only add `"use client"` when necessary
- **No barrel index.ts** in components — import directly from the component file
- **Co-locate styles** with components using Tailwind utilities (no CSS modules)
- **Props interfaces** defined at top of component file, not in separate types file
- **Server Actions** passed as props to client components (not imported directly in client)

### Data Fetching Patterns

```typescript
// Server Component: fetch directly in component
// src/app/(app)/issues/[issueId]/page.tsx
async function IssueDetailPage({ params }: { params: { issueId: string } }) {
  const issue = await getIssueById(params.issueId)  // calls service directly
  return <IssueDetail issue={issue} />
}

// Client Component: receives data as props, handles mutations via Server Actions
// src/components/issues/issue-detail/status-change-dialog.tsx
"use client"
function StatusChangeDialog({ issue, changeStatusAction }) {
  // uses changeStatusAction (Server Action) passed as prop
}
```
