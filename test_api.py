import httpx
import sys
import asyncio

BASE_URL = "http://localhost:8000/api/v1"

async def test_auth():
    print("Testing Auth...")
    email = f"test_{sys.argv[1]}@example.com" if len(sys.argv) > 1 else "test_auto@example.com"
    payload = {
        "email": email,
        "password": "password123"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            # Register
            print(f"Registering {email}...")
            resp = await client.post(f"{BASE_URL}/auth/register", json=payload)
            print(f"Register Status: {resp.status_code}")
            print(f"Register Response: {resp.text}")
            
            # Login
            print("Logging in...")
            login_resp = await client.post(f"{BASE_URL}/auth/login", json=payload)
            print(f"Login Status: {login_resp.status_code}")
            print(f"Login Response: {login_resp.text}")

            if login_resp.status_code == 200:
                return login_resp.json()
        except Exception as e:
            print(f"Auth failed: {e}")
            return None

if __name__ == "__main__":
    import asyncio
    token = asyncio.run(test_auth())
    if token:
        print("Auth successful!")