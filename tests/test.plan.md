# Defect Flow End-to-End Test Plan

## Application Overview

Defect Flow is a bug and AI issue tracking tool built with Next.js 15. It allows QA teams to create, manage, and track software defects and AI-specific issues across multiple projects. Key features include an issue lifecycle with enforced status transitions (NEW → TRIAGED → IN_PROGRESS → READY_FOR_RETEST → CLOSED/REJECTED/DUPLICATE), an evidence panel supporting file uploads, external links, and text notes, a comment thread per issue, a status history timeline, label management, and a dashboard with charts and statistics. The app runs in single-workspace mode with no authentication. Seed data includes 3 projects, 16 issues, and 9 labels.

## Test Scenarios

### 1. Dashboard

**Seed:** `tests/seed.spec.ts`

#### 1.1. Dashboard displays all stats cards with correct labels

**File:** `tests/dashboard/dashboard-stats.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/dashboard
    - expect: The page title 'Dashboard' and description 'Overview of all issues and projects' are visible
  2. Inspect the stats grid for all six cards
    - expect: Six stat cards are present: 'Open Issues', 'Critical', 'In Progress', 'Ready for Retest', 'Closed Today', and 'AI Issues'
    - expect: Each card displays a numeric value and a description subtitle

#### 1.2. Dashboard renders Issues by Status and Issues by Severity charts

**File:** `tests/dashboard/dashboard-charts.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/dashboard
    - expect: Page loads without errors
  2. Locate the 'Issues by Status' chart card
    - expect: A chart is rendered inside the 'Issues by Status' card
  3. Locate the 'Open Issues by Severity' chart card
    - expect: A chart is rendered inside the 'Open Issues by Severity' card

#### 1.3. Dashboard shows Recent Issues list with up to 8 items

**File:** `tests/dashboard/dashboard-recent-issues.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/dashboard
    - expect: Page loads successfully
  2. Locate the 'Recent Issues' card in the lower section of the page
    - expect: The Recent Issues card is visible and contains at least one issue row
  3. Count the number of issue entries displayed in the Recent Issues list
    - expect: No more than 8 issue entries are shown

#### 1.4. Dashboard shows Projects list and each card links to the project

**File:** `tests/dashboard/dashboard-projects.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/dashboard
    - expect: Page loads successfully
  2. Locate the 'Projects' section on the right side of the page
    - expect: Three project cards are visible (matching the 3 seeded projects)
  3. Click on the first project card
    - expect: The browser navigates to the project detail page at /projects/[id]

#### 1.5. Root URL redirects to /dashboard

**File:** `tests/dashboard/dashboard-redirect.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/
    - expect: The browser is automatically redirected to http://localhost:3000/dashboard

### 2. Issue List and Filtering

**Seed:** `tests/seed.spec.ts`

#### 2.1. Issues page shows all issues with default list view

**File:** `tests/issues/issue-list-default.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/issues
    - expect: The page title 'All Issues' and description 'Issues across all projects' are visible
  2. Observe the issue list in the default view
    - expect: The total count displayed matches 16 (the number of seeded issues)
    - expect: Issues are rendered as rows in list view by default
    - expect: Each row shows the issue title, status badge, severity badge, and priority indicator

#### 2.2. Issues list toggles between list and grid view

**File:** `tests/issues/issue-list-view-toggle.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/issues
    - expect: Issues are shown in list view by default
  2. Click the grid view toggle button (LayoutGrid icon) in the top-right of the issue list
    - expect: Issues are now displayed in a card grid layout with 1, 2, or 3 columns depending on viewport
  3. Click the list view toggle button (LayoutList icon)
    - expect: Issues return to the row-based list layout

#### 2.3. Filter issues by Status

**File:** `tests/issues/filter-by-status.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/issues
    - expect: All 16 issues are visible
  2. Open the 'Status' dropdown in the filter bar and select 'New'
    - expect: The URL updates to include ?status=NEW
    - expect: Only issues with status NEW are displayed in the list
    - expect: The total count reflects only NEW issues
  3. Change the Status filter to 'In Progress'
    - expect: The URL updates to include ?status=IN_PROGRESS
    - expect: Only IN_PROGRESS issues are shown
  4. Click the 'Clear' button that appears when a filter is active
    - expect: All filters are removed from the URL
    - expect: All 16 issues are shown again

#### 2.4. Filter issues by Severity

**File:** `tests/issues/filter-by-severity.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/issues
    - expect: All issues are visible
  2. Open the 'Severity' dropdown and select 'Critical'
    - expect: The URL includes ?severity=CRITICAL
    - expect: Only issues with CRITICAL severity are displayed
    - expect: Each visible issue shows a Critical severity badge
  3. Select 'All Severities' to reset the filter
    - expect: All issues are shown again and the severity param is removed from the URL

#### 2.5. Filter issues by Priority

**File:** `tests/issues/filter-by-priority.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/issues
    - expect: All issues are visible
  2. Open the 'Priority' dropdown and select 'Urgent'
    - expect: The URL includes ?priority=URGENT
    - expect: Only URGENT priority issues are shown

