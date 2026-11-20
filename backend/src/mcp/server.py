import os
from typing import Optional, List, Any, Tuple
from uuid import UUID
from pydantic import BaseModel, Field
from src.services.task_service import TaskService
from src.models.task import Task, TaskBase, TaskUpdate, Priority
from src.core.date_utils import parse_due_date
from sqlalchemy.ext.asyncio import AsyncSession

# Helper for priority sanitization
def sanitize_priority(p: Optional[str]) -> Priority:
    if not p:
        return Priority.medium
    p_lower = str(p).lower().strip()
    if p_lower in ("high", "urgent", "important"):
        return Priority.high
    elif p_lower in ("low", "minor"):
        return Priority.low
    return Priority.medium

def parse_uuid_safely(val: Any) -> Optional[UUID]:
    try:
        return UUID(str(val).strip())
    except (ValueError, TypeError, AttributeError):
        return None

# Define schemas for tool inputs
class AddTaskInput(BaseModel):
    title: str = Field(description="The title of the task to create")
    description: Optional[str] = Field(None, description="Optional description of the task")
    priority: Optional[str] = Field("medium", description="Task priority: 'high', 'medium', or 'low'")
    due_date: Optional[str] = Field(None, description="Due date/time in ISO format (YYYY-MM-DDTHH:MM:SS) or relative expression (e.g. 'tomorrow', 'Friday', 'next Monday')")

class ListTasksInput(BaseModel):
    status: Optional[str] = Field(None, description="Filter by status: 'pending', 'completed', or 'all'")
    priority: Optional[str] = Field(None, description="Filter by priority: 'high', 'medium', or 'low'")
    search: Optional[str] = Field(None, description="Search keyword matching task title or description")

class UpdateTaskInput(BaseModel):
    task_id: str = Field(description="The UUID or title of the task to update")
    title: Optional[str] = Field(None, description="New title for the task")
    description: Optional[str] = Field(None, description="New description for the task")
    priority: Optional[str] = Field(None, description="New priority: 'high', 'medium', or 'low'")
    due_date: Optional[str] = Field(None, description="New due date in ISO format or relative string")
    completed: Optional[bool] = Field(None, description="Set completion status (true/false)")

class DeleteTaskInput(BaseModel):
    task_id: str = Field(description="The UUID or title of the task to delete")

class CompleteTaskInput(BaseModel):
    task_id: str = Field(description="The UUID or title of the task to mark as completed")

