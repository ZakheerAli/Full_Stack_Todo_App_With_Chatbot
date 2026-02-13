---
id: 8
title: Fix authentication and task authorization
stage: green
date_iso: 2026-02-12
surface: agent
model: gemini-2.0-flash-exp
feature: phase-2-full-stack
branch: main
user: user
command: /sp.implement
labels: ["auth", "fastapi", "nextjs", "jwt"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - backend/src/api/routes/auth.py
  - backend/src/core/config.py
  - backend/src/main.py
  - frontend/src/lib/auth-client.ts
  - frontend/src/hooks/useTasks.ts
tests_yaml: |
  - Manual verification of registration endpoint via Invoke-RestMethod
---

## Summary
Fixed critical authentication and authorization issues preventing user registration, login, and task CRUD operations.

## Changes
- Updated `backend/src/api/routes/auth.py` with correct `AsyncSession` type hints and improved logging.
- Synchronized `SECRET_KEY` in `backend/src/core/config.py` to match environment settings for consistent JWT verification.
- Added global `RequestValidationError` handler in `backend/src/main.py` for debugging 422 errors.
- Updated `frontend/src/lib/auth-client.ts` and `frontend/src/hooks/useTasks.ts` to use `127.0.0.1` instead of `localhost` for backend API calls.
- Improved error handling in `frontend/src/lib/auth-client.ts` to surface detailed backend error messages.

## Outcome
Users can now register and log in successfully. Authenticated users can perform task CRUD operations without encountering 403 Forbidden errors. The connection between the Next.js frontend and FastAPI backend is stabilized.
