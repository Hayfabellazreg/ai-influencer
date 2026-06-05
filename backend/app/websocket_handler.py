from fastapi import WebSocket, WebSocketDisconnect
from app.ai.openai_service import generate_response

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

manager = ConnectionManager()

async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            comment = await websocket.receive_text()
            ai_response = generate_response(comment)
            await manager.send_message(ai_response, websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)