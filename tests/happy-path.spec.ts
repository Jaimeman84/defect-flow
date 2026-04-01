import { test, expect } from "@playwright/test";

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
test.describe("Dashboard", () => {
  test("loads with stats and charts", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByText("Open Issues").first()).toBeVisible();
    await expect(page.getByText("In Progress").first()).toBeVisible();
    await expect(page.getByText("AI Issues").first()).toBeVisible();
    await expect(page.getByText("Issues by Status")).toBeVisible();
    await expect(page.getByText("Open Issues by Severity")).toBeVisible();
    await expect(page.getByText("Recent Issues")).toBeVisible();
  });

  test("shows all 3 projects in the projects section", async ({ page }) => {
    await page.goto("/");
    // Project cards each show "X open" — use that to distinguish from sidebar/recent issue text
    await expect(page.getByRole("link", { name: /ShopApp v2\.1/ }).filter({ hasText: /open/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /AI Chatbot Red Team/ }).filter({ hasText: /open/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Mobile App QA/ }).filter({ hasText: /open/ })).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Issue List
// ---------------------------------------------------------------------------
test.describe("Issue List", () => {
  test("loads all issues", async ({ page }) => {
    await page.goto("/issues");
    await expect(page.getByRole("heading", { name: "All Issues" })).toBeVisible();
    await expect(page.locator("a[href*='/issues/']").first()).toBeVisible();
  });

  test("filter by status New updates the URL", async ({ page }) => {
    await page.goto("/issues");
    // Open the Status select (SelectTrigger showing "All Statuses")
    await page.getByRole("combobox").filter({ hasText: /all statuses/i }).click();
    await page.getByRole("option", { name: "New" }).click();
    await expect(page).toHaveURL(/status=NEW/);
  });

  test("clear filters resets the URL", async ({ page }) => {
    await page.goto("/issues?status=NEW");
    await page.getByRole("button", { name: /clear/i }).click();
    await expect(page).not.toHaveURL(/status=/);
  });

  test("search filters issues by keyword", async ({ page }) => {
    await page.goto("/issues");
    await page.getByPlaceholder("Search issues...").fill("login");
    await expect(page).toHaveURL(/search=login/, { timeout: 10000 });
    await expect(page.locator("body")).not.toContainText("Something went wrong");
  });
});

// ---------------------------------------------------------------------------
// Issue Detail
// ---------------------------------------------------------------------------
test.describe("Issue Detail", () => {
  test("opens an issue and shows key sections", async ({ page }) => {
    await page.goto("/issues");
    // Exclude /issues/new and /issues (sidebar) — match only issue detail links like /issues/cm...
    const firstIssue = page.locator("a[href*='/issues/']:not([href='/issues/new']):not([href='/issues'])").first();
    await firstIssue.click();
    await expect(page).toHaveURL(/\/issues\/(?!new).+/);
    await expect(page.locator("h3").filter({ hasText: "Evidence" })).toBeVisible();
    await expect(page.getByText("Status History")).toBeVisible();
    await expect(page.getByRole("link", { name: /edit/i })).toBeVisible();
  });

  test("back arrow navigates to the project", async ({ page }) => {
    await page.goto("/issues");
    await page.locator("a[href*='/issues/']:not([href='/issues/new']):not([href='/issues'])").first().click();
    await expect(page).toHaveURL(/\/issues\/(?!new).+/);
    // ArrowLeft back button is a Link to /projects/:id
    await page.locator("a[href*='/projects/']").first().click();
    await expect(page).toHaveURL(/\/projects\/.+/);
  });
});

// ---------------------------------------------------------------------------
// Create Issue
// ---------------------------------------------------------------------------
test.describe("Create Issue", () => {
  test("creates a new bug and redirects away from /new", async ({ page }) => {
    await page.goto("/issues/new");
    await page.getByLabel("Title *").fill("Happy path test bug");
    // Project is pre-selected to first project by default — no need to change
    await page.getByRole("button", { name: "Create Issue" }).click();
    // Should redirect to the new issue detail page
    await expect(page).toHaveURL(/\/issues\/.+/);
    await expect(page.getByText("Happy path test bug").first()).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
test.describe("Projects", () => {
  test("lists all 3 seeded projects", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.getByRole("heading", { name: "ShopApp v2.1" }).or(page.getByText("ShopApp v2.1").first())).toBeVisible();
    await expect(page.getByRole("heading", { name: "AI Chatbot Red Team" }).or(page.getByText("AI Chatbot Red Team").first())).toBeVisible();
    await expect(page.getByRole("heading", { name: "Mobile App QA" }).or(page.getByText("Mobile App QA").first())).toBeVisible();
  });

  test("clicking a project card navigates to its detail page", async ({ page }) => {
    await page.goto("/projects");
    // Click first project card (link to /projects/:id, not /projects/new)
    await page.locator("a[href*='/projects/']:not([href='/projects/new'])").first().click();
    await expect(page).toHaveURL(/\/projects\/(?!new).+/);
    await expect(page.getByText("ShopApp v2.1").first()).toBeVisible();
  });

  test("can create a new project", async ({ page }) => {
    await page.goto("/projects/new");
    await page.getByLabel("Project Name *").fill("Happy Path Project");
    await page.getByRole("button", { name: "Create Project" }).click();
    // Redirect lands on the new project's detail page
    await expect(page).toHaveURL(/\/projects\/.+/);
    // Navigate to projects list and confirm new project appears
    await page.goto("/projects");
    await expect(page.getByText("Happy Path Project").first()).toBeVisible();
  });
});
