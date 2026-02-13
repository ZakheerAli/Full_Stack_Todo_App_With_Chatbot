---
description: "Task list for Phase 2 Full-Stack Implementation"
---

# Tasks: Phase 2 - Full-Stack Implementation

**Input**: Design documents from `specs/001-phase-2-full-stack/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are integrated into the implementation phases as requested by the robust engineering requirements.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: [US1], [US2], etc.
- **Paths**: `backend/src/...`, `frontend/src/...`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization

- [x] T001 Initialize Git repository and structure (frontend/backend folders)
- [x] T002 [P] Initialize FastAPI project in `backend/` with poetry/pip
- [x] T003 [P] Initialize Next.js 16 project in `frontend/`
- [x] T004 [P] Configure linting (Ruff for python, ESLint/Prettier for JS)

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure blocked before stories

- [x] T005 Define SQLModel entities (User, Task, Tag, ActivityLog) in `backend/src/models/`
- [x] T006 Setup Neon Postgres connection and Alembic migrations in `backend/src/core/db.py`
- [x] T007 [P] Configure Better Auth (Python SDK/Verification) in `backend/src/core/auth.py`
- [x] T008 [P] Setup base API router structure in `backend/src/api/main.py`
- [x] T009 [P] Create Frontend Layout (Navbar/Sidebar) in `frontend/src/components/layout/AppLayout.tsx`
- [x] T010 [P] Setup Shadcn UI and Theme Provider in `frontend/src/components/ui/`

**Checkpoint**: DB connected, Auth configured, UI shell ready.

## Phase 3: User Story 1 - Authentication (Priority: P1)

**Goal**: Users can sign up, log in, and maintain session.

**Independent Test**: Verify full auth flow (Sign up -> Login -> Session persistence -> Logout).

### Implementation
- [x] T011 [US1] Implement Auth API endpoints (login/register hooks) in `backend/src/api/routes/auth.py`
- [x] T012 [US1] Implement User dependency injection in `backend/src/api/deps.py`
- [x] T013 [P] [US1] Build Login Page in `frontend/src/app/(auth)/login/page.tsx`
- [x] T014 [P] [US1] Build Register Page in `frontend/src/app/(auth)/register/page.tsx`
- [x] T015 [US1] Implement Better Auth Client in `frontend/src/lib/auth-client.ts`
- [x] T016 [US1] Add Route Protection (Middleware) in `frontend/src/middleware.ts`

## Phase 4: User Story 2 - Core Task Management (Priority: P1)

**Goal**: CRUD operations for Tasks.

**Independent Test**: Create, read, update, delete tasks via UI.

### Implementation
- [x] T017 [P] [US2] Implement Task CRUD Service in `backend/src/services/task_service.py`
- [x] T018 [US2] Implement Task API Endpoints in `backend/src/api/routes/tasks.py`
- [x] T019 [P] [US2] Create TaskCard Component in `frontend/src/components/tasks/TaskCard.tsx`
- [x] T020 [P] [US2] Create TaskForm (Add/Edit) Component in `frontend/src/components/tasks/TaskForm.tsx`
- [x] T021 [US2] Implement TaskList with Virtual Scroll in `frontend/src/components/tasks/TaskList.tsx`
- [x] T022 [US2] Integrate useTasks Hook (TanStack Query) in `frontend/src/hooks/useTasks.ts`
- [x] T023 [US2] Implement Soft Delete Logic in `backend/src/api/routes/tasks.py`

## Phase 5: User Story 3 - Real-Time Synchronization (Priority: P2)

**Goal**: Instant updates across devices.

**Independent Test**: Open two windows, update in one, verify other updates.

### Implementation
- [x] T024 [P] [US3] Implement WebSocket Manager in `backend/src/websocket/manager.py`
- [x] T025 [US3] Add WebSocket Auth Handshake in `backend/src/websocket/endpoint.py`
- [x] T026 [US3] Broadcast Task Events (Created/Updated) in `backend/src/services/task_service.py`
- [x] T027 [P] [US3] Implement WebSocket Client Hook in `frontend/src/hooks/useWebSocket.ts`
- [x] T028 [US3] Integrate WS updates into Query Client cache in `frontend/src/lib/query-client.ts`

## Phase 6: User Story 4 - Advanced Search & Filtering (Priority: P2)

**Goal**: Filter and search tasks efficiently.

**Independent Test**: Apply filters and search terms, verify result set.

### Implementation
- [x] T029 [P] [US4] Add filter/search params to Task Service in `backend/src/services/task_service.py`
- [x] T030 [P] [US4] Implement Search Bar UI in `frontend/src/components/search/SearchBar.tsx`
- [x] T031 [US4] Implement Filter Facets (Priority/Status) in `frontend/src/components/search/Filters.tsx`
- [x] T032 [US4] Implement Saved Views API in `backend/src/api/routes/views.py`
- [x] T033 [US4] Build Saved Views Sidebar Section in `frontend/src/components/layout/Sidebar.tsx`

## Phase 7: User Story 5 - Accessibility (Priority: P2)

**Goal**: WCAG 2.1 AA Compliance.

**Independent Test**: Keyboard navigation audit.

### Implementation
- [x] T034 [P] [US5] Audit and Add ARIA Labels to all inputs in `frontend/src/components/`
- [x] T035 [P] [US5] Implement Focus Trapping in Modals in `frontend/src/components/ui/dialog.tsx`
- [x] T036 [US5] Add Skip-to-Content link in `frontend/src/app/layout.tsx`
- [x] T037 [US5] Verify Keyboard Navigation flow (Manual Test)

## Phase 8: User Story 6 - Internationalization (Priority: P3)

**Goal**: Urdu Support + RTL.

**Independent Test**: Switch language, verify text and layout direction.

### Implementation
- [x] T038 [P] [US6] Configure Next-Intl or similar in `frontend/src/i18n.ts`
- [x] T039 [P] [US6] Define English/Urdu Dictionaries in `frontend/messages/`
- [x] T040 [US6] Add Language Toggle Component in `frontend/src/components/layout/LanguageSwitcher.tsx`
- [x] T041 [US6] Implement RTL Layout Wrapper in `frontend/src/app/layout.tsx`

## Phase 9: User Story 7 - Smart Notifications (Priority: P3)

**Goal**: Due date reminders.

**Independent Test**: Set due date, wait for browser notification.

### Implementation
- [x] T042 [P] [US7] Request Notification Permissions in `frontend/src/hooks/useNotifications.ts`
- [x] T043 [US7] Implement Client-side Polling/WS Trigger for Due Tasks in `frontend/src/components/tasks/TaskReminder.tsx`
- [x] T044 [US7] (Optional) Backend Email Scheduler in `backend/src/services/notification_service.py`

## Phase 10: User Story 8 - Offline-First (Priority: P3)

**Goal**: Work without internet.

**Independent Test**: Go offline, create task, reconnect, verify sync.

### Implementation
- [x] T045 [US8] Configure PersistQueryClient with IDB in `frontend/src/lib/react-query-persist.ts`
- [x] T046 [US8] Implement Network Status Indicator in `frontend/src/components/ui/NetworkStatus.tsx`
- [x] T047 [US8] Add Optimistic Mutation Queue handling in `frontend/src/hooks/useTasks.ts`

## Phase 11: User Story 9 - Activity Audit Trail (Priority: P3)

**Goal**: View history.

**Independent Test**: Change task, check log.

### Implementation
- [x] T048 [P] [US9] Create Activity Log Service in `backend/src/services/activity_service.py`
- [x] T049 [US9] Inject Logging into Task Service mutations in `backend/src/services/task_service.py`
- [x] T050 [US9] Create Activity Feed Component in `frontend/src/components/activity/ActivityLog.tsx`
- [x] T051 [US9] Implement Activity API Endpoint in `backend/src/api/routes/activity.py`

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup and Production Prep

- [x] T052 [P] Run E2E Tests (Playwright) in `frontend/tests/e2e/`
- [x] T053 [P] Perform Security Audit (Check Auth Guards)
- [x] T054 Verify WCAG Compliance (Lighthouse)
- [x] T055 Prepare Dockerfile for Backend in `backend/Dockerfile`
- [x] T056 Prepare Deployment Config (Vercel/Railway)

## Dependencies & Execution Order

1. **Setup & Foundation** blocks ALL stories.
2. **US1 (Auth)** blocks US2-US9 (Need user context).
3. **US2 (Tasks)** blocks US3, US4, US7, US8, US9.
4. **US3-US9** can be executed roughly in parallel or priority order.
   - US6 (I18n) affects UI components, best done early or with distinct strings.
   - US5 (A11y) is iterative but should be checked continuously.

## Implementation Strategy

1. **MVP**: Setup -> Foundation -> US1 -> US2. (Functional App)
2. **V2**: + US3 (Sync) + US5 (A11y) + US8 (Offline). (Robust App)
3. **V3**: + US4 (Search) + US6 (Urdu) + US7 (Notifs) + US9 (Audit). (Complete Phase 2)
