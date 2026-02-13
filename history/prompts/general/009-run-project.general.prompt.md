---
id: 9
title: Run project backend and frontend
stage: misc
date_iso: 2026-02-12
surface: agent
model: gemini-2.0-flash-exp
feature: none
branch: main
user: user
command: please run this project.
labels: ["startup", "uvicorn", "nextjs"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - backend/debug_log.txt
  - frontend/frontend_log.txt
tests_yaml: |
  - netstat check for ports 8000 and 3000
---

## Summary
Started both the FastAPI backend and Next.js frontend in the background.

## Changes
- Started backend on `0.0.0.0:8000` using Poetry and Uvicorn.
- Started frontend on `localhost:3000` using npm.
- Verified both processes are listening on their respective ports.

## Outcome
Project is currently running and accessible at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
