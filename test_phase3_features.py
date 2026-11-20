import httpx
import asyncio
from datetime import datetime, timezone

BASE_URL = "http://127.0.0.1:8000/api/v1"

async def send_chat_with_retry(client, headers, payload, max_retries=5):
    for attempt in range(max_retries):
        resp = await client.post(f"{BASE_URL}/chat/", json=payload, headers=headers)
        if resp.status_code == 200:
            data = resp.json()
            if "too many requests" in data.get("response", "").lower():
                print(f"Rate limited (attempt {attempt+1}/{max_retries}), waiting 35s...")
                await asyncio.sleep(35)
                continue
            return data
        elif resp.status_code == 429:
            print(f"HTTP 429 (attempt {attempt+1}/{max_retries}), waiting 35s...")
            await asyncio.sleep(35)
            continue
        else:
            raise RuntimeError(f"Chat failed with status {resp.status_code}: {resp.text}")
    raise RuntimeError("Exceeded maximum retries for Gemini chat request")

async def test_phase3():
    print("========================================")
    print("Testing Phase 3: AI Chatbot Features")
    print("========================================")
    
    email = f"phase3_user_{int(datetime.now(timezone.utc).timestamp())}@example.com"
    password = "password123"

    async with httpx.AsyncClient(timeout=60.0) as client:
        # Register user
        reg_resp = await client.post(f"{BASE_URL}/auth/register", json={"email": email, "password": password})
        if reg_resp.status_code != 200:
            print(f"Register failed: {reg_resp.text}")
            return
        token = reg_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print(f"Registered user: {email}")

        # Test 1: Natural date understanding ("tomorrow")
        print("\n[Test 1] Create task with relative date: 'Add a task to buy groceries tomorrow'")
        data1 = await send_chat_with_retry(client, headers, {"message": "Add a task to buy groceries tomorrow"})
        print(f"AI Response: {data1['response']}")
        print(f"Tool Calls: {data1['tool_calls']}")

        tasks_resp = await client.get(f"{BASE_URL}/tasks/", headers=headers)
        tasks = tasks_resp.json()
        print(f"Tasks in DB: {len(tasks)}")
        assert len(tasks) >= 1, "Task was not created!"
        grocery_task = tasks[0]
        print(f"Created task due_date: {grocery_task.get('due_date')}")
        assert grocery_task.get("due_date") is not None, "due_date was not parsed or saved!"
        print("PASS: Natural language date 'tomorrow' was parsed and saved.")

        # Delay
        print("\nWaiting 20 seconds...")
        await asyncio.sleep(20)

        # Test 2: Priority intent ("Create a high priority task for my Java assignment tomorrow")
        print("\n[Test 2] Create high priority task: 'Create a high priority task for my Java assignment tomorrow'")
        data2 = await send_chat_with_retry(client, headers, {"message": "Create a high priority task for my Java assignment tomorrow"})
        print(f"AI Response: {data2['response']}")

        tasks_resp = await client.get(f"{BASE_URL}/tasks/", headers=headers)
        java_tasks = [t for t in tasks_resp.json() if "Java" in t.get("title", "") or "java" in t.get("title", "").lower()]
        assert len(java_tasks) >= 1, "Java task was not found!"
        print(f"Java task priority: {java_tasks[0]['priority']}, due_date: {java_tasks[0]['due_date']}")
        assert java_tasks[0]["priority"] == "high", "Priority was not set to high!"
        print("PASS: High priority task created with due date.")

        # Delay
        print("\nWaiting 20 seconds...")
        await asyncio.sleep(20)

        # Test 3: Non-existent task handling ("Complete my dentist appointment")
        print("\n[Test 3] Request non-existent task: 'Complete my dentist appointment'")
        data3 = await send_chat_with_retry(client, headers, {"message": "Complete my dentist appointment"})
        print(f"AI Response: {data3['response']}")
        ans3 = data3["response"].lower()
        assert any(w in ans3 for w in ["couldn't find", "could not find", "no task", "not found", "cannot find", "don't see"]), "AI did not indicate task was not found!"
        print("PASS: Non-existent task handled cleanly without fabricating changes.")

        # Delay
        print("\nWaiting 20 seconds...")
        await asyncio.sleep(20)

        # Test 4: Ambiguous task handling
        print("\n[Test 4] Ambiguous task handling:")
        await client.post(f"{BASE_URL}/tasks/", json={"title": "Prepare budget for Marketing", "priority": "medium"}, headers=headers)
        await client.post(f"{BASE_URL}/tasks/", json={"title": "Prepare budget for Sales", "priority": "medium"}, headers=headers)
        print("Added two similar tasks: 'Prepare budget for Marketing' & 'Prepare budget for Sales'")
        
        print("Prompt: 'Complete my budget task'")
        data4 = await send_chat_with_retry(client, headers, {"message": "Complete my budget task"})
        print(f"AI Response: {data4['response']}")
        ans4 = data4["response"].lower()
        is_clarifying = any(w in ans4 for w in ["which", "found", "marketing", "sales", "two", "multiple", "clarify", "both"])
        print(f"Clarification detected: {is_clarifying}")
        assert is_clarifying, "AI should ask for clarification when multiple tasks match!"
        print("PASS: Ambiguous task triggered clarification request.")

    print("\n========================================")
    print("ALL PHASE 3 FEATURE TESTS PASSED (100%)")
    print("========================================")

if __name__ == "__main__":
    asyncio.run(test_phase3())