#### 2.6. Filter issues by Type (Bug vs AI Issue)

**File:** `tests/issues/filter-by-type.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/issues
    - expect: All 16 issues are visible
  2. Open the 'Type' dropdown and select 'AI Issue'
    - expect: The URL includes ?type=AI_ISSUE
    - expect: Only AI Issue type issues are shown
    - expect: Each visible issue displays the AI Issue icon
  3. Change the Type filter to 'Bug'
    - expect: Only BUG type issues are shown
    - expect: The URL includes ?type=BUG

#### 2.7. Filter issues by Label

**File:** `tests/issues/filter-by-label.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/issues
    - expect: All issues are visible and the Label dropdown is present
  2. Open the 'Label' dropdown and select the first available label
    - expect: The URL includes ?labelId=[id]
    - expect: Only issues tagged with that label are shown

#### 2.8. Search issues by keyword

**File:** `tests/issues/search-issues.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/issues
    - expect: All 16 issues are visible
  2. Type a keyword from a known issue title into the search input field
    - expect: The URL updates to include ?search=[keyword]
    - expect: The list is filtered to show only issues whose title or description contains the keyword
  3. Clear the search input
    - expect: All issues are shown again
  4. Type a string that does not match any issue title (e.g., 'xyznotfound999')
    - expect: The empty state UI is shown with no results

#### 2.9. Combine multiple filters simultaneously

**File:** `tests/issues/filter-combined.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/issues
    - expect: All issues are visible
  2. Select Status 'New' and Severity 'High' from the filter bar
    - expect: The URL contains both ?status=NEW and ?severity=HIGH
    - expect: Only issues that are both NEW and HIGH severity are shown
  3. Click the 'Clear' button
    - expect: All filters are removed and all issues are shown

#### 2.10. Empty state is displayed when no issues match filters

**File:** `tests/issues/filter-empty-state.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/issues?status=CLOSED&severity=INFO
    - expect: The empty state component is displayed, indicating no issues match the current filters

### 3. Create Issue

**Seed:** `tests/seed.spec.ts`

#### 3.1. Create a minimal Bug issue with required fields only

**File:** `tests/issues/create-issue-minimal.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/issues/new
    - expect: The 'New Issue' page loads with the heading 'Report a Bug'
  2. Verify the Project dropdown is pre-populated with the first project
    - expect: A project is selected in the Project field
  3. Enter 'Login button unresponsive on mobile' in the Title field
    - expect: The text is entered in the title input
  4. Leave all other fields at their defaults (Bug type, Medium severity, Medium priority) and click 'Create Issue'
    - expect: The form submits without validation errors
    - expect: The browser redirects to the new issue's detail page
    - expect: The issue detail page shows title 'Login button unresponsive on mobile', status 'New', severity 'Medium', priority 'Medium', and type 'Bug'

#### 3.2. Create a Bug issue with all optional fields populated

**File:** `tests/issues/create-issue-full.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/issues/new
    - expect: The new issue form is visible
  2. Select the second project from the Project dropdown
    - expect: The second project is selected
  3. Enter 'Checkout total calculation error' in the Title field
    - expect: Title is entered
  4. Confirm the 'Bug' type button is selected
    - expect: The Bug type button appears highlighted/active
  5. Set Severity to 'Critical' and Priority to 'Urgent' using the dropdowns
    - expect: Critical severity and Urgent priority are selected
  6. Enter 'Staging v3.0' in the Environment field
    - expect: Environment text is entered
  7. Enter 'A bug where the cart total is miscalculated when applying discount codes.' in the Description field
    - expect: Description is entered
  8. Enter '1. Add item to cart
2. Apply discount code SAVE10
3. Proceed to checkout
4. Observe the total' in Steps to Reproduce
    - expect: Steps to reproduce are entered
  9. Enter 'Total should be reduced by 10%' in Expected Result
    - expect: Expected result is entered
  10. Enter 'Total shows original price with no discount applied' in Actual Result
    - expect: Actual result is entered
  11. Click at least two label toggle buttons to select them
    - expect: Selected labels appear highlighted with their color and a checkmark
  12. Click 'Create Issue'
    - expect: The form submits successfully
    - expect: The browser navigates to the new issue detail page
    - expect: All entered fields are reflected on the detail page including the selected labels, severity Critical, priority Urgent, environment, description, steps to reproduce, expected result, and actual result

#### 3.3. Create an AI Issue with an AI Category selected

**File:** `tests/issues/create-ai-issue.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/issues/new
    - expect: The new issue form is visible
  2. Enter 'Model returns wrong factual claims about product specs' in the Title field
    - expect: Title is entered
  3. Click the 'AI Issue' type button
    - expect: The AI Issue button becomes active/highlighted
    - expect: An 'AI Issue Category' dropdown appears below the type selector
  4. Open the AI Issue Category dropdown and select 'Hallucination'
    - expect: Hallucination is selected in the AI Category field
  5. Click 'Create Issue'
    - expect: The form submits successfully
    - expect: The new issue detail page shows issue type as AI Issue
    - expect: An AI category badge displaying 'Hallucination' is visible on the detail page

