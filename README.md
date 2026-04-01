# Defect Flow

A bug and AI issue tracking tool built for QA teams. Supports a 6-stage bug lifecycle, evidence management, AI issue classification, and a dashboard with charts.

## Tech Stack

- **Framework:** Next.js 15 (App Router, React Server Components, Server Actions)
- **Language:** TypeScript
- **Database:** SQLite via Prisma ORM
- **Styling:** Tailwind CSS + shadcn/ui
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod
- **Tests:** Playwright

## Getting Started

```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Windows note:** If `npm install` fails with an `EPERM` file lock error, stop any running dev server first (`Ctrl+C`), then retry.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run db:push` | Sync Prisma schema to the database |
| `npm run db:seed` | Seed the database with demo data |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
| `npm run db:reset` | Wipe and re-seed the database |

## Clearing All Data

To reset to a clean slate with demo data:

```bash
npm run db:reset
```

To wipe to a completely empty database (no seed data):

```bash
npx prisma db push --force-reset
```

> **Note:** Stop the dev server before running either command to avoid file lock errors on Windows.

## Testing

Playwright is used for end-to-end testing. The dev server must be running before you run tests.

```bash
# Run all tests
npx playwright test

# Run a specific test file
npx playwright test tests/happy-path.spec.ts

# Open the HTML report after a run
npx playwright show-report
```

The database is automatically wiped and re-seeded before every test run via `globalSetup`, so tests always start from a known state.

### Test Suites

| File | Coverage |
|---|---|
| `tests/happy-path.spec.ts` | Dashboard, issue list/filter/search, issue detail, create issue, projects |

### Adding Tests

Use the Playwright test agents built into Claude Code:

- `/playwright-test-planner` — maps user flows and generates a test plan (`tests/test.plan.md`)
- `/playwright-test-generator` — converts the plan into executable spec files
- `/playwright-test-healer` — auto-fixes broken tests after UI changes

The generator seed file is `seed.spec.ts` at the project root.

## Issue Lifecycle

Issues move through a defined set of stages with enforced transitions:

```
NEW → TRIAGED → IN_PROGRESS → READY_FOR_RETEST → CLOSED
                                                 → REJECTED
                                                 → DUPLICATE
```

## Issue Types

- **Bug** — Standard software defect
- **AI Issue** — AI-specific problems, categorised into 8 types:
  - Hallucination
  - Prompt Injection
  - Data Leakage
  - Bias or Toxicity
  - Unsafe Output
  - Inconsistent Response
  - Context Failure
  - Instruction Following Failure

## Features

- **Dashboard** — Status and severity charts, recent issues, project overview
- **Issue management** — Create, edit, filter, and search issues across projects
- **Status workflow** — Enforced transitions with notes and a full status history timeline
- **Evidence panel** — Attach files, links, and text notes to any issue
- **Labels** — Colour-coded labels per project
- **Dark mode** — Light/dark theme toggle
- **Projects** — Separate issue spaces with per-project filtering

## Project Structure

```
src/
├── app/
│   ├── (app)/           # Main app routes (dashboard, issues, projects)
│   └── actions/         # Server Actions (create/update/delete)
├── components/
│   ├── issues/          # Issue list, detail, form, badges, filters
│   ├── evidence/        # File/link/note attachment panel
│   ├── comments/        # Comment thread
│   ├── projects/        # Project form and cards
│   ├── layout/          # Sidebar, header, page container
│   └── ui/              # shadcn/ui primitives
├── services/            # Database access layer (Prisma)
├── lib/
│   ├── constants.ts     # Types, status config, transition rules
│   ├── validations/     # Zod schemas
│   └── formatters.ts    # Date and label helpers
└── types/
    └── issue.types.ts   # Typed interfaces for Prisma results
tests/
├── happy-path.spec.ts   # Happy path E2E tests
├── global-setup.ts      # Resets DB before every test run
└── test.plan.md         # Full test plan (58 scenarios across 10 suites)
```

## Seed Data

The seed script creates:
- 3 projects (ShopApp v2.1, AI Chatbot Red Team, Mobile App QA)
- 16 issues across all projects with realistic statuses
- 3 users (Alice/Admin, Bob/Member, Maya/Member)
- 9 labels

## Environment Variables

```env
DATABASE_URL="file:./dev.db"
UPLOAD_DIR="./public/uploads"
MAX_UPLOAD_SIZE_MB=10
```
