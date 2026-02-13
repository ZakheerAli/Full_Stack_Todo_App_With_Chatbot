# WebSocket Events: Phase 2

**Endpoint**: `ws://<host>/ws`
**Auth**: Token via query param `?token=<jwt>`

## Server -> Client Events

### `task.created`
- **Payload**: `{ task: Task }`
- **Description**: Sent when a task is created by another session.

### `task.updated`
- **Payload**: `{ task: Task }`
- **Description**: Sent when a task is modified.

### `task.deleted`
- **Payload**: `{ task_id: UUID }`
- **Description**: Sent when a task is soft-deleted.

### `task.completed`
- **Payload**: `{ task_id: UUID, completed: true }`
- **Description**: Specific update event for completion status.

## Client -> Server Events

*Currently client actions are performed via REST API, which triggers WebSocket broadcasts to connected clients.*