#### 3.4. AI Issue creation requires an AI Category — all categories are selectable

**File:** `tests/issues/create-ai-issue-categories.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/issues/new and click the 'AI Issue' type button
    - expect: The AI Issue Category dropdown is shown
  2. Open the AI Issue Category dropdown and verify all 9 categories are listed
    - expect: The following options are present: Hallucination, Prompt Injection, Data Leakage, Bias / Toxicity, Unsafe Output, Inconsistent Response, Context Failure, Instruction-Following Failure, Other
  3. Select 'Prompt Injection' and submit the form with a title
    - expect: Issue is created and the detail page shows the Prompt Injection AI category badge

#### 3.5. Switching from AI Issue back to Bug hides the AI Category field

**File:** `tests/issues/create-issue-type-toggle.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/issues/new
    - expect: The new issue form is visible
  2. Click the 'AI Issue' type button
    - expect: The AI Issue Category dropdown appears
  3. Click the 'Bug' type button
    - expect: The AI Issue Category dropdown is hidden/removed from the form

#### 3.6. Create issue form validates that Title is required

**File:** `tests/issues/create-issue-validation-title.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/issues/new
    - expect: The new issue form is visible
  2. Leave the Title field empty and click 'Create Issue'
    - expect: The form does not submit
    - expect: A validation error message 'Title is required' appears below the Title field

#### 3.7. New Issue page links to create a project when no projects exist

**File:** `tests/issues/create-issue-no-projects.spec.ts`

**Steps:**
  1. Simulate no projects being available by navigating to http://localhost:3000/issues/new in a state where no projects exist (note: with seed data this won't apply; verify the empty-project message path via code review)
    - expect: When no projects exist, the page shows the message 'You need at least one project before creating an issue' with a 'Create a project' link pointing to /projects/new

#### 3.8. New Issue page accepts a default projectId via query parameter

**File:** `tests/issues/create-issue-default-project.spec.ts`

**Steps:**
  1. Navigate to a project detail page at /projects/[id] using one of the seeded project IDs
    - expect: The project page loads with a 'New Issue' button in the header
  2. Click the 'New Issue' button
    - expect: The browser navigates to /issues/new?projectId=[id]
    - expect: The Project dropdown on the form is pre-selected to the project that was viewed

### 4. Issue Detail

**Seed:** `tests/seed.spec.ts`

#### 4.1. Issue detail page renders all metadata fields

**File:** `tests/issues/issue-detail-metadata.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/issues and click on any issue to open its detail page
    - expect: The issue detail page loads at /issues/[id]
  2. Inspect the issue header section
    - expect: The issue title is displayed as a heading
    - expect: Status badge is visible
    - expect: Severity badge with dot indicator is visible
    - expect: Priority indicator with label is visible
    - expect: Issue type icon is visible
  3. Inspect the sidebar Details card
    - expect: Project name is shown as a link to /projects/[id]
    - expect: Created relative time is displayed
    - expect: Updated relative time is displayed
  4. Inspect the Status History card in the sidebar
    - expect: At least one entry exists in the status timeline (the initial NEW status)

#### 4.2. Issue detail page shows Description, Steps to Reproduce, Expected, and Actual results when populated

**File:** `tests/issues/issue-detail-content.spec.ts`

**Steps:**
  1. Navigate to an issue that has description, steps to reproduce, expected result, and actual result populated (use a seeded issue with these fields)
    - expect: The issue detail page loads
  2. Scroll through the main content area
    - expect: A 'Description' section with the issue description text is visible
    - expect: A 'Steps to Reproduce' section with preformatted text is visible
    - expect: An 'Expected' panel with green background shows the expected result
    - expect: An 'Actual' panel with red background shows the actual result

#### 4.3. AI Issue detail page displays the AI category badge

**File:** `tests/issues/issue-detail-ai-category.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/issues and filter by Type = AI Issue
    - expect: At least one AI Issue is visible
  2. Click on an AI Issue to open its detail page
    - expect: The issue detail page loads
  3. Look for the AI category badge in the issue header area
    - expect: An AI category badge is displayed showing the specific category (e.g., Hallucination, Prompt Injection)

#### 4.4. Navigate back to project from issue detail using the back arrow

**File:** `tests/issues/issue-detail-back-navigation.spec.ts`

**Steps:**
  1. Navigate to any issue detail page at /issues/[id]
    - expect: The issue detail page loads
  2. Click the back arrow button (ArrowLeft icon) in the page header
    - expect: The browser navigates to the project detail page /projects/[projectId] that the issue belongs to

#### 4.5. Accessing a non-existent issue ID returns a 404 page

**File:** `tests/issues/issue-detail-404.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/issues/nonexistent-id-abc123
    - expect: A Next.js 404 not found page is displayed

