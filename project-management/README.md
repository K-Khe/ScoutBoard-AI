# Frontend Project Management

## Overview

This folder contains the complete project backlog structure for the frontend development roadmap.

The backlog is divided by Epic to make it easier to manage, assign, import, and track progress in:

- GitHub Projects
- Jira
- Linear

Each CSV file represents one Epic area.

---

## Folder Structure

```text
project-management/

├── 00-foundation.csv
├── 01-shared-architecture.csv
├── 02-dashboard.csv
├── 03-connect-data.csv
├── 04-product-finder.csv
├── 05-radar-setup.csv
├── 06-content-tracker.csv
├── 07-content-planner.csv
├── 08-market-density.csv
├── 09-product-insight.csv
├── 10-saved-products.csv
├── 11-ad-angles.csv
├── 12-signal-sources.csv
├── 13-outreach.csv
├── 14-reports.csv
├── 15-release-qa.csv
│
├── MASTER-BACKLOG.csv
└── README.md
```

---

## CSV Schema

Every CSV file must use the same columns.

| Column | Description |
|---|---|
| ID | Unique task identifier |
| Epic | Main work category |
| Component | Specific system area |
| Task | Work item description |
| Priority | Task importance |
| Status | Current progress |
| Assignee | Person responsible |
| Estimate | Story point size |
| Dependency | Required previous task |
| Labels | Search/filter tags |
| Acceptance Criteria | Conditions for completion |
| Definition of Done | Completion standard |

---

## Status Rules

Allowed values:

| Status | Meaning |
|---|---|
| Todo | Not started |
| In Progress | Currently being developed |
| Blocked | Waiting for dependency |
| Review | Waiting for verification |
| Done | Completed |

---

## Priority Rules

| Priority | Meaning |
|---|---|
| P0 | Critical, blocking work |
| P1 | Core feature |
| P2 | Improvement |
| P3 | Optional enhancement |

---

## Estimate Rules

Story Point estimation:

| Point | Meaning |
|---|---|
| 1 | Very small task |
| 2 | Small task |
| 3 | Medium task |
| 5 | Large task |
| 8 | Too large, consider splitting |

---

## Dependency Rules

Dependency must reference only Task ID.

Correct:

```text
FND-001
ARC-002
DASH-003
```

Incorrect:

```text
Phase 1
Previous task
UI-*
```

---

## Label Convention

### Technology

```text
nextjs
react
typescript
tailwind
```

### Architecture

```text
architecture
mock-api
service
state
zustand
types
```

### UI

```text
component
forms
charts
pagination
table
modal
drawer
toast
loading
empty-state
error-state
```

### Quality

```text
responsive
a11y
qa
ci
```

### Feature

```text
dashboard
connect-data
product-finder
reports
settings
help
```

---

## Acceptance Criteria Rules

Acceptance Criteria must be measurable.

Good example:

```text
- User can search products
- Filter updates result list
- Loading state appears
- Error state appears when API fails
```

Bad example:

```text
- Make it better
- Improve UI
- Complete feature
```

---

## Definition of Done Rules

A task is complete when:

- Code implemented
- TypeScript passes
- Component structure follows project rules
- Responsive checked
- Required states implemented
- Build passes if applicable

---

## Development Order

Tasks should generally follow this order:

### Phase 1
Foundation

```text
00-foundation.csv
```

### Phase 2
Architecture

```text
01-shared-architecture.csv
```

### Phase 3
Core Screens

```text
02-dashboard.csv
03-connect-data.csv
04-product-finder.csv
```

### Phase 4
Secondary Features

```text
05-radar-setup.csv
06-content-tracker.csv
07-content-planner.csv
08-market-density.csv
09-product-insight.csv
10-saved-products.csv
11-ad-angles.csv
12-signal-sources.csv
13-outreach.csv
14-reports.csv
```

### Phase 5
UX and Release

```text
15-release-qa.csv
```

---

## Import Workflow

Recommended workflow:

1. Import Foundation CSV
2. Complete dependencies
3. Import Architecture CSV
4. Import Feature CSVs
5. Import Release QA CSV
6. Use MASTER-BACKLOG.csv for overall tracking

### Import Notes

- Each CSV uses the same column order.
- Dependency values should reference task IDs only, such as `ARC-003` or `REPORT-001`.
- Import order should follow the dependency chain from `00-foundation.csv` through `15-release-qa.csv`.
- Use `MASTER-BACKLOG.csv` as the cross-epic index, not as the primary tracker for ticket import.
- GitHub Projects, Jira, and Linear imports are easiest when each epic stays in its own CSV.

---

## Quality Gates

Before marking project complete:

- npm run lint ✅
- npm run build ✅
- Type check ✅
- Visual smoke test ✅
- Responsive test ✅
- Accessibility review ✅
