# Research & Decisions: Phase 2 - Full-Stack Implementation

**Feature**: Phase 2 Full-Stack Todo
**Status**: Completed

## 1. Better Auth with FastAPI Integration

- **Context**: Better Auth is primarily a JS/TS library. Need to verify best pattern for Python FastAPI backend verification.
- **Decision**: Use Better Auth's Python SDK or verify JWT tokens using standard libraries if SDK unavailable.
- **Rationale**: Mandatory stack choice.
- **Action**: Verify Better Auth Python compatibility or standard JWT verification flow.

## 2. WebSocket Authentication

- **Context**: WebSockets require authenticated connections. Standard HTTP headers might not apply during handshake in all clients.
- **Decision**: Authenticate via query parameter token during handshake or initial message payload.
- **Rationale**: Ensure real-time updates are secure and user-isolated.
- **Action**: Prototype WebSocket handshake with Better Auth token.

## 3. Offline-First Architecture

- **Context**: Requirement for offline access and sync.
- **Decision**: Use **TanStack Query (React Query)** with `persistQueryClient` + **IndexedDB** for local storage.
- **Rationale**: Robust, standard ecosystem approach for React/Next.js state management and persistence.
- **Alternatives**: Redux Offline (too heavy), Custom service worker (too complex).

## 4. Urdu RTL Support

- **Context**: Application must support Urdu (Right-to-Left).
- **Decision**: Use **Tailwind CSS logical properties** (`start`, `end` instead of `left`, `right`) and Next.js `dir="rtl"` attribute.
- **Rationale**: Native CSS support for internationalization without complex stylesheets.

## 5. Neon PostgreSQL Scaling

- **Context**: Serverless database connection limits.
- **Decision**: Use **SQLModel** with connection pooling (e.g., SQLAlchemy `QueuePool` or Neon's built-in pooling if available via URL).
- **Rationale**: Prevent connection exhaustion in serverless environment.

## 6. Project Structure Verification

- **Decision**: Split `backend/` and `frontend/` roots.
- **Rationale**: Prepares backend for independent scaling and usage by Phase 3 Chatbot (which will be a separate client or service).