### 5. Issue Status Lifecycle

**Seed:** `tests/seed.spec.ts`

#### 5.1. Change status from NEW to TRIAGED via the status dialog

**File:** `tests/issues/status-new-to-triaged.spec.ts`

**Steps:**
  1. Navigate to the detail page of an issue with status NEW
    - expect: The issue detail page loads and the status button shows 'New'
  2. Click the status button (which shows the current status badge with a dropdown arrow)
    - expect: The 'Change Status' dialog opens, showing the current status 'New' and available transitions in a grid
  3. Verify the available target statuses shown in the dialog
    - expect: Exactly three options are available: Triaged, Rejected, Duplicate (matching the NEW transitions)
  4. Click 'Triaged' in the transition grid
    - expect: The Triaged option becomes selected/highlighted
  5. Enter 'Confirmed by lead QA' in the optional Note textarea
    - expect: The note text is entered
  6. Click 'Update Status'
    - expect: The dialog closes
    - expect: A success toast notification 'Status updated' appears
    - expect: The status button on the issue detail page now shows 'Triaged'
    - expect: The Status History timeline in the sidebar shows a new entry from New to Triaged with the note 'Confirmed by lead QA'

#### 5.2. Complete the full happy-path lifecycle: NEW → TRIAGED → IN_PROGRESS → READY_FOR_RETEST → CLOSED

**File:** `tests/issues/status-full-lifecycle.spec.ts`

**Steps:**
  1. Create a new issue and navigate to its detail page (status should be NEW)
    - expect: Issue detail page shows status 'New'
  2. Open the status dialog and transition to 'Triaged'
    - expect: Status changes to Triaged and the status button updates
  3. Open the status dialog and transition to 'In Progress'
    - expect: Status changes to In Progress
  4. Open the status dialog and transition to 'Ready for Retest'
    - expect: Status changes to Ready for Retest
  5. Open the status dialog and transition to 'Closed'
    - expect: Status changes to Closed
    - expect: The status button is disabled (no further forward transitions exist from CLOSED except reopening to IN_PROGRESS)
    - expect: The Status History timeline shows all 5 transition entries in chronological order

#### 5.3. Status transitions from CLOSED only allow reopening to IN_PROGRESS

**File:** `tests/issues/status-closed-transitions.spec.ts`

**Steps:**
  1. Navigate to the detail page of a CLOSED issue
    - expect: The issue detail page loads and status shows 'Closed'
  2. Click the status button to open the Change Status dialog
    - expect: The dialog opens and shows exactly one available transition: 'In Progress'

#### 5.4. REJECTED status only allows transition back to TRIAGED

**File:** `tests/issues/status-rejected-transitions.spec.ts`

**Steps:**
  1. Navigate to the detail page of a NEW issue and transition it to REJECTED via the status dialog
    - expect: Status changes to Rejected
  2. Click the status button again to open the Change Status dialog
    - expect: Only 'Triaged' is available as a transition option from Rejected

#### 5.5. DUPLICATE status only allows transition back to TRIAGED

**File:** `tests/issues/status-duplicate-transitions.spec.ts`

**Steps:**
  1. Navigate to the detail page of a NEW issue and transition it to DUPLICATE via the status dialog
    - expect: Status changes to Duplicate
  2. Click the status button again
    - expect: Only 'Triaged' is available as a transition option from Duplicate

#### 5.6. Status dialog 'Update Status' button is disabled when no target status is selected

**File:** `tests/issues/status-dialog-no-selection.spec.ts`

**Steps:**
  1. Navigate to the detail page of a NEW issue and click the status button to open the dialog
    - expect: The Change Status dialog opens with no status pre-selected
  2. Observe the 'Update Status' button without selecting a target status
    - expect: The 'Update Status' button is disabled
  3. Click 'Cancel'
    - expect: The dialog closes and the issue status remains unchanged

#### 5.7. Status change dialog is disabled when no transitions are available

**File:** `tests/issues/status-dialog-no-transitions.spec.ts`

**Steps:**
  1. Navigate to an issue that has no allowed transitions (note: per the constants, all statuses have at least one transition; this test verifies the button renders as disabled only if allowed array is empty, which would be a future state)
    - expect: If an issue has zero allowed transitions, the status button (with ChevronDown) is rendered as disabled and cannot be clicked

#### 5.8. Status change is recorded in the Status History timeline

**File:** `tests/issues/status-history-timeline.spec.ts`

