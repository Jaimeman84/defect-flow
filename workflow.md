# workflow.md — Product and Bug Lifecycle Workflows
# Defect Flow

**Version:** 1.0
**Date:** 2026-03-13
**Status:** Draft — MVP

---

## 1. Bug Reporting Workflow

### 1.1 Flow Description

The bug reporting workflow covers the steps from a tester discovering a defect to having a complete, structured issue record in the system.

```
┌─────────────────────────────────────────────────────────────────┐
│                    BUG REPORTING WORKFLOW                        │
└─────────────────────────────────────────────────────────────────┘

  Tester discovers defect or unexpected behavior
          │
          ▼
  Click "New Issue" (from any page — header button or sidebar)
          │
          ▼
  ┌─────────────────────────────────────────────────────────┐
  │                  ISSUE CREATION FORM                    │
  │                                                         │
  │  1. Select Project (required)                           │
  │  2. Enter Title (required)                              │
  │  3. Select Issue Type:                                  │
  │       ● BUG (default)                                   │
  │       ● AI_ISSUE → shows AI Category dropdown           │
  │  4. If AI_ISSUE: Select AI Category                     │
  │       (Hallucination, Prompt Injection, etc.)           │
  │  5. Enter Description (markdown supported)              │
  │  6. Enter Steps to Reproduce                            │
  │  7. Enter Expected Result                               │
  │  8. Enter Actual Result                                 │
  │  9. Select Severity (Critical/High/Medium/Low/Info)     │
  │  10. Select Priority (Urgent/High/Medium/Low)           │
  │  11. Enter Environment (optional free text)             │
  │  12. Add Labels (optional, multi-select)                │
  └─────────────────────────────────────────────────────────┘
          │
          ▼
  Submit form → Issue created with status: NEW
          │
          ▼
  ┌─────────────────────────────────────────────────────────┐
  │                  EVIDENCE ATTACHMENT                    │
  │  (on issue detail page immediately after creation)      │
  │                                                         │
  │  Option A: Drag-and-drop file into evidence panel       │
  │  Option B: Paste link (CI run, Loom, docs, etc.)        │
  │  Option C: Add text note (prompts, logs, observations)  │
  └─────────────────────────────────────────────────────────┘
          │
          ▼
  Issue is now fully documented and visible in issue list
  Status: NEW — awaiting triage
```

### 1.2 Required vs Optional Fields

| Field | Required | Notes |
|-------|----------|-------|
| Project | Yes | Select from existing projects |
| Title | Yes | Descriptive, searchable |
| Issue Type | Yes | BUG or AI_ISSUE |
| AI Category | Conditional | Required when type = AI_ISSUE |
| Severity | Yes | Default: MEDIUM |
| Priority | Yes | Default: MEDIUM |
| Description | Recommended | Markdown supported |
| Steps to Reproduce | Recommended | Numbered list |
| Expected Result | Recommended | Clear expected behavior |
| Actual Result | Recommended | What actually happened |
| Environment | Optional | e.g., "Staging v2.1", "Production" |
| Labels | Optional | Multi-select |
| Attachments | Optional | Added after creation |

---

## 2. Issue Triage Workflow

### 2.1 Flow Description

Triage is the process of reviewing newly reported issues and preparing them for developer or team action.

```
┌─────────────────────────────────────────────────────────────────┐
│                      TRIAGE WORKFLOW                            │
└─────────────────────────────────────────────────────────────────┘

  QA Lead or Senior Tester reviews NEW issues
          │
          ▼
  Open issue detail page
          │
          ▼
  ┌─────────────────────────────────────────────────────────┐
  │                   TRIAGE CHECKLIST                      │
  │                                                         │
  │  □ Title is clear and descriptive?                      │
  │  □ Steps to reproduce are complete?                     │
  │  □ Severity is correctly assigned?                      │
  │  □ Priority is appropriate for team's current sprint?   │
  │  □ Evidence is attached (screenshot, log, note)?        │
  │  □ Is this a duplicate of an existing issue?            │
  │  □ Is this actually a valid bug (vs expected behavior)? │
  └─────────────────────────────────────────────────────────┘
          │
          ├──── Duplicate found → Change status: DUPLICATE
          │                        Add comment referencing original
          │
          ├──── Not a valid bug → Change status: REJECTED
          │                        Add comment explaining reason
          │
          └──── Valid, unique issue → Change status: TRIAGED
                                       Adjust severity/priority if needed
                                       Assign labels if missing
                                       Add triage note as comment
```

