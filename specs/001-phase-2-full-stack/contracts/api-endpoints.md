# API Endpoints: Phase 2

## Authentication (Better Auth)
*Managed via Better Auth library routes (typically `/api/auth/*`)*

- `POST /api/auth/sign-up`: Register new user
- `POST /api/auth/sign-in`: Login
- `POST /api/auth/sign-out`: Logout
- `GET /api/auth/session`: Get current session

## Tasks (`/api/tasks`)

### GET /api/tasks
- **Description**: List all tasks for current user.
- **Query Params**:
  - `limit` (int, default 50)
  - `offset` (int, default 0)
  - `status` (completed|pending)
  - `priority` (high|medium|low)
  - `search` (string)
- **Response**: `200 OK` List[Task]

### POST /api/tasks
- **Description**: Create a new task.
- **Body**: `{ title, description?, priority?, due_date? }`
- **Response**: `201 Created` Task

### GET /api/tasks/{id}
- **Description**: Get single task details.
- **Response**: `200 OK` Task or `404 Not Found`

### PATCH /api/tasks/{id}
- **Description**: Update task fields.
- **Body**: `{ title?, description?, priority?, due_date?, completed? }`
- **Response**: `200 OK` Task

### DELETE /api/tasks/{id}
- **Description**: Soft delete a task.
- **Response**: `204 No Content`

## Activity (`/api/activity`)

### GET /api/activity
- **Description**: Get activity log for current user.
- **Query Params**: `limit`, `offset`
- **Response**: `200 OK` List[ActivityLog]