**Steps:**
  1. Navigate to the detail page of a NEW issue
    - expect: The Status History card in the sidebar shows one entry (New)
  2. Change the status to Triaged
    - expect: The Status History timeline updates and now shows two entries
  3. Change the status to In Progress with the note 'Starting sprint 14'
    - expect: The Status History timeline shows three entries
    - expect: The latest entry shows 'In Progress' and includes the note 'Starting sprint 14'

### 6. Edit Issue

**Seed:** `tests/seed.spec.ts`

#### 6.1. Edit issue — update title and description

**File:** `tests/issues/edit-issue-basic.spec.ts`

**Steps:**
  1. Navigate to any issue detail page and click the 'Edit' button
    - expect: The browser navigates to /issues/[id]/edit with the heading 'Edit Issue'
  2. Clear the Title field and enter 'Updated: Login button unresponsive on mobile v2'
    - expect: New title text is entered in the field
  3. Update the Description field with new text
    - expect: Description is updated
  4. Click 'Save Changes'
    - expect: The form submits without errors
    - expect: The browser redirects back to the issue detail page
    - expect: The updated title and description are reflected on the detail page

#### 6.2. Edit issue — change severity, priority, and labels

**File:** `tests/issues/edit-issue-fields.spec.ts`

**Steps:**
  1. Navigate to /issues/[id]/edit for any seeded issue
    - expect: Edit form is loaded with current issue values pre-filled
  2. Change the Severity dropdown from its current value to 'Critical'
    - expect: Critical is selected
  3. Change the Priority dropdown to 'Urgent'
    - expect: Urgent is selected
  4. Toggle two label buttons to change label selection
    - expect: Label selection state toggles (selected labels show checkmarks)
  5. Click 'Save Changes'
    - expect: Changes are saved and the detail page reflects Critical severity, Urgent priority, and the updated labels

#### 6.3. Edit issue — Project dropdown is not shown in edit mode

**File:** `tests/issues/edit-issue-no-project-field.spec.ts`

**Steps:**
  1. Navigate to /issues/[id]/edit for any issue
    - expect: The edit form is displayed
  2. Check whether a 'Project' dropdown is present in the form
    - expect: The Project selection field is NOT visible in the edit form (project cannot be changed after creation)

#### 6.4. Edit issue — Cancel button returns to previous page

**File:** `tests/issues/edit-issue-cancel.spec.ts`

**Steps:**
  1. Navigate to /issues/[id]/edit for any issue
    - expect: The edit form is visible
  2. Make changes to the Title field
    - expect: Title field shows the modified text
  3. Click 'Cancel'
    - expect: The browser navigates back to the previous page (the issue detail page) without saving changes

#### 6.5. Edit issue — accessing non-existent issue ID returns 404

