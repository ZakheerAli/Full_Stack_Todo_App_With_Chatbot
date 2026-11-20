import httpx
import asyncio

BASE_URL = "http://127.0.0.1:8000/api/v1"

async def test_ambiguity_only():
    email = "phase3_ambiguity_verify@example.com"
    password = "password123"

    async with httpx.AsyncClient(timeout=60.0) as client:
        # Register/login
        resp = await client.post(f"{BASE_URL}/auth/register", json={"email": email, "password": password})
        if resp.status_code != 200:
            resp = await client.post(f"{BASE_URL}/auth/login", json={"email": email, "password": password})
        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Add two similar tasks
        await client.post(f"{BASE_URL}/tasks/", json={"title": "Prepare Marketing budget"}, headers=headers)
        await client.post(f"{BASE_URL}/tasks/", json={"title": "Prepare Sales budget"}, headers=headers)
        print("Created two similar tasks.")

        # Ask to complete ambiguous task
        print("Sending prompt: 'Complete my budget task'")
        chat_resp = await client.post(f"{BASE_URL}/chat/", json={"message": "Complete my budget task"}, headers=headers)
        print("Chat status:", chat_resp.status_code)
        data = chat_resp.json()
        print("AI Response:", data["response"])

if __name__ == "__main__":
    asyncio.run(test_ambiguity_only())
