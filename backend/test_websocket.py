import asyncio
import websockets

async def test():
    uri = "ws://127.0.0.1:8000/ws"
    async with websockets.connect(uri) as websocket:
        comments = [
            "This product is amazing!",
            "How much does it cost?",
            "I love your content!"
        ]
        for comment in comments:
            print(f"\nComment: {comment}")
            await websocket.send(comment)
            response = await websocket.recv()
            print(f"AI Response: {response}")

asyncio.run(test())