from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

conversation_history = []

def chat_with_memory(message: str) -> str:
    conversation_history.append({
        "role": "user",
        "content": message
    })

    messages = [
        {
            "role": "system",
            "content": (
                "You are an AI influencer with memory. "
                "You remember everything said in this conversation. "
                "You are friendly, persuasive, modern, and engaging. "
                "You promote products authentically and respond to audience comments."
            )
        }
    ] + conversation_history

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages
    )

    ai_response = response.choices[0].message.content

    conversation_history.append({
        "role": "assistant",
        "content": ai_response
    })

    return ai_response

def get_history() -> list:
    return conversation_history

def clear_history():
    conversation_history.clear()