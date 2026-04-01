# ARD — Architecture Requirements Document
# Defect Flow

**Version:** 1.0
**Date:** 2026-03-13
**Status:** Draft — MVP

---

## 1. System Overview

Defect Flow is a lightweight, modern bug and issue tracking tool built for QA engineers, manual testers, automation engineers, AI testing practitioners, and small teams. It supports traditional software defects as well as AI/LLM-specific issue types such as hallucinations, prompt injection, bias, and unsafe outputs.

The system is designed to be:

- Fast to deploy (runs locally out of the box)
- Simple to use (minimal friction from report to close)
- Extensible (clean separation of concerns to support future growth)

The MVP is a standalone Next.js application backed by SQLite via Prisma ORM. It requires no authentication, no external services, and no cloud dependencies.

---

## 2. Architectural Goals

| Goal | Description |
|------|-------------|
| **Simplicity** | The MVP must run with a single `npm run dev` command. Zero external dependencies required. |
| **Extensibility** | Every architectural decision must anticipate future scale: auth, multi-tenancy, cloud storage, integrations. |
| **Type Safety** | Full TypeScript from database layer through API to UI. |
| **Separation of Concerns** | Clear boundaries between data access, business logic, and presentation layers. |
| **Modern DX** | Next.js App Router, Prisma, shadcn/ui, and Tailwind ensure a productive developer experience. |
| **Portability** | SQLite for MVP; schema must be compatible with PostgreSQL/Supabase migration. |
| **Testability** | Service layer must be independently testable without UI or database dependencies. |

---

## 3. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser / Client                      │
│                                                              │
│   Next.js React Components (App Router, RSC + Client)        │
│   Tailwind CSS + shadcn/ui                                   │
└───────────────────┬─────────────────────────────────────────┘
                    │ HTTP / Fetch
