import httpx
import sys
import asyncio

BASE_URL = "http://localhost:8000/api/v1"

async def test_tasks():
    print("Testing Tasks CRUD...")
    email = f"task_user_{sys.argv[1]}@example.com" if len(sys.argv) > 1 else "task_user_auto@example.com"
    password = "password123"
    
    async with httpx.AsyncClient() as client:
        # 1. Login/Register to get token
        print(f"Registering {email}...")
        resp = await client.post(f"{BASE_URL}/auth/register", json={"email": email, "password": password})
        if resp.status_code != 200:
             # Try login if exists
             print("User might exist, trying login...")
             resp = await client.post(f"{BASE_URL}/auth/login", json={"email": email, "password": password})
        
        if resp.status_code != 200:
            print(f"Auth failed: {resp.text}")
            return

        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print(f"Got token: {token[:10]}...")

        # 2. Create Task
        print("Creating task...")
        task_payload = {
            "title": "Test Task 1",
            "description": "This is a test task",
            "priority": "high",
            "completed": False
        }
        create_resp = await client.post(f"{BASE_URL}/tasks/", json=task_payload, headers=headers)
        print(f"Create Task Status: {create_resp.status_code}")
        print(f"Create Task Response: {create_resp.text}")
        
        if create_resp.status_code != 200:
            print("Failed to create task")
            return

        task_id = create_resp.json()["task_id"]
        print(f"Created Task ID: {task_id}")

        # 3. List Tasks
        print("Listing tasks...")
        list_resp = await client.get(f"{BASE_URL}/tasks/", headers=headers)
        print(f"List Tasks Status: {list_resp.status_code}")
        tasks = list_resp.json()
        print(f"Found {len(tasks)} tasks")
        
        found = any(t["task_id"] == task_id for t in tasks)
        if found:
            print("SUCCESS: Created task found in list!")
        else:
            print("FAILURE: Created task NOT found in list!")

if __name__ == "__main__":
    asyncio.run(test_tasks())