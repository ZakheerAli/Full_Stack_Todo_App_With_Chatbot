# Data Model: Phase 2 - Full-Stack Implementation

## Entities

### User (`users`)
Represents a registered user of the application.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user_id` | UUID | Yes | Primary Key |
| `email` | String | Yes | Unique, Indexed |
| `auth_provider` | String | Yes | Default: 'better_auth' |
| `language_preference`| String | Yes | 'en' or 'ur'. Default: 'en' |
| `created_at` | DateTime | Yes | UTC timestamp |
| `updated_at` | DateTime | Yes | UTC timestamp |

### Task (`tasks`)
Represents a todo item.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `task_id` | UUID | Yes | Primary Key |
| `user_id` | UUID | Yes | Foreign Key -> users.user_id |
| `title` | String | Yes | Max 255 chars |
| `description` | Text | No | Markdown supported |
| `priority` | Enum | Yes | 'high', 'medium', 'low'. Default: 'medium' |
| `due_date` | DateTime | No | Timezone aware |
| `completed` | Boolean | Yes | Default: false |
| `created_at` | DateTime | Yes | UTC timestamp |
| `updated_at` | DateTime | Yes | UTC timestamp |
| `deleted_at` | DateTime | No | For soft delete |

### ActivityLog (`activity_logs`)
Tracks user actions for audit and history.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `log_id` | UUID | Yes | Primary Key |
| `task_id` | UUID | No | Foreign Key -> tasks.task_id (nullable if action not task-specific) |
| `user_id` | UUID | Yes | Foreign Key -> users.user_id |
| `action` | String | Yes | e.g., 'create', 'update', 'delete', 'complete' |
| `changes` | JSON | No | Snapshot of changed fields (before/after) |
| `created_at` | DateTime | Yes | UTC timestamp |

## Relationships

- **User** 1:N **Task**
- **User** 1:N **ActivityLog**
- **Task** 1:N **ActivityLog**

## Indexes

- `users(email)`: Unique constraint.
- `tasks(user_id)`: For fetching user tasks.
- `tasks(due_date)`: For due date queries/notifications.
- `activity_logs(user_id, created_at)`: For history queries.
