# ICP — Ideal Customer Profile
# Defect Flow

**Version:** 1.0
**Date:** 2026-03-13
**Status:** Draft — MVP

---

## 1. Overview

Defect Flow targets quality-focused practitioners who need a fast, low-friction bug tracking tool — without the overhead of enterprise platforms like Jira or the complexity of developer-first tools not built for testers. The product uniquely bridges traditional QA workflows and the emerging discipline of AI/LLM testing.

---

## 2. Primary User Segments

### Segment 1 — Manual QA Engineers

**Who they are:**
Software testers who find, document, and verify bugs across web, mobile, or desktop applications. They work on small-to-medium engineering teams and often manage bug tracking alongside other responsibilities.

**Roles:**
- QA Engineer
- Software Tester
- Test Analyst
- QA Lead (small teams)

**Company size:** 2–50 person teams
**Industry:** SaaS, agencies, startups, fintech, e-commerce

**Key pain points:**
- Jira is overwhelming — too many fields, too many configuration steps, too slow
- Lightweight alternatives (spreadsheets, GitHub Issues) lack proper QA structure
- Tools don't support evidence management well (screenshots, logs, reproduction steps)
- Status workflows don't match real QA lifecycles (missing "Ready for Retest" and "Rejected" stages)
- No distinction between AI-related and traditional bugs

**Current alternatives they use:**
- Jira (too heavy, designed for dev teams)
- GitHub Issues (no QA-specific fields)
- Trello / Notion databases (no bug structure)
- Excel / Google Sheets (unscalable, no history tracking)
- TestRail (focused on test cases, not defect tracking)

**Why Defect Flow solves it:**
- Purpose-built for testers, not developers
- Lightweight — zero configuration to get started
- Proper severity, priority, and evidence fields out of the box
- 6-stage lifecycle that matches real QA workflows
- Fast issue creation with drag-and-drop evidence

**Usage scenario:**
A QA engineer on a 10-person startup is testing a new feature release. They open Defect Flow, create a bug with a screenshot and steps to reproduce, assign it CRITICAL severity, and move it to TRIAGED in one minute. When the developer claims it's fixed, the issue moves to READY FOR RETEST. After verification, they close it. The full lifecycle is trackable without touching Jira.

---

### Segment 2 — Automation Engineers

**Who they are:**
Engineers who write automated test suites (Selenium, Playwright, Cypress, pytest) and need to track failures from automated runs as structured defects rather than raw logs.

**Roles:**
- Automation QA Engineer
- SDET (Software Developer in Test)
- QA Automation Lead

**Company size:** 5–100 person teams
**Industry:** Any software company with a CI/CD pipeline

**Key pain points:**
- Automated test failures need manual triage — no structured tool to route failures to
- Difficult to attach logs, stack traces, and screenshots from CI runs to bug reports
- Hard to correlate automated failures with existing reported bugs (duplicates)
- Most bug trackers don't have fields relevant to automation (test ID, environment, run ID)

**Current alternatives:**
- Raw CI dashboards (Jenkins, GitHub Actions) — no defect tracking
- Jira automations — complex to set up
- Custom internal tools — expensive to maintain

**Why Defect Flow solves it:**
- Evidence attachments support logs and structured output files
- Environment field captures which test environment the failure occurred in
- Architecture anticipates future integration with CI/CD and test runners
- Duplicate detection (future AI feature) will reduce noise from repeated failures

**Usage scenario:**
An automation engineer's nightly Playwright run fails on a checkout flow. They open Defect Flow, create an AI_ISSUE (or BUG), paste the stack trace as a text note, attach the failure screenshot, link to the CI run, and assign it HIGH priority. The issue is now trackable through the full QA lifecycle.

---

### Segment 3 — AI Testing Practitioners

**Who they are:**
Testers, ML engineers, and product teams who evaluate and red-team LLM-based products. They encounter failure modes unique to AI systems that traditional bug trackers have no vocabulary for.

**Roles:**
- AI QA Engineer
- LLM Evaluator
- Red Team Tester
- AI Safety Researcher
- ML QA Analyst

**Company size:** Any — from solo researchers to large AI labs
**Industry:** AI/ML, AI startups, enterprise AI teams, research institutions

**Key pain points:**
- No existing tool has fields for AI-specific failure types (hallucination, prompt injection, bias, etc.)
- Evidence for AI bugs is complex — prompts, completions, model versions, temperature settings
- Difficult to reproduce AI issues — evidence preservation is critical
- Existing bug trackers were designed before AI testing became a discipline
- No structured way to classify, prioritize, or escalate AI safety issues

**Current alternatives:**
- Spreadsheets with custom columns (unscalable)
- Notion databases (flexible but no workflow)
- GitHub Issues with labels (no AI-specific structure)
- Promptfoo reports (evaluation-focused, not defect tracking)
- Internal wikis (no lifecycle management)

