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
                    "You are a sentiment and purchase intent analysis engine. "
                    "Analyze the message and respond ONLY with a JSON object like this: "
                    '{"sentiment": "positive", "score": 0.95, "intent": "purchase_intent", "purchase_score": 87, "cta": "DM me for the link!"} '
                    "sentiment: positive, negative, neutral, question. "
                    "score: 0 to 1. "
                    "intent: compliment, complaint, question, spam, purchase_intent. "
                    "purchase_score: 0 to 100 — how likely this person wants to buy. "
                    "cta: if purchase_score > 50, suggest a short CTA reply the creator can use. Otherwise empty string. "
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