### 2.2 Triage Decisions

| Decision | Action | Status Result |
|----------|--------|--------------|
| Valid, unique bug | Confirm fields, move forward | TRIAGED |
| Duplicate of existing issue | Add duplicate note, link original | DUPLICATE |
| Not a real bug (by design) | Add explanation comment | REJECTED |
| Needs more information | Add comment requesting info | Stays NEW |
| Missing evidence | Comment requesting attachment | Stays NEW |

---

## 3. Bug Lifecycle Workflow

### 3.1 The 6-Stage Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    BUG LIFECYCLE STATES                         │
└─────────────────────────────────────────────────────────────────┘

         ┌─────────┐
         │   NEW   │  ← Issue just created
         └────┬────┘
              │
              ▼
        ┌──────────┐
        │ TRIAGED  │  ← Reviewed, confirmed valid, fields set
        └────┬─────┘
             │
             ▼
       ┌─────────────┐
       │ IN PROGRESS │  ← Developer or team is actively fixing
       └──────┬──────┘
              │
              ▼
  ┌──────────────────────┐
  │  READY FOR RETEST    │  ← Fix deployed, awaiting QA verification
  └──────────┬───────────┘
             │
             ├──── Verification passes → CLOSED ✓
             │
             └──── Verification fails  → IN PROGRESS (re-opened)
                                          (status history records re-open)

  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
  At any point during triage:
       → REJECTED   (not a valid bug)
       → DUPLICATE  (already tracked elsewhere)
```

### 3.2 Allowed Status Transitions

| From | Allowed Transitions |
|------|-------------------|
| NEW | TRIAGED, REJECTED, DUPLICATE |
| TRIAGED | IN_PROGRESS, REJECTED, DUPLICATE |
| IN_PROGRESS | READY_FOR_RETEST, TRIAGED (re-scope) |
| READY_FOR_RETEST | CLOSED (pass), IN_PROGRESS (fail) |
| CLOSED | IN_PROGRESS (re-open if regression) |
| REJECTED | TRIAGED (if initially wrong) |
| DUPLICATE | TRIAGED (if original closed as different issue) |

### 3.3 Status Change Rules

- Every status change is recorded in `StatusHistory`
- The actor's name (or "System" for seeded data) is captured
- An optional note field on the transition provides context
- Status changes are displayed as a timeline on the issue detail page
- The current status is always visible in the issue list and detail header

### 3.4 Status Display Conventions

| Status | Badge Color | Icon |
|--------|-------------|------|
| NEW | Blue | ● Circle |
| TRIAGED | Purple | ◆ Diamond |
| IN_PROGRESS | Amber | ▶ Arrow |
| READY_FOR_RETEST | Teal | ↺ Refresh |
| CLOSED | Green | ✓ Check |
| REJECTED | Gray | ✕ Cross |
| DUPLICATE | Gray | ⧉ Duplicate |

---

## 4. Evidence Management Workflow

### 4.1 Adding Evidence

Evidence can be added to an issue at any point in its lifecycle. Three methods are supported:

```
┌─────────────────────────────────────────────────────────────────┐
│                   EVIDENCE METHODS                              │
└─────────────────────────────────────────────────────────────────┘

  ┌───────────────────────────────────┐
  │  METHOD 1: FILE UPLOAD            │
  │                                   │
  │  1. Tester drags file onto        │
  │     the evidence drop zone        │
  │     OR clicks "Browse files"      │
  │  2. File validated:               │
  │     - Size ≤ 10MB                 │
  │     - Allowed MIME type           │
  │  3. File saved to /uploads/       │
  │  4. Attachment record created     │
  │  5. Preview shown (if image)      │
  │                                   │
  │  Supported: PNG, JPG, GIF, WEBP,  │
  │  PDF, TXT, LOG, JSON, CSV,        │
  │  MP4 (future), WEBM (future)      │
  └───────────────────────────────────┘

  ┌───────────────────────────────────┐
  │  METHOD 2: LINK                   │
  │                                   │
  │  1. Tester clicks "Add Link"      │
  │  2. Pastes URL                    │
  │  3. Optionally adds title         │
  │  4. Link saved as attachment      │
  │     type = LINK                   │
  │  5. Displayed as clickable card   │
  │                                   │
  │  Examples: CI run URL, Loom       │
  │  video, Sentry error, Datadog     │
  │  trace, documentation page        │
  └───────────────────────────────────┘

  ┌───────────────────────────────────┐
  │  METHOD 3: TEXT NOTE              │
  │                                   │
  │  1. Tester clicks "Add Note"      │
  │  2. Types or pastes content into  │
  │     a textarea                    │
  │  3. Note saved as attachment      │
  │     type = TEXT_NOTE              │
  │  4. Displayed as formatted text   │
  │     block in evidence panel       │
  │                                   │
  │  Examples: prompt/completion      │
  │  pair, stack trace, error log,    │
  │  model response, repro command    │
  └───────────────────────────────────┘