**File:** `tests/issues/edit-issue-404.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/issues/nonexistent-abc/edit
    - expect: A 404 not found page is displayed

### 7. Delete Issue

**Seed:** `tests/seed.spec.ts`

#### 7.1. Delete an issue after confirming the browser dialog

**File:** `tests/issues/delete-issue-confirm.spec.ts`

**Steps:**
  1. Create a new test issue and navigate to its detail page
    - expect: The issue detail page is visible with the delete (trash) icon button in the header
  2. Click the delete (Trash2 icon) button
    - expect: A browser confirm dialog appears with the message 'Delete this issue? This cannot be undone.'
  3. Accept/confirm the dialog
    - expect: The dialog closes
    - expect: The browser navigates away from the issue page (likely to the project page)
    - expect: The deleted issue no longer appears in the issue list

#### 7.2. Cancel issue deletion when dismissing the confirm dialog

**File:** `tests/issues/delete-issue-cancel.spec.ts`

**Steps:**
  1. Navigate to any issue detail page
    - expect: The issue detail page is visible
  2. Click the delete (Trash2 icon) button
    - expect: A browser confirm dialog appears
  3. Dismiss/cancel the dialog
    - expect: The dialog is dismissed
    - expect: The browser remains on the issue detail page
    - expect: The issue still exists and is unmodified

### 8. Evidence Panel

**Seed:** `tests/seed.spec.ts`

#### 8.1. Evidence panel shows empty state with action buttons when no evidence is attached

**File:** `tests/evidence/evidence-panel-empty.spec.ts`

**Steps:**
  1. Navigate to the detail page of an issue that has no attachments
    - expect: The Evidence section is visible below the issue content
  2. Observe the Evidence panel
    - expect: Three buttons are visible: 'File', 'Link', and 'Note'
    - expect: The empty state message 'No evidence attached. Add files, links, or notes above.' is displayed

#### 8.2. Add a link as evidence

**File:** `tests/evidence/evidence-add-link.spec.ts`

**Steps:**
  1. Navigate to the detail page of any issue
    - expect: The Evidence section is visible
  2. Click the 'Link' button in the evidence panel
    - expect: A form appears with a URL input field and an optional Title input field
  3. Enter 'https://github.com/example/repo/issues/42' in the URL field
    - expect: URL is entered
  4. Enter 'GitHub Issue #42' in the Title field
    - expect: Title is entered
  5. Click 'Add Link'
    - expect: A success toast 'Link added' appears
    - expect: The link form is dismissed
    - expect: A 'Links (1)' section appears in the evidence panel showing the link with title 'GitHub Issue #42' and URL
    - expect: An external link icon button is present to open the link

#### 8.3. Add a link fails validation when URL format is invalid

**File:** `tests/evidence/evidence-link-invalid-url.spec.ts`

**Steps:**
  1. Navigate to any issue detail page and click the 'Link' button
    - expect: The link form appears
  2. Enter 'not-a-valid-url' in the URL field and click 'Add Link'
    - expect: The form does not submit and shows a validation error or the browser's native URL input validation prevents submission

#### 8.4. Add a text note as evidence

**File:** `tests/evidence/evidence-add-note.spec.ts`

**Steps:**
  1. Navigate to the detail page of any issue
    - expect: The Evidence section is visible
  2. Click the 'Note' button in the evidence panel
    - expect: A form appears with a Title input and a Textarea for content
  3. Enter 'Reproduction trace log' in the Title field
    - expect: Title is entered
  4. Enter 'ERROR: NullPointerException at checkout.js:142
Stack trace: ...' in the content textarea
    - expect: Content is entered in monospace font textarea
  5. Click 'Add Note'
    - expect: A success toast 'Note added' appears
    - expect: The note form is dismissed
    - expect: A 'Notes (1)' section appears in the evidence panel showing a row with the title 'Reproduction trace log'
    - expect: The content is collapsed by default (expand/collapse toggle button is present)

#### 8.5. Text note expand and collapse toggle

**File:** `tests/evidence/evidence-note-toggle.spec.ts`

**Steps:**
  1. Navigate to an issue that has at least one text note in the evidence panel
    - expect: The Notes section is visible with the note title row and a collapse/expand chevron button
  2. Click the chevron (ChevronDown) button next to the note
    - expect: The note content is expanded and the full text is visible in a monospace pre block
  3. Click the chevron (ChevronUp) button again
    - expect: The note content collapses and is no longer visible

#### 8.6. Add a file via the file drop zone

**File:** `tests/evidence/evidence-add-file.spec.ts`

**Steps:**
  1. Navigate to the detail page of any issue
    - expect: The Evidence section is visible
  2. Click the 'File' button in the evidence panel
    - expect: A drag-and-drop zone appears with text 'Drop file or click to upload' and accepts PNG, JPG, PDF, TXT, JSON up to 10MB
  3. Click the drop zone to open the file chooser and select a small PNG or TXT test file
    - expect: A loading spinner appears while the file uploads
    - expect: After upload, a success toast 'File uploaded [filename]' appears
    - expect: A 'Files (1)' section appears in the evidence panel listing the uploaded file with name, size, and relative upload time

#### 8.7. Delete a link from the evidence panel

**File:** `tests/evidence/evidence-delete-link.spec.ts`

**Steps:**
  1. Navigate to an issue that has at least one link in its evidence panel
    - expect: The Links section shows one or more link entries
  2. Click the trash icon button next to a link entry
    - expect: A success toast 'Attachment deleted' appears
    - expect: The deleted link entry is removed from the evidence panel
    - expect: If it was the last link, the Links section disappears

#### 8.8. Delete a text note from the evidence panel

**File:** `tests/evidence/evidence-delete-note.spec.ts`

**Steps:**
  1. Navigate to an issue that has at least one text note in its evidence panel
    - expect: The Notes section shows one or more note entries
  2. Click the trash icon button next to a note
    - expect: A success toast 'Attachment deleted' appears
    - expect: The note is removed from the evidence list

#### 8.9. Clicking a link opens a file in a new tab

**File:** `tests/evidence/evidence-link-external.spec.ts`

**Steps:**
  1. Navigate to an issue that has a link attachment
    - expect: A link entry is visible in the evidence panel
  2. Click the external link icon (ExternalLink) button next to the link entry
    - expect: The link opens in a new browser tab

#### 8.10. Toggle Link and Note add forms off by clicking the active button again

**File:** `tests/evidence/evidence-toggle-forms.spec.ts`

**Steps:**
  1. Navigate to any issue detail page and click the 'Link' button
    - expect: The link form appears below the buttons
  2. Click the 'Link' button again
    - expect: The link form is dismissed/hidden
  3. Click the 'Note' button
    - expect: The note form appears
  4. Click the 'Link' button while the note form is open
    - expect: The note form is replaced by the link form (only one add form is shown at a time)

### 9. Comments

**Seed:** `tests/seed.spec.ts`

#### 9.1. Add a comment to an issue

**File:** `tests/comments/add-comment.spec.ts`

**Steps:**
  1. Navigate to any issue detail page
    - expect: The Comments section is visible at the bottom of the main content area with an empty textarea and a 'Post Comment' button
  2. Click inside the comment textarea and type 'This bug has been reproduced on all iOS 17 devices.'
    - expect: The text appears in the textarea
  3. Click 'Post Comment'
    - expect: A success toast 'Comment added' appears
    - expect: The textarea is cleared
    - expect: The new comment appears in the comment list above the form with author name 'QA Tester', the comment body text, and a formatted timestamp

#### 9.2. Post Comment button is disabled when the textarea is empty

**File:** `tests/comments/comment-button-disabled.spec.ts`

**Steps:**
  1. Navigate to any issue detail page
    - expect: The comment form is visible
  2. Observe the 'Post Comment' button with the textarea empty
    - expect: The 'Post Comment' button is disabled
  3. Type whitespace-only text (e.g., spaces) into the textarea
    - expect: The 'Post Comment' button remains disabled (whitespace-only input is treated as empty)
  4. Type actual text content
    - expect: The 'Post Comment' button becomes enabled

#### 9.3. Comments section title shows count when comments exist

**File:** `tests/comments/comment-count.spec.ts`

**Steps:**
  1. Navigate to an issue that already has one or more comments
    - expect: The Comments section heading shows 'Comments (N)' where N is the number of existing comments
  2. Add a new comment to the issue
    - expect: The comment count in the heading increments by 1 after the page refreshes/updates

#### 9.4. Comment shows author initials avatar and formatted timestamp

**File:** `tests/comments/comment-display.spec.ts`

**Steps:**
  1. Navigate to an issue that has at least one comment
    - expect: Each comment displays a circular avatar with the author's initials (e.g., 'QT' for 'QA Tester')
    - expect: Author name is shown in bold
    - expect: A formatted date-time string is shown next to the author name
    - expect: The comment body text is displayed below

### 10. Projects

**Seed:** `tests/seed.spec.ts`

#### 10.1. Projects page displays all seeded projects

**File:** `tests/projects/project-list.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/projects
    - expect: The Projects page loads
  2. Count the project cards displayed
    - expect: Three project cards are displayed (matching the 3 seeded projects)

