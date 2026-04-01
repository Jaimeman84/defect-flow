# BRD — Business Requirements Document
# Defect Flow

**Version:** 1.0
**Date:** 2026-03-13
**Status:** Draft — MVP

---

## 1. Product Vision

Defect Flow is the bug tracking tool built for the way modern QA teams actually work — fast, focused, and designed for both traditional software defects and the emerging category of AI/LLM issues.

It eliminates the configuration overhead of enterprise tools and the QA blindspots of developer-centric trackers, giving testers a clean, purpose-built environment where bugs are first-class citizens and evidence is central to every report.

**Vision statement:**
> Make quality everybody's job by giving testers a tool as fast and intuitive as the software they test — and extend that to the AI systems reshaping every product.

---

## 2. Problem Statement

Quality assurance teams are underserved by the existing bug tracking market:

**Problem 1 — Enterprise tools are built for process, not testers.**
Jira and similar platforms are designed around developer and PM workflows. QA engineers are forced to adapt to tools not built for their needs: wrong lifecycle stages, poor evidence handling, and steep configuration requirements.

**Problem 2 — Lightweight tools lack QA structure.**
GitHub Issues, Trello, and Notion are flexible but missing the structured fields QA requires: severity, priority, reproduction steps, expected vs actual results, retest status, and evidence attachments.

**Problem 3 — AI testing has no dedicated tooling.**
As AI systems proliferate, a new category of defects has emerged — hallucinations, prompt injections, bias, unsafe outputs — with no structured vocabulary or workflow in any existing tool. QA teams tracking AI issues resort to spreadsheets or awkwardly misusing label systems.

**Problem 4 — QA training lacks a realistic, accessible tool.**
Bootcamps and educational programs teaching QA don't have a modern, installable tool for teaching real workflows. Enterprise tools require cloud accounts; lightweight tools don't model real QA.

---

## 3. Product Goals

### MVP Goals

| # | Goal | Metric |
|---|------|--------|
| G1 | Enable any tester to file a structured bug in under 2 minutes | Time-to-first-issue under 2 min from app start |
| G2 | Support complete bug lifecycle from New to Closed | All 6 status stages functional with history |
| G3 | Make evidence attachment frictionless | Drag-and-drop working; attachments load on issue detail |
| G4 | Support AI issue classification | AI issue type + category selectable on create/edit |
| G5 | Zero-configuration startup | Single command to start; seed data pre-loaded |
| G6 | Filter and search issues efficiently | Filter by status, severity, priority, type, label; search by title |

### Future Goals

| # | Goal | Timeline |
|---|------|----------|
| G7 | Multi-user collaboration with auth | V2 |
| G8 | AI-assisted severity and duplicate detection | V2 |
| G9 | Integration with GitHub Issues and CI tools | V3 |
| G10 | Multi-workspace / multi-team support | V3 |
| G11 | Mobile-responsive experience for on-device testing | V2 |
| G12 | AI evaluation tool integration (Promptfoo) | V3 |

---

## 4. MVP Definition

The MVP is a fully functional, locally-run bug tracking tool with the following scope boundaries:

### In Scope

- Single workspace, no authentication
- Project management (create, view, archive)
- Issue management (create, edit, delete, view list, view detail)
- Issue fields: title, description, type, status, severity, priority, environment, steps to reproduce, expected result, actual result, AI issue category
- 6-stage issue lifecycle with status history
- Comments on issues
- Attachments: file upload (drag-and-drop), links, text notes
- Labels (create, assign to issues, filter by)
- Filter bar: status, severity, priority, issue type, label
- Search: title-based full text
- Dashboard: summary stats, recent issues, project cards
- Seeded demo data (sample project, issues, users)
- Dark/light mode
- Responsive layout

### Out of Scope (MVP)

- User authentication and login
- Email notifications
- External integrations (GitHub, Jira, Slack)
- AI-assisted features
- Multi-workspace / multi-tenant
- Custom fields
- Reporting and analytics
- API access for external clients
- Mobile app

---

## 5. Key Features

### Feature 1 — Issue Creation

Users can create a new issue from any page via a persistent "New Issue" button. The creation form includes:

- Title (required)
- Description (rich text or markdown)
- Issue type: BUG or AI_ISSUE
- AI issue category (shown when type = AI_ISSUE): Hallucination, Prompt Injection, Data Leakage, Bias/Toxicity, Unsafe Output, Inconsistent Response, Context Failure, Instruction-Following Failure, Other
- Project assignment
- Severity: Critical, High, Medium, Low, Info
- Priority: Urgent, High, Medium, Low
- Environment (free text or seeded options)
- Steps to reproduce
- Expected result
- Actual result
- Labels (multi-select from existing labels)

### Feature 2 — Issue List and Filtering

The issue list supports:

- Card and table view toggle
- Filter by: status, severity, priority, issue type, AI category, label, project
- Search by title (real-time)
- Sort by: created date, updated date, severity, priority
- Pagination or infinite scroll
- Inline status change from list view

### Feature 3 — Issue Detail

Full issue detail view includes:

- All issue fields (editable inline or via edit form)
- Status timeline (history of all status changes)
- Comment thread
- Evidence panel (attachments, links, text notes)
- Labels display and management
- Action buttons: Edit, Change Status, Delete, Add Comment, Add Evidence

### Feature 4 — Evidence Management

Evidence can be added to any issue via three methods:

1. **File upload** — drag-and-drop or browse; supports images, PDFs, logs, CSVs
2. **Link** — paste a URL with optional title (CI run links, Loom videos, documentation)
3. **Text note** — freeform text for prompts, completions, error messages, or observations

Evidence displays in a dedicated panel on the issue detail page with preview where supported (images).

### Feature 5 — Bug Lifecycle Management

Each issue progresses through a 6-stage workflow:

```
NEW → TRIAGED → IN PROGRESS → READY FOR RETEST → CLOSED
                                               → REJECTED / DUPLICATE
```

- Status changes are recorded with timestamp and optional note
- Status history is displayed as a timeline on the issue detail
- Quick status change available from list and detail views

### Feature 6 — Project Management

Projects group related issues. Each project has:

- Name, slug, description
- Issue count summary (by status)
- Issue list filtered to the project
- Settings (edit name/description, archive)

### Feature 7 — Dashboard

The dashboard provides:

- Total open issues count
- Issues by status (donut or bar chart)
- Issues by severity breakdown
- Recent issues list
- Project cards with issue counts

### Feature 8 — AI Issue Classification

When creating or editing an issue with type = AI_ISSUE, the form surfaces an additional dropdown for AI issue category. This structures AI defects using industry-standard terminology and makes them filterable and reportable separately from traditional bugs.

---

## 6. User Stories

### Project Management

```
US-01  As a tester, I want to create a project so I can group related issues together.
US-02  As a tester, I want to view all my projects in a project list.
US-03  As a tester, I want to view issues within a specific project.
US-04  As a tester, I want to archive a project when testing is complete.
```

### Issue Management

```
US-05  As a tester, I want to create a bug with title, description, severity, and priority
       so I can capture a defect quickly and completely.
US-06  As a tester, I want to select "AI Issue" as the issue type and choose an AI category
       so AI-specific defects are properly classified.
US-07  As a tester, I want to edit an issue so I can update information as it evolves.
US-08  As a tester, I want to delete an issue so I can remove false positives or test data.
US-09  As a tester, I want to view a list of all issues with filter and search
       so I can quickly find the bugs I need to work on.
US-10  As a tester, I want to view a full issue detail page
       so I can see all information, evidence, and history in one place.
```

### Lifecycle and Status

```
US-11  As a tester, I want to change the status of an issue
       so I can move it through the QA lifecycle.
US-12  As a tester, I want to add a note when changing status
       so I can explain the reason for the transition.
US-13  As a tester, I want to view the full status history of an issue
       so I can see how and when it progressed through the lifecycle.
US-14  As a tester, I want to mark an issue as REJECTED or DUPLICATE
       so I can disposition false or repeated reports.
US-15  As a developer, I want to see issues in READY FOR RETEST status
       so I know which fixes need QA verification.
```

### Evidence

