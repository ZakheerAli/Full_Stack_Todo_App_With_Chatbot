# NexaFlow

NexaFlow is a full-stack task manager with a conversational assistant. Manage tasks from the dashboard or ask the assistant to create, find, update, or complete them. Conversations are saved with your account.

## Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, and TanStack Query
- **Backend:** FastAPI, SQLModel, and JWT authentication
- **Database:** SQLite for local development and PostgreSQL for hosting
- **Assistant:** Gemini with task-management tools scoped to the signed-in user

## Run locally

Install Python 3.11+, Poetry, and Node.js. Run the backend and frontend in separate terminals.

**Backend**

```sh
cd backend
poetry install --only main --no-root
poetry run uvicorn src.main:app --reload --port 8000
```

Create `backend/.env` using the settings below. Set a random secret and your own Gemini API key.

```dotenv
DATABASE_URL=sqlite+aiosqlite:///./nexaflow.db
SECRET_KEY=replace-with-a-random-secret
GEMINI_API_KEY=replace-with-your-key
```

**Frontend**

```sh
cd frontend
npm ci
npm run dev
```

Open [the app](http://localhost:3000) and register. The [API reference](http://127.0.0.1:8000/docs) is available while FastAPI runs.

## Verification

Run `poetry install --no-root` from `backend` to include test dependencies, then run `poetry run python -m unittest test_chat_integration`. The integration test uses an isolated SQLite database and checks task creation, listing, completion, conversation history after signing in again, and account isolation. Set `NEXAFLOW_TEST_LIVE_AI=1` to run the same flow against Gemini. Run `npm run build` from `frontend` to verify the production build.

## Deployment without Docker

1. Create a Python web service on Render from the `backend` directory. Use `poetry install --only main --no-root` as the build command and `poetry run uvicorn src.main:app --host 0.0.0.0 --port $PORT` as the start command.
2. Set `DATABASE_URL` to a managed PostgreSQL connection URL with the `postgresql+asyncpg://` scheme. Set `SECRET_KEY` and `GEMINI_API_KEY` on the backend.
3. Import the repo into Vercel. Set the root to `frontend` and set `NEXT_PUBLIC_API_URL` to your Render service URL followed by `/api/v1`.
4. Set `CORS_ORIGINS` on Render to a JSON array containing the Vercel origin, for example `["https://your-app.vercel.app"]`. Redeploy and verify registration, task operations, and conversation history on the public URL.

See the [full-stack spec](specs/001-phase-2-full-stack/spec.md) and [chatbot spec](specs/002-phase-3-chatbot/spec.md) for the project requirements.