```

### 4.2 Evidence Display

The evidence panel on the issue detail page shows all attachments organized by type:

```
EVIDENCE PANEL
├── Files (n)
│   ├── [image preview] screenshot-2026-03-13.png  [Download] [Delete]
│   └── [icon] error-log.txt  [Download] [Delete]
├── Links (n)
│   ├── [link icon] "CI Run #4521 - Failed"  https://... [Open] [Delete]
│   └── [link icon] "Loom walkthrough"  https://... [Open] [Delete]
└── Notes (n)
    ├── [note icon] "Prompt used: ..."  [Expand] [Delete]
    └── [note icon] "Stack trace from Node 18"  [Expand] [Delete]
```

### 4.3 Evidence Deletion

Any attachment can be deleted by the user who added it (MVP: any user, since no auth):
- File deletion removes both the database record and the filesystem file
- Link and text note deletion removes only the database record

---

## 5. QA Retesting Workflow

### 5.1 Retest Flow

When a bug reaches READY FOR RETEST status, a tester performs verification:

```
┌─────────────────────────────────────────────────────────────────┐
│                   QA RETEST WORKFLOW                            │
└─────────────────────────────────────────────────────────────────┘

  Issue status: READY FOR RETEST
          │
          ▼
  Tester filters issue list by status = READY FOR RETEST
          │
          ▼
  Tester opens issue detail
          │
          ▼
  Reviews original reproduction steps and evidence
          │
          ▼
  Tester performs retest in the specified environment
          │
          ├──── BUG IS FIXED ──────────────────────────────────┐
          │                                                     │
          │     Tester adds retest evidence:                    │
          │     - Screenshot of passing state                   │
          │     - Text note: "Verified fixed in v2.3.1"        │
          │     Changes status: CLOSED                          │
          │     Adds comment: "Verified on [env] [date]"        │
          │                                                     ▼
          │                                              ┌─────────┐
          │                                              │ CLOSED  │
          │                                              └─────────┘
          │
          └──── BUG STILL EXISTS ──────────────────────────────┐
                                                               │
               Tester adds new evidence:                       │
               - Screenshot of continued failure               │
               - Text note documenting what was tested         │
               Changes status: IN PROGRESS (re-open)           │
               Adds comment: "Still failing on [env]. See      │
               new screenshot. Steps to reproduce unchanged."  │
                                                               ▼
                                                       ┌─────────────┐
                                                       │ IN PROGRESS │
                                                       └─────────────┘