#### 10.2. Create a new project with name and color

**File:** `tests/projects/create-project.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/projects/new
    - expect: The 'New Project' page loads with the heading 'Create Project'
  2. Enter 'Mobile QA Sprint 5' in the Project Name field
    - expect: Name is entered
  3. Enter 'Testing mobile app features for sprint 5' in the Description field
    - expect: Description is entered
  4. Click one of the color swatches to select a project color
    - expect: The selected color swatch shows a ring/focus indicator indicating it is selected
  5. Click 'Create Project'
    - expect: The form submits without errors
    - expect: The browser navigates to the new project's detail page
    - expect: The project header shows 'Mobile QA Sprint 5' with its description
    - expect: The issue list is empty with the empty state shown

#### 10.3. Create project validates that Name is required

**File:** `tests/projects/create-project-validation.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/projects/new
    - expect: The project form is visible
  2. Leave the Project Name field empty and click 'Create Project'
    - expect: The form does not submit
    - expect: A validation error 'Name is required' appears below the name field

#### 10.4. Project detail page shows issues for that project only

**File:** `tests/projects/project-detail-issues.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/projects and click on the first project card
    - expect: The project detail page loads at /projects/[id]
  2. Observe the issue list on the project page
    - expect: Only issues belonging to this specific project are shown
    - expect: The total count matches the number of issues for this project
    - expect: Issues from other projects are not included

#### 10.5. Project detail page filter bar scopes filtering to that project

**File:** `tests/projects/project-detail-filter.spec.ts`

**Steps:**
  1. Navigate to a project detail page
    - expect: The project page loads with its issues
  2. Select 'New' from the Status filter dropdown
    - expect: The URL updates with ?status=NEW
    - expect: Only NEW status issues from this project are shown (not from other projects)

#### 10.6. Project settings page allows editing project name, description, and color

**File:** `tests/projects/project-settings-edit.spec.ts`

**Steps:**
  1. Navigate to a project detail page and click the Settings gear icon button in the header
    - expect: The browser navigates to /projects/[id]/settings with the heading '[ProjectName] · Settings'
  2. Update the Project Name field to a new name
    - expect: New name is entered
  3. Update the Description field
    - expect: New description is entered
  4. Select a different color swatch
    - expect: New color swatch is highlighted
  5. Click 'Save Changes'
    - expect: The form submits without errors
    - expect: The project is updated with the new name, description, and color

#### 10.7. Archive a project from the project settings Danger Zone

**File:** `tests/projects/project-archive.spec.ts`

**Steps:**
  1. Create a new project and navigate to its settings page at /projects/[id]/settings
    - expect: The project settings page shows the Danger Zone section with an 'Archive Project' button
  2. Click the 'Archive Project' button
    - expect: The project is archived
    - expect: The archived project no longer appears in the projects list at /projects

#### 10.8. Accessing a non-existent project ID returns 404

**File:** `tests/projects/project-detail-404.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/projects/nonexistent-project-id
    - expect: A 404 not found page is displayed

