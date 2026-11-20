# Phase 3: AI-Powered Todo Chatbot Implementation Plan

## 1. Data Model Extension
Create chat-specific models in `backend/src/models/chat.py`.

- **Conversation**: `user_id`, `conversation_id`, `created_at`, `updated_at`.
- **Message**: `conversation_id`, `role`, `content`, `tool_calls`.

## 2. Chat Service
Implement `ChatService` in `backend/src/services/chat_service.py`.

- Methods: `create_conversation`, `get_conversation`, `add_message`, `get_messages`.

## 3. MCP Server
Implement the **Official MCP SDK** in `backend/src/mcp/server.py`.

- Tools:
    - `add_task`: Wrapper for `TaskService.create_task`.
    - `list_tasks`: Wrapper for `TaskService.get_tasks`.
    - `update_task`: Wrapper for `TaskService.update_task`.
    - `delete_task`: Wrapper for `TaskService.delete_task`.
    - `complete_task`: Wrapper for `TaskService.update_task(completed=True)`.

## 4. OpenAI Agent
Configure **OpenAI Agents SDK** in `backend/src/agents/todo_agent.py`.

- Define the `TodoAgent` with the system prompt and MCP tools.
- Implement the stateless runner for `/chat` endpoint.

## 5. API Layer
Add `/chat` routes in `backend/src/api/routes/chat.py`.

- Register the new router in `backend/src/api/api.py`.

## 6. Frontend
Build the chat interface in `frontend/src/app/chat/page.tsx` using **OpenAI ChatKit**.

- Use Shadcn UI components for styling.
- Connect to the `/api/v1/chat` backend endpoint.

## 7. Dependencies
Add the following to `backend/pyproject.toml`:
- `mcp` (Official SDK)
- `openai` (Agents SDK)
- `pydantic-settings` (for config)