**Why Defect Flow solves it:**
- Native AI issue type with structured categories (hallucination, prompt injection, data leakage, bias/toxicity, unsafe output, inconsistent response, context failure, instruction-following failure)
- Evidence fields designed to capture prompts, completions, and model metadata
- Same QA lifecycle applied to AI defects (triage, retest, close)
- Future: integration with Promptfoo and AI evaluation tools
- Clean interface that AI teams actually want to use

**Usage scenario:**
An AI QA engineer is red-teaming a customer-facing chatbot. They discover the model reveals internal system prompt contents when asked in a specific way. They create an AI_ISSUE in Defect Flow, categorize it as PROMPT_INJECTION, attach the raw prompt/completion pair as a text note, set severity to CRITICAL, and move it to TRIAGED. The product team is alerted and the issue flows through the same lifecycle as any other critical defect.

---

### Segment 4 — Small Engineering Teams / Startups

**Who they are:**
Early-stage teams (2–20 people) where engineers share QA responsibilities. They need bug tracking that is fast to adopt, requires no admin setup, and doesn't cost per-seat.

**Roles:**
- Founding engineer
- Full-stack developer with QA responsibilities
- Startup CTO
- Product manager doing QA

**Company size:** 2–20 people
**Industry:** Any

**Key pain points:**
- Jira is overkill and expensive for a small team
- GitHub Issues is dev-centric and missing QA fields
- Teams track bugs in Slack, Notion, or spreadsheets — disorganized and lossy
- No time to configure complex tools

**Current alternatives:**
- GitHub Issues (developer-centric, missing QA structure)
- Trello (no bug-specific fields)
- Slack threads (ephemeral, untrackable)
- Linear (developer-focused, missing QA lifecycle stages)

**Why Defect Flow solves it:**
- Zero configuration — runs in minutes
- No per-seat pricing for MVP (self-hosted)
- Clean, Linear-inspired UI that developers and testers both enjoy
- Just enough structure without being overwhelming

**Usage scenario:**
A 5-person startup is preparing for a launch. The founding engineer and a part-time QA contractor use Defect Flow to track pre-launch bugs. Issues are created, assigned severity, and tracked to closure in a single lightweight tool. No Jira license, no setup time.

---

### Segment 5 — QA Training Programs and Hackathon Environments

**Who they are:**
Instructors, bootcamp students, and hackathon participants who need a realistic QA tool for learning or rapid-prototyping contexts.

**Roles:**
- QA Bootcamp Instructor
- QA Training Student
- Hackathon Participant
- Developer Relations / DevEx Engineer

**Context:** Educational, short-term project, demo environment

**Key pain points:**
- Enterprise tools have steep learning curves that distract from QA fundamentals
- Most bug trackers require account setup and configuration before students can start
- No tool specifically designed to teach AI testing workflows
- Hackathons need tools that work immediately with zero infrastructure

**Why Defect Flow solves it:**
- No auth, no cloud accounts, no configuration — just clone and run
- Sample data seeded by default — realistic starting point for demos
- Clear, modern UI students actually want to learn with
- AI issue types introduce students to emerging QA discipline
- Open source / self-hostable — no cost barrier

**Usage scenario:**
A QA bootcamp instructor uses Defect Flow as the class bug tracker for a 6-week course. Students learn to file bugs with proper severity, manage issue lifecycles, and for the AI testing module, they practice categorizing LLM failures using the AI issue type system.

---

## 3. Out-of-Scope Users (Not Targeted in MVP)

| User Type | Reason Not Targeted |
|-----------|-------------------|
| Enterprise DevOps teams | Need integrations, SSO, audit logs, compliance |
| Large QA departments (50+ testers) | Need advanced reporting, admin controls, user management |
| Project managers tracking delivery | Need roadmap, sprint, velocity features |
| Developers as primary users | Linear and GitHub Issues serve them better |
| Customer support teams | Need ticket/customer management, not bug tracking |

---

## 4. Market Positioning

```
                 Developer-Focused ◄──────────────────► QA-Focused
                                                              ▲
                 Jira            GitHub Issues         Defect Flow
                 (Complex)       (Dev-centric)         (QA-native)
                                                              │
                 TestRail        Notion DB             AI Testing
                 (Test cases)    (Flexible)            Support
                                                              ▼
                 Heavy/Complex ◄──────────────────► Lightweight
```

**Defect Flow occupies the top-right quadrant:** QA-focused AND lightweight — a gap not served by any existing tool, especially for AI testing.

---

## 5. Key Differentiators

1. **AI issue types are first-class** — not an afterthought or label workaround
2. **Built for testers, not developers** — QA lifecycle stages, severity-first design
3. **Zero setup required** — single command, runs locally, seeded with demo data
4. **Evidence-first design** — drag-and-drop attachments, text notes, links as core features
5. **Modern UI** — testers deserve tools as clean as Linear, not legacy enterprise UX
6. **Open for AI teams** — the only tool designed to track LLM-specific failure modes