#### 10.9. Project detail page has a New Issue button that pre-fills the project

**File:** `tests/projects/project-detail-new-issue.spec.ts`

**Steps:**
  1. Navigate to any project detail page
    - expect: A 'New Issue' button is visible in the page header
  2. Click 'New Issue'
    - expect: Browser navigates to /issues/new?projectId=[id]
    - expect: The Project dropdown in the new issue form is pre-selected to the current project

### 11. Settings — Labels

**Seed:** `tests/seed.spec.ts`

#### 11.1. Settings page shows existing labels and create label form

**File:** `tests/settings/settings-labels-list.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/settings
    - expect: The Settings page loads with title 'Settings' and description 'Manage labels and workspace preferences'
  2. Observe the Labels section
    - expect: A label creation form with a name input and color swatches is visible
    - expect: Existing labels are listed below the form (9 seeded labels should be present)
    - expect: Each label row shows a color dot, a colored badge with the label name, and Edit/Delete action buttons

#### 11.2. Create a new label

**File:** `tests/settings/settings-create-label.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/settings
    - expect: The Labels section is visible
  2. Enter 'Performance' in the Label Name input
    - expect: Name is entered and a live preview badge appears showing the label in the current color
  3. Click a different color swatch to change the label color
    - expect: The preview badge updates to the new color
  4. Click 'Add Label'
    - expect: A success toast 'Label created' appears
    - expect: The name input is cleared
    - expect: The new 'Performance' label appears in the label list below

#### 11.3. Create label is prevented when name is empty

**File:** `tests/settings/settings-create-label-empty.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/settings
    - expect: The label form is visible
  2. Leave the Label Name field empty and observe the 'Add Label' button
    - expect: The 'Add Label' button is disabled when the name is empty

#### 11.4. Edit an existing label

**File:** `tests/settings/settings-edit-label.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/settings
    - expect: The label list is visible with at least one label
  2. Click the edit (pencil) icon button on any label
    - expect: The label row switches to edit mode, showing a name input field pre-filled with the label's current name and color swatches for color selection
  3. Change the label name to 'Regression-Updated'
    - expect: New name is entered in the inline input
  4. Click the checkmark (save) button
    - expect: A success toast 'Label updated' appears
    - expect: The label row exits edit mode
    - expect: The label now shows the updated name 'Regression-Updated'

#### 11.5. Cancel editing a label

**File:** `tests/settings/settings-cancel-label-edit.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/settings and click the edit button on any label
    - expect: Label row is in edit mode
  2. Change the name to something else
    - expect: Name is changed in the input field
  3. Click the X (cancel) button
    - expect: The label row exits edit mode
    - expect: The original label name is restored
    - expect: No changes are saved

#### 11.6. Delete a label after confirming the browser dialog

**File:** `tests/settings/settings-delete-label.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/settings
    - expect: The label list is visible
  2. Click the trash icon button on any label
    - expect: A browser confirm dialog appears with the message 'Delete this label? It will be removed from all issues.'
  3. Accept/confirm the dialog
    - expect: A success toast 'Label deleted' appears
    - expect: The label is removed from the list

#### 11.7. Cancel label deletion when dismissing the confirm dialog

**File:** `tests/settings/settings-cancel-delete-label.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/settings and click the delete button on any label
    - expect: A browser confirm dialog appears
  2. Dismiss/cancel the dialog
    - expect: The label remains in the list unchanged

#### 11.8. Settings page shows application version and metadata in the About section

**File:** `tests/settings/settings-about.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/settings and scroll to the About section
    - expect: The About section is visible
    - expect: Version: 0.1.0 MVP is displayed
    - expect: Database: SQLite (local) is displayed
    - expect: Storage: Local filesystem is displayed
    - expect: Auth: Not enabled (single workspace mode) is displayed

### 12. Navigation and Layout

**Seed:** `tests/seed.spec.ts`

#### 12.1. Sidebar navigation links work correctly for all main pages

**File:** `tests/navigation/sidebar-links.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/dashboard
    - expect: The sidebar/navigation is visible
  2. Click the 'Dashboard' navigation link
    - expect: The browser is on /dashboard
  3. Click the 'Issues' navigation link
    - expect: The browser navigates to /issues and the All Issues page loads
  4. Click the 'Projects' navigation link
    - expect: The browser navigates to /projects and the Projects page loads
  5. Click the 'Settings' navigation link
    - expect: The browser navigates to /settings and the Settings page loads

#### 12.2. App name 'Defect Flow' is shown in the sidebar

**File:** `tests/navigation/sidebar-branding.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/dashboard
    - expect: The app name 'Defect Flow' (or equivalent branding) is visible in the sidebar header
