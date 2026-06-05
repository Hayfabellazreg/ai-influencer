from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from app.ai.openai_service import generate_response
from app.ai.sentiment_service import analyze_sentiment
from app.ai.memory_service import chat_with_memory, get_history, clear_history
from app.ai.analytics_service import get_analytics
from app.websocket_handler import websocket_endpoint

app = FastAPI(title="AI Influencer API")

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def home():
    return {"status": "AI Influencer backend running"}

@app.post("/chat")
def chat(request: ChatRequest):
    ai_response = generate_response(request.message)
    return {"response": ai_response}

@app.post("/analyze")
def analyze(request: ChatRequest):
    result = analyze_sentiment(request.message)
    return result

@app.post("/memory/chat")
def memory_chat(request: ChatRequest):
    ai_response = chat_with_memory(request.message)
    return {"response": ai_response}

@app.get("/memory/history")
def memory_history():
    return {"history": get_history()}

@app.delete("/memory/clear")
def memory_clear():
    clear_history()
    return {"status": "history cleared"}

@app.get("/analytics")
def analytics():
    result = get_analytics()
    return result

@app.websocket("/ws")
async def websocket_route(websocket: WebSocket):
    await websocket_endpoint(websocket)