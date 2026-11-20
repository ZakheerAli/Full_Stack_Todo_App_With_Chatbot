---
description: "Task list for Phase 3 AI Chatbot Implementation"
---

# Tasks: Phase 3 - AI Chatbot Implementation

## Phase 1: Models & Services (Backend Foundations)

- [x] T001 Define `Conversation` and `Message` models in `backend/src/models/chat.py`
- [x] T002 Implement `ChatService` in `backend/src/services/chat_service.py`
- [x] T003 Update `backend/src/main.py` to import new models for SQLModel metadata

## Phase 2: MCP Server (Tooling Layer)

- [x] T004 Implement **Official MCP SDK** Server in `backend/src/mcp/server.py` (Implemented as custom `MCPServer` class)
- [x] T005 Expose `add_task` tool as an MCP tool
- [x] T006 Expose `list_tasks` tool as an MCP tool
- [x] T007 Expose `update_task` tool as an MCP tool
- [x] T008 Expose `delete_task` tool as an MCP tool
- [x] T009 Expose `complete_task` tool as an MCP tool

## Phase 3: AI Agent (Reasoning Layer)

- [x] T010 Integrate **OpenAI Agents SDK** in `backend/src/agents/todo_agent.py` (Integrated with Google Gemini Flash)
- [x] T011 Define the system prompt for the `TodoAgent`
- [x] T012 Map MCP tools to the OpenAI Agent

## Phase 4: Chat API (Interface Layer)

- [x] T013 Create `/chat` endpoint in `backend/src/api/routes/chat.py`
- [x] T014 Implement conversation history fetching and storage in the chat route
- [x] T015 Register chat router in `backend/src/api/api.py`

## Phase 5: Frontend Chat UI (User Layer)

- [x] T016 Build `ChatPage` component in `frontend/src/app/dashboard/chat/page.tsx`
- [x] T017 Integrate **OpenAI ChatKit** or Shadcn UI Chat components (Custom `FloatingChat.tsx` implemented)
- [x] T018 Connect frontend to `/api/v1/chat` backend endpoint

## Phase 6: Testing & Validation

- [x] T019 Verify conversational task creation ("Remind me to buy milk")
- [x] T020 Verify task listing via chat ("Show my tasks")
- [x] T021 Verify task completion via chat (using the task ID)
- [x] T022 Ensure cross-session conversation persistence

The backend integration test verifies task creation, listing, and completion with
scripted tool selection, plus conversation history after signing in again and
isolation between accounts. Set `NEXAFLOW_TEST_LIVE_AI=1` to exercise Gemini tool
selection through the same test. Both modes passed.