```
US-16  As a tester, I want to drag and drop a screenshot onto an issue
       so I can attach visual evidence without friction.
US-17  As a tester, I want to paste a URL as a link attachment
       so I can reference CI runs, recordings, or documentation.
US-18  As a tester, I want to add a text note to an issue
       so I can capture a prompt/completion pair, error message, or observation.
US-19  As a tester, I want to view all attachments on an issue detail page
       so I can review all evidence in one place.
US-20  As a tester, I want to delete an attachment I added by mistake.
```

### Comments

```
US-21  As a tester, I want to add a comment to an issue
       so I can discuss findings or follow-up information.
US-22  As a tester, I want to view the comment thread on an issue
       so I can follow the discussion history.
```

### Filtering and Search

```
US-23  As a tester, I want to filter issues by status, severity, priority, and type
       so I can focus on the most relevant issues.
US-24  As a tester, I want to search issues by title keyword
       so I can quickly find a specific bug.
US-25  As a tester, I want to filter issues by label
       so I can group issues by feature area or test type.
```

### Labels

```
US-26  As a tester, I want to create custom labels with names and colors
       so I can classify issues beyond built-in fields.
US-27  As a tester, I want to assign multiple labels to an issue.
US-28  As a tester, I want to filter the issue list by a specific label.
```

### Dashboard

```
US-29  As a tester, I want to see a summary of open issues by status and severity on the dashboard
       so I get a quick health view of the project.
US-30  As a tester, I want to see recent issues on the dashboard
       so I can quickly navigate to active work.
```

---

## 7. Success Metrics

### Technical Metrics (MVP)

| Metric | Target |
|--------|--------|
| Time to first issue created (from app start) | < 2 minutes |
| Issue list load time | < 500ms |
| File upload success rate | 100% for valid file types under limit |
| Zero-crash rate for core flows | All happy paths pass |
| Prisma migration compatibility | Schema works on SQLite and PostgreSQL |

### Product Metrics (Post-Launch)

| Metric | Target |
|--------|--------|
| Daily active issues created per user | > 3 per session |
| Evidence attachment rate | > 60% of issues have at least one attachment |
| Lifecycle completion rate | > 70% of issues reach CLOSED or REJECTED |
| AI issue type adoption | > 20% of issues filed as AI_ISSUE in AI-team contexts |
| Returning user sessions | > 50% of users return within 7 days |

---

## 8. Constraints and Assumptions

**Constraints:**
- MVP runs on localhost only — no cloud deployment required
- No authentication — single default workspace, seeded demo users
- SQLite as database — limits concurrency but acceptable for MVP scope
- Local file storage — suitable for single-user or small team local use
- No external API dependencies — fully offline-capable

**Assumptions:**
- Users are comfortable running Node.js applications locally
- A single workspace with a single default project is sufficient for MVP validation
- File attachments will be small-to-medium sized (screenshots, logs) — not large video files
- Users understand basic QA concepts (severity, priority, bug lifecycle)

---

## 9. Future Roadmap

### V2 — Collaboration and Intelligence

- User authentication (NextAuth.js or Clerk)
- User roles: Admin, Member, Viewer
- Issue assignment to users
- Email notifications on status change and comments
- AI-assisted severity suggestion
- AI duplicate detection
- Mobile-responsive polish
- Export to CSV/PDF

### V3 — Integrations and Scale

- GitHub Issues two-way sync
- Jira integration
- Slack / Discord webhook notifications
- Promptfoo integration (import AI eval failures as issues)
- PostgreSQL / Supabase migration support
- Multi-workspace / multi-tenant mode
- Organization and team management
- Custom fields per project
- Custom lifecycle stages per project
- REST API for external clients

### V4 — Enterprise and Analytics

- SSO (SAML, OIDC)
- Audit logs
- Advanced reporting and dashboards
- SLA and time-to-resolution tracking
- Compliance features
- White-label / custom branding
- AI-generated test plans from bug patterns

---

## 10. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| SQLite concurrency limits block multi-user use | Medium | Medium | Document PostgreSQL migration path clearly; add it in V2 |
| File upload storage fills local disk | Low | Low | Enforce file size limits; document storage cleanup |
| AI issue categories become outdated | Medium | Low | Make categories configurable in V3; treat enum as extensible |
| Users expect real-time collaboration | Medium | High | Set expectations clearly; add in V2 with auth |
| Scope creep delays MVP | High | High | Lock MVP scope in this document; defer all V2 features |
