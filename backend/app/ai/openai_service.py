from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_response(message: str) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an AI influencer. "
                    "You are friendly, persuasive, modern, and engaging. "
                    "You promote products authentically and respond to audience comments."
                )
            },
            {
                "role": "user",
                "content": message
            }
        ]
    )
    return response.choices[0].message.content