```

---

## 6. AI Issue Classification Workflow

### 6.1 AI Issue Filing Flow

AI issues follow the same lifecycle as traditional bugs but with an additional classification step:

```
┌─────────────────────────────────────────────────────────────────┐
│                 AI ISSUE CLASSIFICATION WORKFLOW                 │
└─────────────────────────────────────────────────────────────────┘

  AI Tester / Red Teamer discovers LLM failure
          │
          ▼
  Click "New Issue"
          │
          ▼
  Select Issue Type: AI_ISSUE
          │
          ▼
  Select AI Issue Category:

  ┌────────────────────────────────────────────────────────────┐
  │  HALLUCINATION                                              │
  │  Model generates factually incorrect or fabricated content  │
  │  Example: States a product feature that doesn't exist       │
  ├────────────────────────────────────────────────────────────┤
  │  PROMPT INJECTION                                           │
  │  User input overrides or manipulates system prompt         │
  │  Example: "Ignore previous instructions and..."            │
  ├────────────────────────────────────────────────────────────┤
  │  DATA LEAKAGE                                               │
  │  Model reveals training data, PII, or system internals     │
  │  Example: Outputs contents of system prompt when asked      │
  ├────────────────────────────────────────────────────────────┤
  │  BIAS OR TOXICITY                                           │
  │  Model produces biased, discriminatory, or toxic output    │
  │  Example: Generates stereotyped or offensive language       │
  ├────────────────────────────────────────────────────────────┤
  │  UNSAFE OUTPUT                                              │
  │  Model generates content that could cause harm             │
  │  Example: Instructions for dangerous activities            │
  ├────────────────────────────────────────────────────────────┤
  │  INCONSISTENT RESPONSE                                      │
  │  Model gives contradictory answers to equivalent questions  │
  │  Example: "Yes" then "No" to same question in same session  │
  ├────────────────────────────────────────────────────────────┤
  │  CONTEXT FAILURE                                            │
  │  Model loses or misuses context window information         │
  │  Example: Forgets earlier user instructions in conversation │
  ├────────────────────────────────────────────────────────────┤
  │  INSTRUCTION-FOLLOWING FAILURE                              │
  │  Model ignores or misinterprets explicit instructions      │
  │  Example: Asked for JSON, returns unstructured prose        │
  ├────────────────────────────────────────────────────────────┤
  │  OTHER                                                      │
  │  AI issue not fitting existing categories                   │
  └────────────────────────────────────────────────────────────┘
          │
          ▼
  Complete remaining issue fields:
  - Title: Clear description of the AI failure
  - Description: Context about the model/system under test
  - Steps to Reproduce: Include exact prompt used
  - Expected Result: What the model should have output
  - Actual Result: What the model actually output
  - Severity: Assess impact (CRITICAL for safety/security issues)
  - Priority: Based on user impact and frequency
  - Environment: Model version, temperature, system prompt version
          │
          ▼
  Submit issue → Status: NEW
          │
          ▼
  Add Evidence:
  - Text Note: Paste exact prompt + completion pair
  - Text Note: Model configuration details (version, params)
  - File: Screenshot of the failure (if UI-based)
  - Link: Link to evaluation run or Promptfoo report
          │
          ▼
  Issue enters standard lifecycle → TRIAGED → IN PROGRESS → etc.
