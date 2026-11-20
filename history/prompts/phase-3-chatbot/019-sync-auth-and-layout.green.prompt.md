---
id: 019
title: "Sync Chatbot Actions, Auth Redirects, and Split Layout"
stage: green
date: 2026-06-22
surface: agent
model: gemini-2.5-flash
feature: phase-3-chatbot
branch: main
user: user
command: none
labels: ["frontend", "authentication", "layout", "real-time-sync"]
links:
  spec: "specs/002-phase-3-chatbot/spec.md"
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - frontend/src/components/chat/FloatingChat.tsx
  - frontend/src/app/dashboard/chat/page.tsx
  - frontend/src/app/(auth)/login/page.tsx
  - frontend/src/app/(auth)/register/page.tsx
tests_yaml: |
  - none
---

# Prompt History Record (PHR)

## Prompt Text
Now the chatbot is working but when I give this input to the chatbot "add task 'buy milk'", the task is added but it is not visible where this task is saved. I want that when any user uses the chatbot without creating an account, then he should be redirected to the direct login or create account page and when any user adds a task through the chatbot or manually, then he should see all the tasks at one place.

## Response Text
I implemented the following improvements:
1. **Authentication Guards**:
   - Updated `FloatingChat.tsx` to redirect unauthenticated users to `/login` immediately when they try to open or message the chatbot, rather than showing a simple alert.
   - Guarded `/dashboard/chat` dedicated chat route by checking for the authorization token and redirecting missing sessions to `/login`.
2. **Authorized Requests & Real-Time Sync**:
   - Added bearer headers (`Authorization: Bearer <token>`) to all fetch requests on the dedicated chat page.
   - Integrated React Query `useQueryClient` to invalidate the `['tasks']` query cache whenever a chatbot request completes. This ensures tasks added, updated, or completed through the chatbot reflect instantly in the UI.
3. **Split-Screen Unified View**:
   - Redesigned the dedicated chat page `/dashboard/chat` using a three-pane premium layout: Navigation sidebar (`AppLayout`), the Chat Assistant container, and a Live Task Feed panel side-by-side. Users can now see all their tasks in one place and watch them update live as they chat.

## Outcome/Evaluation
Allows the user to easily and securely manage all tasks in one unified interface, with instant updates and proper login guards.