┌───────────────────▼─────────────────────────────────────────┐
│                     Next.js Server                           │
│                                                              │
│   App Router (Server Components + Route Handlers)            │
│   Server Actions (mutations)                                 │
│   API Routes (/api/*)                                        │
└───────────────────┬─────────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────────┐
│                    Service Layer                              │
│                                                              │
│   issueService  │  projectService  │  attachmentService      │
│   commentService│  labelService    │  statusHistoryService   │
└───────────────────┬─────────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────────┐
│                    Data Access Layer                          │
│                                                              │
│   Prisma Client (type-safe ORM)                              │
│   SQLite (MVP) → PostgreSQL/Supabase (future)                │
└─────────────────────────────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────────┐
│                    File System                                │
│                                                              │
│   /public/uploads  (local attachment storage, MVP)           │
│   → S3 / Cloudflare R2 / Supabase Storage (future)          │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Component Architecture

### 4.1 Rendering Strategy

| Layer | Strategy | Rationale |
|-------|----------|-----------|
| Dashboard, lists, detail pages | React Server Components (RSC) | Data fetched server-side; no client bundle for initial render |
| Interactive forms, drag-and-drop, modals | Client Components (`"use client"`) | Requires browser APIs and stateful interaction |
| Mutations (create, update, delete) | Server Actions | Simplifies form handling; reduces API boilerplate |
| Complex async queries | Route Handlers (`/api/`) | Reusable by future mobile clients or integrations |

### 4.2 Key Component Groups

```
UI Primitives         → shadcn/ui components (Button, Card, Badge, Dialog, etc.)
Layout Components     → AppShell, Sidebar, Header, PageContainer
Feature Components    → IssueCard, IssueDetail, IssueForm, IssueList
Domain Components     → SeverityBadge, PriorityIndicator, StatusTimeline, AIIssueTag
Evidence Components   → DropZone, AttachmentCard, LinkAttachment, TextNoteEditor
Filter Components     → FilterBar, SearchInput, SortDropdown, LabelFilter
```

### 4.3 State Management

- **Server state:** React Server Components + Prisma queries (primary pattern)
- **Client state:** React `useState` / `useReducer` for local UI state (modals, form state)
- **URL state:** `useSearchParams` for filters, pagination, and search — enables shareable URLs
- **Form state:** React Hook Form (with Zod validation) for create/edit forms
- **No global client state manager (Redux, Zustand) required for MVP** — RSC patterns eliminate most client state needs

---

## 5. Data Model Overview

### 5.1 Core Entities

```
Workspace           (future multi-tenancy anchor)
  └── Project
        └── Issue
              ├── Comment[]
              ├── Attachment[]
              ├── Label[]       (many-to-many)
              ├── StatusHistory[]
              └── User (assignee, reporter — future)
```

### 5.2 Supporting Entities

| Entity | Purpose | MVP | Future |
|--------|---------|-----|--------|
| Workspace | Tenant boundary | Seeded single record | Multi-tenant |
| Project | Logical grouping of issues | Full | Permissions per project |
| Issue | Core bug/defect record | Full | AI metadata fields |
| Comment | Discussion thread on issue | Full | Reactions, mentions |
| Attachment | Evidence files, links, notes | Full | Cloud storage migration |
| Label | Classification tags | Full | Color, icon customization |
| StatusHistory | Audit trail of status changes | Full | Full activity log |
| User | Actor in the system | Seeded demo only | Auth, roles, org membership |
| Environment | Test environment context | Seeded only | Full CRUD |
| TestSession | Grouping of related issues | Schema only | Full |
| EvidenceMetadata | Structured AI evidence | Schema only | Full |
| ReproductionTemplate | Step templates for issue types | Schema only | Full |

---

## 6. Database Schema Concepts

### 6.1 Prisma Schema Design Principles

- All primary keys use `cuid()` string IDs (portable, URL-safe, avoids sequential ID leaking)
- All tables include `createdAt` and `updatedAt` timestamps
- Soft deletes are preferred for Issues and Projects (`deletedAt` nullable DateTime)
- The `Workspace` model serves as the multi-tenancy root (single seeded record for MVP)
- Enum types used for: `IssueStatus`, `Severity`, `Priority`, `IssueType`, `AttachmentType`

### 6.2 Key Schema Entities

```prisma
// Tenant anchor
model Workspace {
  id        String    @id @default(cuid())
  name      String
  slug      String    @unique
  projects  Project[]
  users     User[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Project {
  id          String   @id @default(cuid())
  workspaceId String
  name        String
  slug        String
  description String?
  issues      Issue[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?
}

model Issue {
  id            String        @id @default(cuid())
  projectId     String
  title         String
  description   String?
  issueType     IssueType     @default(BUG)      // BUG | AI_ISSUE
  status        IssueStatus   @default(NEW)
  severity      Severity      @default(MEDIUM)
  priority      Priority      @default(MEDIUM)
  assigneeId    String?
  reporterId    String?
  environment   String?
  stepsToReproduce String?
  expectedResult   String?
  actualResult     String?
  aiIssueCategory  AIIssueCategory?  // HALLUCINATION | PROMPT_INJECTION | etc.
  comments      Comment[]
  attachments   Attachment[]
  labels        LabelOnIssue[]
  statusHistory StatusHistory[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  deletedAt     DateTime?
}

model Comment {
  id        String   @id @default(cuid())
  issueId   String
  authorId  String?
  body      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Attachment {
  id             String         @id @default(cuid())
  issueId        String
  type           AttachmentType // FILE | LINK | TEXT_NOTE
  filename       String?
  url            String?
  storagePath    String?
  mimeType       String?
  sizeBytes      Int?
  textContent    String?
  createdAt      DateTime       @default(now())
}

model Label {
  id        String         @id @default(cuid())
  name      String
  color     String
  issues    LabelOnIssue[]
}

model LabelOnIssue {
  issueId   String
  labelId   String
  @@id([issueId, labelId])
}

model StatusHistory {
  id        String      @id @default(cuid())
  issueId   String
  fromStatus IssueStatus?
  toStatus  IssueStatus
  changedBy String?
  note      String?
  createdAt DateTime    @default(now())
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  avatarUrl String?
  role      UserRole @default(MEMBER)
  createdAt DateTime @default(now())
}
```

### 6.3 Enums

```prisma
enum IssueStatus {
  NEW
  TRIAGED
  IN_PROGRESS
  READY_FOR_RETEST
  CLOSED
  REJECTED
  DUPLICATE
}

enum Severity {
  CRITICAL
  HIGH
  MEDIUM
  LOW
  INFO
}

enum Priority {
  URGENT
  HIGH
  MEDIUM
  LOW
}

enum IssueType {
  BUG
  AI_ISSUE
}

enum AIIssueCategory {
  HALLUCINATION
  PROMPT_INJECTION
  DATA_LEAKAGE
  BIAS_OR_TOXICITY
  UNSAFE_OUTPUT
  INCONSISTENT_RESPONSE
  CONTEXT_FAILURE
  INSTRUCTION_FOLLOWING_FAILURE
  OTHER
}

enum AttachmentType {
  FILE
  LINK
  TEXT_NOTE
}

enum UserRole {
  ADMIN
  MEMBER
  VIEWER
}
```

---

## 7. API Design Overview

### 7.1 Route Handler Structure

All API routes follow REST conventions under `/api/v1/`:

```
GET    /api/v1/projects                    → list all projects
POST   /api/v1/projects                    → create project
GET    /api/v1/projects/[id]               → get project + issue summary
PUT    /api/v1/projects/[id]               → update project
DELETE /api/v1/projects/[id]               → soft delete project

GET    /api/v1/issues                      → list issues (with filters)
POST   /api/v1/issues                      → create issue
GET    /api/v1/issues/[id]                 → get issue with relations
PUT    /api/v1/issues/[id]                 → update issue
DELETE /api/v1/issues/[id]                 → soft delete issue
PATCH  /api/v1/issues/[id]/status         → update status (records history)

GET    /api/v1/issues/[id]/comments        → list comments
POST   /api/v1/issues/[id]/comments        → add comment

GET    /api/v1/issues/[id]/attachments     → list attachments
POST   /api/v1/issues/[id]/attachments     → add attachment (multipart)
DELETE /api/v1/attachments/[id]            → delete attachment

GET    /api/v1/labels                      → list labels
POST   /api/v1/labels                      → create label

GET    /api/v1/issues/[id]/history         → get status history
```

### 7.2 Query Parameters (Issue List)

```
GET /api/v1/issues?projectId=&status=&severity=&priority=&issueType=&labelId=&search=&page=&limit=&sortBy=&sortDir=
```

### 7.3 Response Format

All responses use a consistent envelope:

```typescript
// Success
{ data: T, meta?: PaginationMeta }

// Error
{ error: { code: string, message: string, details?: unknown } }
```

### 7.4 Server Actions

Server Actions are used for all form submissions from React components:

```
createIssueAction(formData)
updateIssueAction(id, formData)
deleteIssueAction(id)
updateIssueStatusAction(id, newStatus, note?)
addCommentAction(issueId, body)
uploadAttachmentAction(issueId, formData)
addLinkAction(issueId, url, title?)
addTextNoteAction(issueId, content)
```

---

## 8. UI Architecture

### 8.1 Page Structure (App Router)

```
app/
├── layout.tsx                  (root layout: fonts, theme provider, toasts)
├── page.tsx                    (redirect to /dashboard)
├── dashboard/
│   └── page.tsx                (summary stats, recent issues, project cards)
├── projects/
│   ├── page.tsx                (project list)
│   ├── new/page.tsx            (create project)
│   └── [projectId]/
│       ├── page.tsx            (project overview + issue list)
│       └── settings/page.tsx   (project settings)
├── issues/
│   ├── page.tsx                (global issue list with full filters)
│   ├── new/page.tsx            (create issue form)
│   └── [issueId]/
│       ├── page.tsx            (issue detail)
│       └── edit/page.tsx       (edit issue form)
└── settings/
    └── page.tsx                (workspace settings, seed data, labels)
```

### 8.2 Theme and Styling

- **Tailwind CSS** for all utility styling
- **shadcn/ui** for all interactive components (Dialog, Button, Select, Badge, etc.)
- **CSS variables** for theming (light/dark mode via `next-themes`)
- **Dark mode** supported from day one
- Design language: clean whites/grays, accent color configurable, minimal shadows

### 8.3 Layout Components

- `AppShell` — wraps sidebar + main content area
- `Sidebar` — navigation: Dashboard, Projects, All Issues, Settings
- `Header` — breadcrumbs, search bar, create button
- `PageContainer` — max-width wrapper with consistent padding

---

## 9. File Storage Strategy

### 9.1 MVP (Local Storage)

- Uploaded files saved to `/public/uploads/[issueId]/[uuid]-[filename]`
- File path stored in `Attachment.storagePath`
- Public URL constructed as `/uploads/[issueId]/[filename]`
- Max file size enforced in API route (default: 10MB)
- Accepted MIME types: images, PDFs, plain text, JSON, CSV, video (configurable)

### 9.2 Future (Cloud Storage)

The `attachmentService` abstracts storage behind an interface:

```typescript
interface StorageProvider {
  upload(file: File, path: string): Promise<{ url: string; storagePath: string }>
  delete(storagePath: string): Promise<void>
  getSignedUrl(storagePath: string): Promise<string>
}
```

Concrete implementations:
- `LocalStorageProvider` (MVP)
- `S3StorageProvider` (future)
- `R2StorageProvider` (future)
- `SupabaseStorageProvider` (future)

---

## 10. Scalability Considerations

| Concern | MVP Approach | Future Approach |
|---------|-------------|-----------------|
| Database | SQLite via Prisma | PostgreSQL / Supabase (same Prisma schema, update provider) |
| File storage | Local filesystem | Cloud object storage (S3, R2, Supabase) |
| Authentication | None (seeded users) | NextAuth.js or Clerk |
| Multi-tenancy | Single seeded workspace | Workspace model already in schema; add RLS at DB layer |
| Search | Prisma `contains` filter | Full-text search (Postgres FTS, Meilisearch, Algolia) |
| Background jobs | None | Queue (BullMQ, Inngest) for AI processing, notifications |
| Caching | None | React cache(), Next.js unstable_cache, Redis |
| Rate limiting | None | Middleware-based rate limiting (Upstash) |

---

## 11. Security Considerations

### 11.1 MVP (No Auth)

- No sensitive user data stored
- Runs on localhost; not exposed to internet in MVP
- File upload validation: MIME type checking, file size limits, filename sanitization
- No execution of uploaded files
- SQL injection: not possible via Prisma parameterized queries

### 11.2 Future (With Auth)

- Authentication via NextAuth.js or Clerk (JWT/session-based)
- CSRF protection via Next.js built-in (Server Actions include CSRF token by default)
- Row-level security at database layer for multi-tenant data isolation
- Role-based access control (RBAC): Admin, Member, Viewer
- API routes protected via middleware session validation
- Attachment URLs protected: signed URLs or session-gated endpoints
- Secrets in environment variables (never committed)
- Content Security Policy (CSP) headers via Next.js middleware

---

## 12. Future Extensibility Points

### 12.1 AI Integration Layer

The architecture supports a future `aiService` that can:

- Analyze issue descriptions and suggest severity/priority
- Generate structured bug titles from freeform text
- Detect duplicate issues via embedding similarity
- Auto-categorize AI-specific issue types
- Summarize long comment threads

Entry points are stubbed in the service layer with `TODO: AI` comments.

### 12.2 Integration Adapters

A future `integrations/` module supports:

```
integrations/
├── github/      (sync issues to/from GitHub Issues)
├── jira/        (bidirectional sync)
├── slack/       (notifications on status change)
├── discord/     (webhook alerts)
└── promptfoo/   (import AI evaluation failures as issues)
```

### 12.3 Webhook System

Future outbound webhooks notify external systems on issue events:
- `issue.created`
- `issue.status_changed`
- `issue.comment_added`
- `issue.closed`

### 12.4 Plugin / Extension Points

- Custom fields per project (key-value metadata on Issues)
- Custom status workflows per project (beyond the default 6-stage lifecycle)
- Custom AI issue categories
- Reproduction step templates per issue type

---

## 13. Environment Configuration

```env
# .env.local (MVP)
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
UPLOAD_DIR="./public/uploads"
MAX_UPLOAD_SIZE_MB=10

# Future
NEXTAUTH_SECRET=""
NEXTAUTH_URL=""
POSTGRES_URL=""
S3_BUCKET=""
S3_REGION=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
```

---

## 14. Development and Deployment

### 14.1 Local Development

```bash
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

### 14.2 Vercel Deployment

- SQLite is not supported on Vercel's serverless functions (stateless filesystem)
- For Vercel deployment: migrate database to PostgreSQL (Neon, Supabase, or Railway)
- Update `DATABASE_URL` to postgres connection string
- File uploads: migrate to cloud storage (Vercel Blob, S3, or R2)
- All other application code remains unchanged (Prisma handles dialect differences)

### 14.3 Testing Strategy

- **Unit tests:** Vitest for service layer functions
- **Integration tests:** Prisma + SQLite in-memory for data layer
- **Component tests:** React Testing Library for UI components
- **E2E tests:** Playwright for critical user flows (create issue, change status, add attachment)
