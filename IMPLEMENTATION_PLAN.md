# Bajaj Operations Mobile App — Implementation Plan

## Design Principles (from your inputs)
- **Brand**: White primary (#FFFFFF), Blue accents (Bajaj blue), Orange for highlights
- **Scale**: Everything smaller — this is an APK, not a web dashboard. Compact, readable components.
- **Style**: Inline style approach (like Tailwind CSS inline utility classes), not thick/bold
- **Glassmorphism**: Replicate the HTML's glass cards but optimized for mobile
- **Layout**: React Navigation for screen management
- **State**: React Context + useReducer
- **Data**: Full HTML dataset (12 users, 4 branches, all tasks/complaints/appliances/approvals/visits)
- **Role switching**: Modal-driven, user auto-selected per role

---

## Phase 0: Foundation & Architecture

### 0.1 — Complete Design System (`src/constants/theme.ts`)
Create a comprehensive theme object with all design tokens:
- **Colors**: 
  - `bg` (background gradient colors), `card`, `cardStrong`, `ink`, `muted`, `line`
  - `brand` (#ef7c21 — orange accent)
  - `navy` (#163049), `teal` (#0f766e), `red` (#be123c), `green` (#15803d), `gold` (#f59e0b)
  - `bg-a`, `bg-b`, `bg-c` (the 3 background gradient stops)
- **Typography**: font sizes (10, 11, 12, 13, 14, 15, 16, 18, 20, 24, 32), font families
- **Spacing**: 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 32
- **Border radius**: 8, 12, 14, 16, 18, 20, 24, 26, 28, 32
- **Shadows**: card shadow, modal shadow
- **Progress track/fill colors**: mapping for each status/priority type

### 0.2 — Complete Type Definitions (`src/types/domain.ts`)
Port ALL types from the HTML:
- `Branch`, `User`, `Task`, `Complaint`, `Appliance`, `Approval`, `Visit`, `Notification`, `AttendanceLog`
- `RoleId`, `RoleDef`, `RolePage`, `TabKey`, `TabState`
- Enums/maps for: priority colors, status badges, accent colors for roles

### 0.3 — Complete Mock Data (`src/data/mockData.ts`)
Port ALL data from the HTML:
- 4 branches (HYD-BH-01, HYD-GC-02, HYD-KP-03, HYD-MD-04)
- 12 users (Rafiq, Suresh, Megha, Farah, Lokesh, Harish, Meena, Rakesh, Anusha, Vikram, Nandini, Ravi Sir)
- 8 tasks, 5 complaints, 6 appliances, 5 approvals, 4 visits, 7 notifications, 9 attendance records
- All helper functions: `formatMoney`, `formatPct`, `countdown`, `toneClass`, `getBranch`, `getUser`, etc.

### 0.4 — State Context (`src/state/AppContext.tsx`)
React Context with `useReducer`:
- **State shape**: `{ role, page, currentUserByRole, tabs, search, modalOpen, toast }`
- **Actions**: `SWITCH_ROLE`, `SET_PAGE`, `SET_TAB`, `SET_SEARCH`, `OPEN_MODAL`, `CLOSE_MODAL`, `SHOW_TOAST`
- **Derived selectors**: `scopedBranches()`, `scopedUsers()`, `scopedTasks()`, `scopedComplaints()`, `scopedApprovals()`, `scopedNotifications()`, `scopedAttendance()`, `scopedAppliances()`
- **Data mutations**: `markTaskDone`, `revokeTask`, `submitTaskProof`, `resolveComplaint`, `escalateComplaint`, `assignVendor`, `approveHighCost`, `approveRequest`, `rejectRequest`, `toggleNotificationRead`, `toggleBookmark`, `createTask`, `createComplaint`, `createUser`, `createStaff`, `createAppliance`, `createExpense`, `createVisit`, `markAttendance`, `saveSettings`

### 0.5 — React Navigation Setup (`src/navigation/`)
- Install `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`
- Create `RootNavigator.tsx` with a bottom tab navigator
- Each role gets its own tab configuration (matching the HTML pages for that role)
- Tab bar matches HTML mobile nav: compact, 5 tabs max, active/inactive styling

---

## Phase 1: Core UI Components

### 1.1 — Reusable Primitives (`src/components/shared/`)
| Component | Props | Notes |
|-----------|-------|-------|
| `Badge` | `label`, `type` (maps via toneClass) | Pill-shaped, colored per status/priority |
| `StatCard` | `label`, `value`, `meta`, `icon`, `accent` | Card with label + large value + icon box |
| `ProgressBar` | `value` (0-100), `color` | Track + fill, rounded, height 8 |
| `SectionHeader` | `title`, `subtitle`, `action?` | H2 + subtitle + optional action button |
| `SegmentedControl` | `tabs[]`, `activeKey`, `onChange` | Pill-shaped toggle group |
| `QuickButton` | `label`, `icon`, `onPress`, `tone?` | Compact action button |
| `Card` | `children`, `style?`, `variant?` | Glassmorphism card (shell-card or soft-card) |
| `Toast` | — | Fixed position toast with auto-dismiss |
| `RoleSwitcherModal` | — | Modal showing all 5 roles with current highlighted |
| `FormModal` | `title`, `subtitle`, `formContent` | Base modal wrapper with close |

### 1.2 — Status/Type Mappings
Create a utility file `src/utils/styleMaps.ts`:
- `toneClass(type)` → returns `{ bg, text, border }` for every status/priority/type
- `roleAccent(roleId)` → returns accent color + bg for each role
- `pageIcon(pageId)` → returns icon name for each page

### 1.3 — Layout Components (`src/components/layout/`)
- **TopBar**: Role badge (opens role switcher), search bar, notification bell with dot, profile avatar with initial
- **BottomNav**: 5-tab grid (matches role's pages, first 5), active state, shell-card wrapper
- **ScreenWrapper**: SafeAreaView + gradient background (the 3-color radial gradient) + ScrollView

---

## Phase 2: Worker Screens

### 2.1 — Worker Home (`src/features/worker/WorkerHomeScreen.tsx`)
- SectionHeader with "Worker command desk" + "Mark Attendance" | "Raise Issue" buttons
- 4 StatCards: today's proof tasks, attendance status, open alerts, this month
- Live queue: today's worker tasks (shell-card, compact task cards)
- Proof escalation ladder (4-step: Worker → AA → BM → RM)
- Countdown focus card (countdown to next deadline + submit proof)
- Alerts from branch head (3 alert items)

### 2.2 — Worker Tasks (`src/features/worker/WorkerTasksScreen.tsx`)
- SectionHeader with segmented (Daily/Weekly/All) + Raise Issue button
- 3 StatCards: Pending, Completed, Shared tasks
- Task card list (each: status badge, priority badge, schedule, title, branch, zone, assignee, 4 metadata columns, progress bar, redo note, actions)

### 2.3 — Worker Complaint Screen
- SectionHeader with segmented (Active/Escalated/All) + Raise button
- 3 StatCards: Open, Escalated, Resolved
- Quick complaint form (title, type, priority, description)
- Complaint card list

### 2.4 — Worker Attendance
- "Attendance proof" header + Mark Attendance button
- Today's proof card (status, location, capture button)
- Detail rows: check-in, proof, deviation
- 3 stat cards (Present/Late/Absent this month)
- Recent day-wise records

### 2.5 — Worker Notifications
- SectionHeader with segmented (All/Unread/Bookmarked/Critical)
- Notification cards: priority badge, read/unread badge, title, detail, time, mark read, bookmark

### 2.6 — Worker Profile
- Profile card (initials, name, position, branch)
- Detail rows: phone, email, shift, device
- 3 stat cards: attendance, task closures, rating
- Skills & compliance section
- Documents list

---

## Phase 3: Employee Screens (similar structure)

### 3.1 — Employee Home (`EmployeeHomeScreen.tsx`)
- "Employee operations desk" header + Mark Attendance | Raise Issue
- 4 StatCards: assigned tasks, attendance, issue tracker, manager comments
- Priority tasks panel (compact task cards)
- Redo watch card (revoked tasks with reason)
- Micro detail panel (last geo punch, device ID, supervisor, shift)

### 3.2 — Employee Tasks
- SectionHeader with daily/weekly/all segmented + Apply Leave button
- 3 StatCards: Redo required, In progress, Completed
- Task card list

### 3.3 — Employee Issues/Complaints (same structure as Phase 2.3)

### 3.4 — Employee Attendance (same structure as Phase 2.4)

### 3.5 — Employee Notifications (same structure as Phase 2.5)

### 3.6 — Employee Profile (same structure as Phase 2.6)

---

## Phase 4: AA (Admin Assistant) Screens

### 4.1 — AA Home (`AmHomeScreen.tsx`)
- "Branch command center" header + Create Task | Add Staff | Add Appliance
- 4 StatCards: branch health, pending tasks, open complaints, budget burn
- Action queue (shell-card with Worker flow/Employee flow/Templates segmented)
- Branch watchlist (4 alert items)
- Staff pulse (top 5 workers/employees with attendance + tasks)
- Pending appliance approvals

### 4.2 — AA Tasks (`AmTasksScreen.tsx`)
- Same segmented (Worker flow/Employee flow/Templates)
- 3 StatCards: Pending, In progress, Closure rate
- Quick action buttons: Create task, Notify team, Call next delay
- Task card list

### 4.3 — Branch Hub (`BranchHubScreen.tsx`)
- SectionHeader with segmented (Employees/Workers/Appliances/Audit) + Add Staff | Add Appliance
- 4 StatCards: staff count, audit score, appliance risk, budget remaining
- Tab content per segment:
  - **Employees/Workers**: intake form + people list with profile, call, notify buttons
  - **Appliances**: appliance cards with health, status, AMC, parts
  - **Audit**: daily audit trail + compliance snapshot

### 4.4 — AA Complaints, Attendance, Notifications, Profile
Reuse/compose from Phase 2/3 patterns

---

## Phase 5: Branch Manager Screens

### 5.1 — Branch Manager Home (`BranchManagerHomeScreen.tsx`)
- "Multi-branch overview" header + Schedule Visit | Review Approvals
- 4 StatCards: branches in scope, critical issues, budget used, visit queue
- Branch comparison snapshot (grid of branch cards with health, SLA, attendance, issues, visits)
- Watchlist (3 alert items)
- Upcoming visits list

### 5.2 — Branches Directory (`BranchesScreen.tsx`)
- Branch card grid (each: code, name, address, health badge, 4 metrics, progress bar, Open Detail + Schedule Visit)

### 5.3 — Task Monitor (`MonitoringScreen.tsx`)
- SectionHeader with Workers/Employees segmented
- 4 StatCards: Pending, In progress, Revoked, Completed
- Full task card list (cross-branch)

### 5.4 — Issues Management
- Same structure as complaint screen but "Escalated issues and actions" header
- With Create Work Order button

### 5.5 — Approvals (`ApprovalsScreen.tsx`)
- SectionHeader with Pending/Closed/All segmented
- 3 StatCards: Pending, Approved, Rejected
- Approval cards: status badge, priority, kind, title, branch, stage, amount, requester, age, note, Approve/Reject buttons

### 5.6 — Visit Planner (`VisitsScreen.tsx`)
- Schedule a new visit form + existing visits list
- Each visit: branch, purpose, scheduled date, agenda, report (if completed)

### 5.7 — Notifications & Profile
Reuse from Phase 2

---

## Phase 6: RM (Super Admin) Screens

### 6.1 — RM Dashboard (`RmDashboardScreen.tsx`)
- "Regional dashboard" header + Open Approvals | User Control
- 4 StatCards: branch health, attendance average, critical alerts, open approvals
- Branch health board (all branches with code, name, city, revenue, health, attendance, SLA, budget, alerts)
- RM watchlist (3 items) + Decision feed (3 items)

### 6.2 — Branch Intelligence (`IntelligenceScreen.tsx`)
- SectionHeader with Performance/Risk segmented
- Branch cards: name, city, revenue index, score badge, progress bar, 4 metrics, drill-down button

### 6.3 — Alert Center (`AlertsScreen.tsx`)
- SectionHeader with Critical/All segmented
- Complaint cards (filtered to critical/escalated)
- Repeated failure watch section

### 6.4 — Issues & Costs (`FinanceScreen.tsx`)
- "Issues and expenses" header
- 3 StatCards: high-cost issues, pending approvals, regional budget burn
- High-cost complaint cards

### 6.5 — Analytics (`AnalyticsScreen.tsx`)
- Attendance trend (per branch progress bars)
- Expense pressure (per branch budget burn progress bars)

### 6.6 — RM Approvals (same structure as 5.5)

### 6.7 — User Management (`UsersScreen.tsx`)
- SectionHeader with Active/Workers/All segmented + Add User button
- Create user form (name, role, branch)
- User cards: name, position, role, branch, attendance, rating, role, device, Open Detail + Refresh Permissions

### 6.8 — Settings (`SettingsScreen.tsx`)
- Update operational rules form: geo radius, worker escalation mins, employee escalation mins, critical alert rule, deadline rule
- Current policy snapshot
- "Why this matters" tips

### 6.9 — RM Notifications & Profile
Reuse from Phase 2

---

## Phase 7: Modals, Forms & Detail Views

All modals use the `FormModal` component (slide-up on mobile, centered on tablet). Each matches the HTML's `openModal(baseModal(...))` pattern.

### 7.1 — Detail Modals
| Modal | Content |
|-------|---------|
| `TaskDetailModal` | Status + priority badges, title, branch/zone, notes, assigned to/by, deadline, escalation, checklist progress, proof rules, redo note, action buttons |
| `ComplaintDetailModal` | Status + priority, title, branch/type/date, description, reporter, vendor, cost, escalation stage, timeline, impact, linked asset, action buttons |
| `UserDetailModal` | Avatar initials, name, position, branch, phone/email/shift/device/emergency, 4 stat cards (attendance, closures, proof rate, escalations), skills, documents, current workload |
| `ApplianceDetailModal` | Status + approval badge, name, branch/zone, brand/model/serial, health score, service dates, AMC vendor, pending parts, purchase info, warranty, related issues |
| `BranchDetailModal` | Code, name, address, health/attendance/SLA/alerts, manager info, geo/shift/visit, 4 stats, operational drill-down, top staff + open issues |
| `VisitDetailModal` | Status badge, branch, schedule, purpose, agenda, report, submit report button |
| `AuditTrailModal` | Recent system actions timeline |

### 7.2 — Form Modals
| Form | Fields |
|------|--------|
| `ComplaintForm` | Title, Type (select), Priority (select), Description (textarea) |
| `TaskForm` | Title, Audience (worker/employee), Schedule (daily/weekly/monthly), Zone, Deadline, Priority, Proof rule (photo/completion), Notes |
| `StaffForm` | Name, Role (worker/employee), Position, Phone, Shift |
| `ApplianceForm` | Name, Category, Zone, Brand, Model, Notes |
| `LeaveForm` | Type (casual/sick/annual), From/To dates, Reason |
| `ExpenseForm` | Title, Amount, Vendor, Description |
| `VisitForm` | Branch (select), Date, Purpose, Agenda |
| `UserForm` | Name, Role (worker/employee/am/bm), Branch (select) |
| `QuickActionForm` | Grid of buttons: Create Task, Raise Complaint, Add Staff, Add Appliance |

### 7.3 — Role Switcher Modal
- Backdrop overlay
- Card with "Switch Role" header + close button
- 5 role options: name, short description, role-specific icon, role accent color
- Current role highlighted with checkmark + orange border
- Click → switch role → close modal → re-render navigation + screens

---

## Phase 8: Search, Toast & Animations

### 8.1 — Search
- Search icon in TopBar → opens search modal
- Real-time filtering across: tasks (title), users (name), branches (name), complaints (title), appliances (name)
- Results as clickable items → open respective detail modal

### 8.2 — Toast
- Fixed position top-right
- Slide-in animation
- Auto-dismiss after 2.2 seconds
- Message string from action callbacks

### 8.3 — Animations (`src/utils/animations.ts`)
- `fadeIn`: opacity 0→1, 180ms
- `riseIn`: opacity 0→1 + translateY(12)→0, 320ms (for page transitions)
- `modalRise`: opacity 0→1 + translateY(18)→0, 240ms (for modal open)
- `scaleIn`: for button presses

---

## Implementation Order Summary

| Phase | Effort | What |
|-------|--------|------|
| **0** | Medium | Theme, types, mock data, context, navigation |
| **1** | Medium | Core components (Badge, Card, StatCard, etc.) |
| **2** | Large | Worker screens (Home, Tasks, Complaints, Attendance, Notifications, Profile) |
| **3** | Medium | Employee screens (largely reuse Phase 2) |
| **4** | Large | AA screens (Home, Tasks, Branch Hub, Complaints, Attendance) |
| **5** | Large | Branch Manager screens (Home, Branches, Monitor, Issues, Approvals, Visits) |
| **6** | Large | RM screens (Dashboard, Intel, Alerts, Finance, Analytics, Users, Settings) |
| **7** | Large | All modals, forms, detail views |
| **8** | Small | Search, Toast, Animations polish |

---

## Key Architectural Decisions

1. **Screen = 1 file per page**, composed of shared components
2. **No prop drilling** — all screens read from Context via custom hook `useApp()`
3. **Modal state** managed in Context: `{ modalType: string | null, modalData: any }`
4. **Inline styles** using a `s()` helper function that maps style tokens to RN StyleSheet-like objects — mimics Tailwind inline utility approach
5. **Stateless components** where possible — state lives in Context
6. **All data operations** (create, update, delete) go through context dispatch, which mutates the mock data arrays (matching HTML behavior)
