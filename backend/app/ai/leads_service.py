from app.ai.sentiment_service import analyze_sentiment

hot_leads = []

def process_comment(message: str, username: str = "anonymous") -> dict:
    analysis = analyze_sentiment(message)
    
    lead = {
        "username": username,
        "message": message,
        "sentiment": analysis.get("sentiment"),
        "intent": analysis.get("intent"),
        "purchase_score": analysis.get("purchase_score", 0),
        "cta": analysis.get("cta", ""),
        "is_hot_lead": analysis.get("purchase_score", 0) >= 50
    }
    
    if lead["is_hot_lead"]:
        hot_leads.append(lead)
        hot_leads.sort(key=lambda x: x["purchase_score"], reverse=True)
    
    return lead

def get_hot_leads() -> list:
    return hot_leads

def clear_leads():
    hot_leads.clear()