from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyze_sentiment(message: str) -> dict:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a sentiment analysis engine. "
                    "Analyze the message and respond ONLY with a JSON object like this: "
                    '{"sentiment": "positive", "score": 0.95, "intent": "compliment"} '
                    "Sentiment must be one of: positive, negative, neutral, question. "
                    "Score is between 0 and 1. "
                    "Intent must be one of: compliment, complaint, question, spam, purchase_intent. "
                    "Respond with JSON only, no extra text."
                )
            },
            {
                "role": "user",
                "content": message
            }
        ]
    )

    import json
    raw = response.choices[0].message.content.strip()
    return json.loads(raw)