```

### 6.2 AI Issue Severity Guide

| Category | Default Severity | Rationale |
|----------|----------------|-----------|
| Prompt Injection | CRITICAL | Security breach potential |
| Data Leakage | CRITICAL | Privacy and compliance risk |
| Unsafe Output | CRITICAL | Harm potential |
| Bias or Toxicity | HIGH | Reputational and ethical risk |
| Hallucination | HIGH–MEDIUM | Depends on domain (medical = CRITICAL) |
| Instruction-Following Failure | MEDIUM | Functional failure |
| Inconsistent Response | MEDIUM | Trust and reliability |
| Context Failure | MEDIUM | User experience degradation |

---

## 7. Issue Filtering and Search Workflow

### 7.1 Filter Flow

```
User lands on issue list (global or project-specific)
          │
          ▼
  Default view: All open issues, sorted by created date descending
          │
          ▼
  Filter Bar options:
  ┌─────────────────────────────────────────────────────────┐
  │  [Search: "title keyword..."]                           │
  │  [Status ▾] [Severity ▾] [Priority ▾]                  │
  │  [Type ▾] [AI Category ▾] [Label ▾]                    │
  │  [Sort by: Created / Updated / Severity ▾]             │
  │                                          [Clear Filters] │
  └─────────────────────────────────────────────────────────┘
          │
          ▼
  Filters applied → URL updated with query params
  (e.g., /issues?status=NEW&severity=CRITICAL&type=AI_ISSUE)
          │
          ▼
  Issue list updates in real-time / on submit
  Filter state persists in URL (shareable and bookmarkable)
```

---

## 8. Comment Workflow

```
User views issue detail page
          │
          ▼
  Scrolls to comment section below issue fields
          │
          ▼
  Clicks "Add Comment"
          │
          ▼
  Types comment in textarea
  (Markdown supported for formatting)
          │
          ▼
  Clicks "Post Comment"
          │
          ▼
  Comment appears in thread with timestamp
  All comments displayed chronologically (oldest first)
```

---

## 9. Dashboard Overview Workflow

```
User opens Defect Flow → lands on Dashboard
          │
          ▼
  Dashboard displays:
  ┌────────────────────────────────────────────────────────┐
  │  SUMMARY CARDS                                         │
  │  [Total Open: 24]  [Critical: 3]  [In Progress: 8]    │
  │  [Ready for Retest: 5]  [Closed Today: 2]             │
  ├────────────────────────────────────────────────────────┤
  │  ISSUES BY STATUS                  │  BY SEVERITY      │
  │  [Chart: donut or bar]             │  [Chart]          │
  ├────────────────────────────────────────────────────────┤
  │  PROJECTS                                              │
  │  [Project A: 12 open]  [Project B: 8 open]            │
  ├────────────────────────────────────────────────────────┤
  │  RECENT ISSUES                                         │
  │  #042 Login fails on Safari  CRITICAL  NEW   5m ago   │
  │  #041 Hallucination on FAQ   HIGH      TRIAGE 1h ago  │
  │  #040 Button misaligned      LOW       CLOSED 2h ago  │
  └────────────────────────────────────────────────────────┘
          │
          ▼
  User clicks any item to navigate to issue list or detail
```

---

## 10. Workflow State Reference Summary

```
┌────────────────────────────────────────────────────────────────┐
│                   COMPLETE WORKFLOW REFERENCE                   │
├─────────────────┬──────────────────────────────────────────────┤
│  WORKFLOW       │  ENTRY → STEPS → EXIT                         │
├─────────────────┼──────────────────────────────────────────────┤
│  Bug Reporting  │  Discovery → Form → NEW                       │
│  Triage         │  NEW → Review → TRIAGED/REJECTED/DUPLICATE    │
│  Development    │  TRIAGED → Work → READY_FOR_RETEST            │
│  Retest         │  READY_FOR_RETEST → Verify → CLOSED/PROGRESS  │
│  Evidence       │  Any status → File/Link/Note → Attached        │
│  AI Issue       │  Discovery → Type=AI → Category → Lifecycle    │
│  Comment        │  Any status → Add Note → Thread appended       │
│  Filter/Search  │  List view → Set filters → URL-persisted view  │
└─────────────────┴──────────────────────────────────────────────┘
```
