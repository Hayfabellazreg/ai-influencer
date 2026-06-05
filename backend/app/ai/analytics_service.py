from app.ai.memory_service import get_history
from app.ai.sentiment_service import analyze_sentiment

def get_analytics() -> dict:
    history = get_history()

    if not history:
        return {
            "total_messages": 0,
            "user_messages": 0,
            "ai_messages": 0,
            "sentiment_breakdown": {},
            "intent_breakdown": {},
            "engagement_score": 0
        }

    user_messages = [m for m in history if m["role"] == "user"]
    ai_messages = [m for m in history if m["role"] == "assistant"]

    sentiment_breakdown = {"positive": 0, "negative": 0, "neutral": 0, "question": 0}
    intent_breakdown = {"compliment": 0, "complaint": 0, "question": 0, "spam": 0, "purchase_intent": 0}

    for msg in user_messages:
        try:
            result = analyze_sentiment(msg["content"])
            sentiment = result.get("sentiment", "neutral")
            intent = result.get("intent", "question")
            if sentiment in sentiment_breakdown:
                sentiment_breakdown[sentiment] += 1
            if intent in intent_breakdown:
                intent_breakdown[intent] += 1
        except:
            pass

    positive = sentiment_breakdown.get("positive", 0)
    total = len(user_messages) if user_messages else 1
    engagement_score = round((positive / total) * 100, 2)

    return {
        "total_messages": len(history),
        "user_messages": len(user_messages),
        "ai_messages": len(ai_messages),
        "sentiment_breakdown": sentiment_breakdown,
        "intent_breakdown": intent_breakdown,
        "engagement_score": engagement_score
    }