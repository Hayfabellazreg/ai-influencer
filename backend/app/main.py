from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from app.ai.openai_service import generate_response
from app.ai.sentiment_service import analyze_sentiment
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

@app.websocket("/ws")
async def websocket_route(websocket: WebSocket):
    await websocket_endpoint(websocket)