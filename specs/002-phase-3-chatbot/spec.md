# Phase 3: AI-Powered Todo Chatbot Specification

## Overview
Implement a conversational interface for managing todos using the Model Context Protocol (MCP) and OpenAI Agents SDK.

## Objectives
- Natural language task management (Create, Read, Update, Delete, Complete).
- Stateless backend with database-backed conversation history.
- Integrated Chat UI using OpenAI ChatKit.

## Architecture
- **MCP Server**: Exposes Task CRUD operations as standardized tools.
- **OpenAI Agent**: Orchestrates tool calls based on user intent.
- **Chat API**: FastAPI endpoint for sending/receiving messages.
- **Database**: Stores `Conversation` and `Message` records.

## Technical Stack
- **AI**: OpenAI Agents SDK, Official MCP SDK.
- **Backend**: FastAPI, SQLModel.
- **Frontend**: Next.js, OpenAI ChatKit.

## Data Models

### Conversation
- `conversation_id`: UUID (PK)
- `user_id`: UUID (FK)
- `created_at`: datetime
- `updated_at`: datetime

### Message
- `message_id`: UUID (PK)
- `conversation_id`: UUID (FK)
- `role`: string (user/assistant)
- `content`: string
- `tool_calls`: JSON (optional)
- `created_at`: datetime

## MCP Tools
- `add_task(title, description, priority, due_date)`
- `list_tasks(status, priority, search)`
- `update_task(task_id, title, description, priority, due_date, completed)`
- `delete_task(task_id)`
- `complete_task(task_id)`

## API Endpoints
### POST /api/v1/chat
- **Request**: `{ conversation_id?, message: string }`
- **Response**: `{ conversation_id, response: string, tool_calls: [] }`

## Success Criteria
- [ ] AI correctly identifies task-related intents.
- [ ] MCP tools successfully perform DB operations.
- [ ] Conversation history persists across sessions.
- [ ] Chat UI provides a seamless user experience.