class MCPServer:
    def __init__(self, session: AsyncSession, user_id: UUID):
        self.task_service = TaskService(session)
        self.user_id = user_id

    async def _resolve_task(self, task_identifier: str) -> Tuple[Optional[Task], Optional[dict]]:
        """
        Resolves a task by either its UUID or by title search.
        Safely enforces user ownership and handles ambiguous or missing tasks.
        """
        if not task_identifier or not str(task_identifier).strip():
            return None, {"status": "error", "message": "No task identifier provided."}

        ident_str = str(task_identifier).strip()
        parsed_uuid = parse_uuid_safely(ident_str)

        # 1. If it's a valid UUID, look up directly
        if parsed_uuid:
            task = await self.task_service.get_task(parsed_uuid, self.user_id)
            if task:
                return task, None
            return None, {
                "status": "not_found",
                "message": f"Task with ID '{ident_str}' was not found in your list."
            }

        # 2. If it's not a UUID, search user's active tasks by title
        all_tasks = await self.task_service.get_tasks(user_id=self.user_id, limit=100)
        query = ident_str.lower()

        # Check for exact case-insensitive match first
        exact_matches = [t for t in all_tasks if t.title.lower().strip() == query]
        if len(exact_matches) == 1:
            return exact_matches[0], None

        # Check for substring matches
        sub_matches = [t for t in all_tasks if query in t.title.lower()]
        if len(sub_matches) == 1:
            return sub_matches[0], None
        elif len(sub_matches) > 1:
            titles = [f"'{t.title}'" for t in sub_matches[:5]]
            return None, {
                "status": "ambiguous",
                "message": f"I found {len(sub_matches)} tasks matching '{ident_str}': {', '.join(titles)}. Please clarify which one you mean."
            }

        return None, {
            "status": "not_found",
            "message": f"I couldn't find any task matching '{ident_str}' in your list."
        }

    async def add_task(
        self, 
        title: str, 
        description: Optional[str] = None, 
        priority: Optional[str] = "medium", 
        due_date: Optional[str] = None
    ) -> dict:
        if not title or not title.strip():
            return {"status": "error", "message": "Task title cannot be empty."}

        p = sanitize_priority(priority)
        d = parse_due_date(due_date)

        task_in = TaskBase(
            title=title.strip(),
            description=description.strip() if description else None,
            priority=p,
            due_date=d
        )
        task = await self.task_service.create_task(task_in, self.user_id)
        return {
            "task_id": str(task.task_id),
            "status": "created",
            "title": task.title,
            "priority": task.priority,
            "due_date": task.due_date.isoformat() if task.due_date else None
        }

    async def list_tasks(
        self, 
        status: Optional[str] = None, 
        priority: Optional[str] = None, 
        search: Optional[str] = None
    ) -> List[dict]:
        is_completed = None
        if status:
            s = status.lower().strip()
            if s in ("completed", "done", "true"):
                is_completed = True
            elif s in ("pending", "active", "todo", "incomplete", "false"):
                is_completed = False

        p_filter = None
        if priority and priority.lower().strip() in ("high", "medium", "low"):
            p_filter = Priority(priority.lower().strip())

        tasks = await self.task_service.get_tasks(
            user_id=self.user_id,
            status=is_completed,
            priority=p_filter,
            search=search.strip() if search else None
        )
        return [
            {
                "id": str(t.task_id),
                "title": t.title,
                "description": t.description,
                "completed": t.completed,
                "priority": t.priority,
                "due_date": t.due_date.isoformat() if t.due_date else None
            } for t in tasks
        ]

    async def update_task(self, task_id: str, **kwargs) -> dict:
        task, err = await self._resolve_task(task_id)
        if err:
            return err

        if "due_date" in kwargs and kwargs["due_date"] is not None:
            kwargs["due_date"] = parse_due_date(kwargs["due_date"])
        if "priority" in kwargs and kwargs["priority"] is not None:
            kwargs["priority"] = sanitize_priority(kwargs["priority"])

        task_update = TaskUpdate(**kwargs)
        updated_task = await self.task_service.update_task(task.task_id, self.user_id, task_update)
        return {
            "task_id": str(updated_task.task_id),
            "status": "updated",
            "title": updated_task.title
        }

    async def delete_task(self, task_id: str) -> dict:
        task, err = await self._resolve_task(task_id)
        if err:
            return err

        await self.task_service.delete_task(task.task_id, self.user_id)
        return {
            "task_id": str(task.task_id),
            "status": "deleted",
            "title": task.title
        }

    async def complete_task(self, task_id: str) -> dict:
        task, err = await self._resolve_task(task_id)
        if err:
            return err

        task_update = TaskUpdate(completed=True)
        updated_task = await self.task_service.update_task(task.task_id, self.user_id, task_update)
        return {
            "task_id": str(updated_task.task_id),
            "status": "completed",
            "title": updated_task.title
        }

    def get_tools(self) -> List[dict]:
        """Returns the tool definitions for the Gemini Agent."""
        return [
            {
                "type": "function",
                "function": {
                    "name": "add_task",
                    "description": "Create a new task in the user's todo list with optional due date and priority",
                    "parameters": AddTaskInput.model_json_schema()
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "list_tasks",
                    "description": "Retrieve and filter tasks from the user's todo list by status, priority, or search term",
                    "parameters": ListTasksInput.model_json_schema()
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "update_task",
                    "description": "Modify an existing task's title, description, priority, due date, or completion status",
                    "parameters": UpdateTaskInput.model_json_schema()
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "delete_task",
                    "description": "Permanently remove a task from the user's todo list",
                    "parameters": DeleteTaskInput.model_json_schema()
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "complete_task",
                    "description": "Mark a specific task as completed in the user's todo list",
                    "parameters": CompleteTaskInput.model_json_schema()
                }
            }
        ]

    async def call_tool(self, name: str, arguments: dict) -> Any:
        """Dispatches tool calls to the appropriate methods."""
        if name == "add_task":
            return await self.add_task(**arguments)
        elif name == "list_tasks":
            return await self.list_tasks(**arguments)
        elif name == "update_task":
            return await self.update_task(**arguments)
        elif name == "delete_task":
            return await self.delete_task(**arguments)
        elif name == "complete_task":
            return await self.complete_task(**arguments)
        else:
            raise ValueError(f"Unknown tool: {name}")
