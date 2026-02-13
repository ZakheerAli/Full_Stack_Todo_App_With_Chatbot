# Implementation Plan: Phase 2 - Full-Stack Implementation

**Branch**: `001-phase-2-full-stack` | **Date**: 2026-01-12 | **Spec**: [specs/001-phase-2-full-stack/spec.md](spec.md)
**Input**: Feature specification from `specs/001-phase-2-full-stack/spec.md`

## Summary

Phase 2 delivers a **production-grade full-stack todo web application** evolving Phase 1 logic into a modern, scalable experience. It implements secure authentication using **Better Auth**, rich task management, real-time updates via WebSockets, offline support, and Urdu internationalization. The system is built on **Next.js 16+** and **FastAPI** with **Neon PostgreSQL**, strictly adhering to Spec-Driven Development.

## Technical Context

**Language/Version**: Python 3.11+ (Backend), TypeScript 5+ (Frontend)
**Primary Dependencies**: FastAPI, SQLModel, Better Auth, Next.js 16+ (App Router), TanStack Query, Framer Motion
**Storage**: Neon Serverless PostgreSQL (SQLModel ORM)
**Testing**: Pytest (Backend), Jest + Playwright (Frontend)
**Target Platform**: Web (Vercel Frontend, Docker/Railway Backend)
**Project Type**: Web Application (Monorepo)
**Performance Goals**: API P95 < 500ms, WebSocket latency < 500ms, Page load < 3s, Lighthouse > 90
**Constraints**: Strict Better Auth usage, No manual coding, Offline-first, Accessibility WCAG 2.1 AA
**Scale/Scope**: ~10k users, Real-time sync, Multi-language (EN/UR)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Spec-Driven Development**: ✅ Workflow followed (Spec -> Plan -> Tasks).
- **No Manual Coding**: ✅ Implementation will be via Claude Code/Gemini CLI.
- **Technology Stack**: ✅ Strictly adheres to Constitution Phase 2 lock (FastAPI, Next.js, Better Auth, Neon).
- **Incremental Evolution**: ✅ Extends Phase 1 logic, ready for Phase 3.
- **Security**: ✅ Better Auth mandatory, user isolation enforced.
- **Accessibility**: ✅ WCAG 2.1 AA targeted.

## Project Structure

### Documentation (this feature)

```text
specs/001-phase-2-full-stack/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── contracts/           # Phase 2 output
│   ├── api-endpoints.md
│   ├── websocket-events.md
│   └── data-schemas.md
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/          # SQLModel entities
│   ├── services/        # Business logic (Auth, Task, Activity)
│   ├── api/             # FastAPI routes
│   └── websocket/       # Real-time handlers
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── pyproject.toml

frontend/
├── src/
│   ├── app/             # Next.js App Router
│   ├── components/      # UI Components (Radix/Shadcn)
│   ├── hooks/           # Custom hooks (useTasks, useAuth)
│   ├── lib/             # Utilities
│   └── services/        # API Clients
├── public/              # Static assets
└── tests/               # Jest/Playwright tests
```

**Structure Decision**: Monorepo structure with distinct `backend` (Python/FastAPI) and `frontend` (Next.js/TypeScript) directories at the root level to ensure separation of concerns and independent scalability as per Architectural Principles.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Monorepo Split | Strict separation of frontend/backend required for Phase 3 reuse | Single app framework (e.g. Django templates) violates modern web requirement |
| WebSockets | Real-time multi-device sync requirement | Polling is inefficient and slow for collaborative feeling |
| Offline-First | Unstable internet requirement | Simple online-only app fails user story 8 |