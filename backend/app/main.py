from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from app.ai.openai_service import generate_response
from app.ai.sentiment_service import analyze_sentiment
from app.ai.memory_service import chat_with_memory, get_history, clear_history
from app.ai.analytics_service import get_analytics
from app.ai.leads_service import process_comment, get_hot_leads, clear_leads
from app.websocket_handler import websocket_endpoint

app = FastAPI(title="AI Influencer API")

class ChatRequest(BaseModel):
    message: str

class CommentRequest(BaseModel):
    message: str
    username: str = "anonymous"

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

@app.post("/leads/process")
def leads_process(request: CommentRequest):
    result = process_comment(request.message, request.username)
    return result

@app.get("/leads/hot")
def leads_hot():
    return {"leads": get_hot_leads()}

@app.delete("/leads/clear")
def leads_clear():
    clear_leads()
    return {"status": "leads cleared"}

@app.websocket("/ws")
async def websocket_route(websocket: WebSocket):
    await websocket_endpoint(websocket)