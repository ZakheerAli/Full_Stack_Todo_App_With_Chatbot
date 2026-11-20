import httpx
import sys
import asyncio
from uuid import UUID

BASE_URL = "http://localhost:8000/api/v1"

async def test_chat():
    print("Testing Chatbot integration...")
    email = f"chat_user_{sys.argv[1]}@example.com" if len(sys.argv) > 1 else "chat_user_auto@example.com"
    password = "password123"
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        # 1. Register/Login to get token
        print(f"Registering/Logging in {email}...")
        resp = await client.post(f"{BASE_URL}/auth/register", json={"email": email, "password": password})
        if resp.status_code != 200:
             print("User might exist, trying login...")
             resp = await client.post(f"{BASE_URL}/auth/login", json={"email": email, "password": password})
        
        if resp.status_code != 200:
            print(f"Auth failed: {resp.text}")
            return

        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print(f"Got token: {token[:10]}...")

        # 2. Start conversation & create task via chat
        print("\n--- Sending message to add task ---")
        chat_payload = {
            "message": "Add a task to buy groceries",
            "conversation_id": None
        }
        chat_resp = await client.post(f"{BASE_URL}/chat/", json=chat_payload, headers=headers)
        print(f"Chat Status: {chat_resp.status_code}")
        
        if chat_resp.status_code != 200:
            print("Chat request failed.")
            return

        chat_data = chat_resp.json()
        conversation_id = chat_data["conversation_id"]
        print(f"Conversation ID: {conversation_id}")
        print(f"Agent Response: {chat_data['response']}")
        print(f"Tool Calls: {chat_data['tool_calls']}")

        # 3. Retrieve task ID from DB via tasks API
        print("\n--- Fetching task ID via Tasks API ---")
        tasks_resp = await client.get(f"{BASE_URL}/tasks/", headers=headers)
        tasks = tasks_resp.json()
        print(f"Current tasks: {tasks}")
        if not tasks:
            print("No tasks found. Agent might have failed to call tool.")
            return
            
        task_id = tasks[0]["task_id"]
        print(f"Target Task ID: {task_id}")

        # 4. Update task via chat
        print("\n--- Sending message to update task ---")
        print("Waiting 20 seconds to avoid Gemini rate limits...")
        await asyncio.sleep(20)
        chat_payload = {
            "message": f"Change task {task_id} title to 'buy fresh apples'",
            "conversation_id": conversation_id
        }
        chat_resp = await client.post(f"{BASE_URL}/chat/", json=chat_payload, headers=headers)
        print(f"Update Chat Status: {chat_resp.status_code}")
        print(f"Agent Response: {chat_resp.json()['response']}")

        # Verify update
        tasks_resp = await client.get(f"{BASE_URL}/tasks/", headers=headers)
        print(f"Tasks after update: {tasks_resp.json()}")

        # 5. Complete task via chat
        print("\n--- Sending message to complete task ---")
        print("Waiting 20 seconds to avoid Gemini rate limits...")
        await asyncio.sleep(20)
        chat_payload = {
            "message": f"Mark task {task_id} as complete",
            "conversation_id": conversation_id
        }
        chat_resp = await client.post(f"{BASE_URL}/chat/", json=chat_payload, headers=headers)
        print(f"Complete Chat Status: {chat_resp.status_code}")
        print(f"Agent Response: {chat_resp.json()['response']}")

        # Verify completion
        tasks_resp = await client.get(f"{BASE_URL}/tasks/", headers=headers)
        print(f"Tasks after completion: {tasks_resp.json()}")

        # 6. Delete task via chat
        print("\n--- Sending message to delete task ---")
        print("Waiting 20 seconds to avoid Gemini rate limits...")
        await asyncio.sleep(20)
        chat_payload = {
            "message": f"Delete task {task_id}",
            "conversation_id": conversation_id
        }
        chat_resp = await client.post(f"{BASE_URL}/chat/", json=chat_payload, headers=headers)
        print(f"Delete Chat Status: {chat_resp.status_code}")
        print(f"Agent Response: {chat_resp.json()['response']}")

        # Verify deletion
        tasks_resp = await client.get(f"{BASE_URL}/tasks/", headers=headers)
        print(f"Tasks after deletion: {tasks_resp.json()}")

        # 7. Verify conversation history persistence
        print("\n--- Verifying conversation messages history ---")
        history_resp = await client.get(f"{BASE_URL}/chat/conversations/{conversation_id}/messages", headers=headers)
        print(f"History Status: {history_resp.status_code}")
        messages = history_resp.json()
        print(f"Found {len(messages)} messages in history:")
        for msg in messages:
            print(f"  [{msg['role'].upper()}]: {msg['content'][:100]}... (Tool Calls: {msg.get('tool_calls')})")

if __name__ == "__main__":
    asyncio.run(test_chat())
