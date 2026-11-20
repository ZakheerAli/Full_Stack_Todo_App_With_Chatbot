"""Exercise chat persistence and task operations against an isolated database."""

import os
import unittest
from unittest.mock import patch

import httpx
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlmodel import SQLModel

from src.agents.todo_agent import TodoAgent
from src.core.db import get_session
from src.main import app


class ChatIntegrationTest(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        engine = create_async_engine("sqlite+aiosqlite:///:memory:")
        self.addAsyncCleanup(engine.dispose)
        async with engine.begin() as connection:
            await connection.run_sync(SQLModel.metadata.create_all)

        async def test_session():
            async with AsyncSession(engine, expire_on_commit=False) as session:
                yield session

        app.dependency_overrides[get_session] = test_session
        self.addCleanup(app.dependency_overrides.pop, get_session)
        self.client = httpx.AsyncClient(
            transport=httpx.ASGITransport(app=app), base_url="http://test/api/v1"
        )
        self.addAsyncCleanup(self.client.aclose)

    async def request(self, method, path, **kwargs):
        response = await self.client.request(method, path, **kwargs)
        return response.raise_for_status().json()

    async def test_create_list_complete_and_reopen_conversation(self):
        credentials = {"email": "owner@example.com", "password": "test-password"}
        account = await self.request("POST", "auth/register", json=credentials)
        headers = {"Authorization": f"Bearer {account['access_token']}"}
        conversation_id = None
        commands = {}

        async def scripted_agent(agent, history):
            name, arguments = commands[history[-1].content]
            result = await agent.mcp_server.call_tool(name, arguments)
            return {"content": str(result), "tool_calls": [{"function": {"name": name}}]}

        async def send(message, tool, arguments):
            nonlocal conversation_id
            commands[message] = (tool, arguments)
            reply = await self.request(
                "POST", "chat/", headers=headers,
                json={"message": message, "conversation_id": conversation_id},
            )
            if conversation_id is not None:
                self.assertEqual(reply["conversation_id"], conversation_id)
            conversation_id = reply["conversation_id"]
            self.assertIn(tool, [call["function"]["name"] for call in reply["tool_calls"] or []], reply["response"])
            return reply["response"]

        agent = TodoAgent.run if os.getenv("NEXAFLOW_TEST_LIVE_AI") == "1" else scripted_agent
        with patch.object(TodoAgent, "run", agent):
            await send("Remind me to buy milk", "add_task", {"title": "Buy milk"})
            tasks = await self.request("GET", "tasks/", headers=headers)
            task = next(task for task in tasks if "milk" in task["title"].lower())
            listing = await send("Show my tasks", "list_tasks", {})
            self.assertIn("milk", listing.lower())
            task_id = task["task_id"]
            await send(f"Complete task {task_id}", "complete_task", {"task_id": task_id})
            tasks = await self.request("GET", "tasks/", headers=headers)
            self.assertTrue(next(task for task in tasks if task["task_id"] == task_id)["completed"])

        login = await self.request("POST", "auth/login", json=credentials)
        fresh_headers = {"Authorization": f"Bearer {login['access_token']}"}
        path = f"chat/conversations/{conversation_id}/messages"
        history = await self.request("GET", path, headers=fresh_headers)
        self.assertEqual([message["role"] for message in history], ["user", "assistant"] * 3)
        self.assertEqual(history[0]["content"], "Remind me to buy milk")

        other = await self.request("POST", "auth/register", json={**credentials, "email": "other@example.com"})
        response = await self.client.get(path, headers={"Authorization": f"Bearer {other['access_token']}"})
        self.assertEqual(response.status_code, 404)


if __name__ == "__main__":
    unittest.main()
