import asyncio
import json
from typing import List, Dict, Any, Optional
import google.generativeai as genai
from src.core.config import settings
from src.core.date_utils import get_current_time_context
from src.mcp.server import MCPServer
from src.models.chat import Message

class TodoAgent:
    def __init__(self, mcp_server: MCPServer):
        # Configure Gemini
        self.mcp_server = mcp_server
        self.model_name = "gemini-2.5-flash"

    def _get_system_instruction(self) -> str:
        current_time = get_current_time_context()
        return (
            "You are NexaFlow AI, an intelligent, conversational, and reliable task assistant.\n"
            f"Reference local time: {current_time}.\n\n"
            "Core Responsibilities:\n"
            "1. Manage tasks using the provided MCP tools: add_task, list_tasks, update_task, complete_task, delete_task.\n"
            "2. Natural Date Interpretation: When the user mentions relative dates or times (e.g., 'today', 'tonight', 'tomorrow', 'Friday', 'next Monday', 'in 2 days', 'in 3 hours'), convert them to an ISO 8601 datetime string (YYYY-MM-DDTHH:MM:SS) based on the reference local time above.\n"
            "3. Task Intent & Tool Selection:\n"
            "   - Add Task: If the user wants to add or create a task (e.g. 'Add a task to buy groceries tomorrow', 'Remind me tomorrow to call Ali'), call add_task with title, priority ('high', 'medium', 'low'), and due_date.\n"
            "   - Query/List Tasks: If the user asks what tasks they have, what's pending, what's high priority, or what's due ('What's due tomorrow?', 'Show pending tasks'), call list_tasks with appropriate filters.\n"
            "   - Complete / Update / Delete Task:\n"
            "     * If user provides a UUID, call the tool directly.\n"
            "     * If user refers to a task by title/name (e.g. 'complete my assignment', 'delete grocery task'):\n"
            "       - First call list_tasks(search=...) to inspect matching tasks.\n"
            "       - If exactly 1 matching task is found, proceed to complete_task, update_task, or delete_task with that task's id.\n"
            "       - If multiple matching tasks are found, DO NOT guess or pick randomly. Return a polite, concise clarification asking the user which task they meant.\n"
            "       - If no matching task is found, tell the user clearly that you couldn't find a task with that name.\n\n"
            "Response Guidelines:\n"
            "- Never claim a task was created, changed, completed, or deleted unless the corresponding tool reported success in this turn. For a clear task request, call the tool before responding.\n"
            "- Keep answers concise, natural, warm, and helpful (1-2 sentences max).\n"
            "- Always confirm actions clearly (e.g. 'Done — I added \"Buy groceries\" for tomorrow at 6:00 PM.', 'Done — I marked your Java assignment as completed.').\n"
            "- Never mention technical terms like 'MCP', 'tool_call', 'function_call', 'JSON', 'UUID', or 'database'. Speak directly as a friendly personal assistant."
        )

    def _clean_schema(self, schema: dict) -> dict:
        if not isinstance(schema, dict):
            return schema
        
        allowed_keys = {"type", "properties", "required", "items", "enum", "description"}
        cleaned = {k: v for k, v in schema.items() if k in allowed_keys}
        
        if "type" in cleaned and isinstance(cleaned["type"], str):
            cleaned["type"] = cleaned["type"].upper()
            
        if "properties" in cleaned and isinstance(cleaned["properties"], dict):
            cleaned["properties"] = {
                prop_name: self._clean_schema(prop_val)
                for prop_name, prop_val in cleaned["properties"].items()
            }
            
        if "items" in cleaned and isinstance(cleaned["items"], dict):
            cleaned["items"] = self._clean_schema(cleaned["items"])
            
        return cleaned

    def _get_gemini_tools(self) -> List[Any]:
        """Convert MCP tool definitions to Gemini function declarations."""
        mcp_tools = self.mcp_server.get_tools()
        gemini_tools = []
        
        for tool in mcp_tools:
            func = tool["function"]
            gemini_tools.append({
                "name": func["name"],
                "description": func["description"],
                "parameters": self._clean_schema(func["parameters"])
            })
        gemini_tools.append({
            "name": "reply_without_action",
            "description": "Answer a greeting or ask for clarification when no task tool can be used.",
            "parameters": {
                "type": "OBJECT",
                "properties": {"message": {"type": "STRING"}},
                "required": ["message"],
            },
        })
        return gemini_tools

    async def run(self, messages: List[Message]) -> Dict[str, Any]:
        if not settings.GEMINI_API_KEY:
            raise RuntimeError("GEMINI_API_KEY is missing")
        genai.configure(api_key=settings.GEMINI_API_KEY, transport="rest")
        # Initialize Gemini Model with dynamic system instructions and tools
        system_instruction = self._get_system_instruction()
        model = genai.GenerativeModel(
            model_name=self.model_name,
            system_instruction=system_instruction,
            tools=self._get_gemini_tools(),
            generation_config={"temperature": 0},
        )

        # Convert history to Gemini format (ignoring system/empty parts)
        chat_history = []
        for msg in messages[:-1]: # All but the last one
            role = "user" if msg.role == "user" else "model"
            content = msg.content if msg.content else " "
            chat_history.append({"role": role, "parts": [content]})

        # Start a chat session
        chat = model.start_chat(history=chat_history)
        
        # Send the latest user message
        last_message = messages[-1].content
        request_options = {"timeout": 30, "retry": None}
        response = await asyncio.to_thread(
            chat.send_message,
            last_message,
            tool_config={"function_calling_config": {"mode": "ANY"}},
            request_options=request_options,
        )
        
        tool_calls_result = []
        final_content = ""
        max_turns = 5
        turn = 0

        while turn < max_turns:
            turn += 1
            if not response.candidates or not response.candidates[0].content:
                break
                
            candidate = response.candidates[0]
            parts = candidate.content.parts
            
            # Check for function calls
            function_calls = [p.function_call for p in parts if p.function_call]
            
            if not function_calls:
                # No more function calls, collect text parts
                text_parts = [p.text for p in parts if p.text]
                if text_parts:
                    final_content = "".join(text_parts).strip()
                break
                
            # Process function calls
            function_responses = []
            for func_call in function_calls:
                func_name = func_call.name
                func_args = {k: v for k, v in func_call.args.items()}
                if func_name == "reply_without_action":
                    return {
                        "content": func_args["message"],
                        "tool_calls": tool_calls_result or None,
                    }
                
                try:
                    tool_result = await self.mcp_server.call_tool(func_name, func_args)
                except Exception as err:
                    tool_result = {"status": "error", "message": str(err)}
                    
                if not isinstance(tool_result, dict):
                    tool_result = {"result": tool_result}
                    
                tool_calls_result.append({
                    "id": f"call_{func_name}",
                    "type": "function",
                    "function": {
                        "name": func_name,
                        "arguments": json.dumps(func_args)
                    }
                })
                
                function_responses.append(
                    genai.protos.Part(
                        function_response=genai.protos.FunctionResponse(
                            name=func_name,
                            response=tool_result
                        )
                    )
                )
                
            # Send function responses back to Gemini
            response = await asyncio.to_thread(
                chat.send_message,
                genai.protos.Content(
                    role="user",
                    parts=function_responses
                ),
                request_options=request_options,
            )

        if not final_content:
            try:
                final_content = response.text.strip()
            except Exception:
                final_content = "I couldn't generate a reply. Check your task list before retrying."

        return {
            "role": "assistant",
            "content": final_content,
            "tool_calls": tool_calls_result if tool_calls_result else None
        }
