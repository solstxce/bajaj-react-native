# Phase 0 Complete — Foundation

## What was built

### Files created/modified

| File | Purpose |
|------|---------|
| `src/types/domain.ts` | All 13 types (Branch, User, Task, Complaint, Appliance, Approval, Visit, NotificationItem, AttendanceLog, RoleDef, TabState, Priority, etc.) matching HTML data model |
| `src/theme/theme.ts` | Complete design tokens: 48 colors, 10 spacing units, 11 border radii, 10 font sizes, 3 shadow presets |
| `src/theme/styleMaps.ts` | `toneClass()` for 18 status/priority types, `roleAccent()`, `roleIcon()`, `pageIcon()`, `progressColor()` |
| `src/utils/helpers.ts` | `formatMoney()`, `formatPct()`, `countdown()` from HTML |
| `src/data/mockData.ts` | Full HTML dataset: 5 roles, 4 branches, 12 users, 8 tasks, 5 complaints, 6 appliances, 5 approvals, 4 visits, 7 notifications, 9 attendance records |
| `src/context/AppContext.tsx` | React Context + useReducer with all state, derived selectors, and 20+ action callbacks (markTaskDone, revokeTask, resolveComplaint, etc.) |
| `src/navigation/RootNavigator.tsx` | Dynamic bottom tab navigator reads current role's pages, renders tabs, supports `registerScreen()` for lazy screen injection |
| `src/navigation/PlaceholderScreen.tsx` | Shows role + page name until real screens are built |
| `src/shared/layout/ScreenWrapper.tsx` | Screen shell with gradient bg blobs, ScrollView, padding |
| `src/app/RootApp.tsx` | Entry point: AppProvider → NavigationContainer → RootNavigator |
| `App.tsx` | Updated to use new RootApp |

### Deleted (replaced by new structure)

All old files: `constants/roles.ts`, `constants/theme.ts`, `state/useOpsStore.ts`, `data/mockData.ts`, `components/layout/*`, `components/shared/*`, `features/operations/*`

### Architecture

```
App.tsx
  └─ src/app/RootApp.tsx
       └─ AppProvider (Context + useReducer)
            └─ NavigationContainer
                 └─ RootNavigator (Bottom Tabs — dynamic per role)
                      ├─ Home tab → PlaceholderScreen (will be WorkerHome, etc.)
                      ├─ Tasks tab → PlaceholderScreen
                      └─ ... up to 5 tabs
```

### State management

- `AppContext` provides `useApp()` hook
- State: `role`, `page`, `tabs`, `modalType`, `modalData`, `toast`
- Derived: all `scoped*` arrays, `currentUser`, `getBranch()`, etc.
- Actions: full HTML-equivalent mutations on all data arrays

### Ready for Phase 1

To add screens, use `registerScreen(pageId, Component)` in `RootNavigator.tsx` and create screen files in the appropriate `src/roles/{role}/` folder.

**`npx tsc --noEmit` passes cleanly.**
