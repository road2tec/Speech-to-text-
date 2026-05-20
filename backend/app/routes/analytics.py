from fastapi import APIRouter, Depends
from ..database import db
from ..middleware.auth_middleware import get_current_user
from collections import Counter

router = APIRouter(prefix="/api/notes/analytics", tags=["analytics"])

@router.get("/")
async def get_analytics(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    # Get all notes for user
    notes_cursor = db.notes.find({"user_id": user_id})
    notes = await notes_cursor.to_list(length=1000)
    
    total_notes = len(notes)
    
    # Sentiment distribution
    sentiments = [n.get("sentiment", "Neutral") for n in notes]
    sentiment_counts = Counter(sentiments)
    
    # Topic distribution
    topics = [n.get("topic", "General") for n in notes]
    topic_counts = Counter(topics)

    # Emotion distribution
    emotions = [n.get("emotion", "Neutral") for n in notes]
    emotion_counts = Counter(emotions)
    
    # Total tasks
    total_tasks = sum([len(n.get("tasks", [])) for n in notes])
    
    # Weekly activity (mocking for now or extract from createdAt)
    # In a real app, you'd group by date
    
    return {
        "total_notes": total_notes,
        "total_tasks": total_tasks,
        "sentiment_distribution": dict(sentiment_counts),
        "topic_distribution": dict(topic_counts),
        "emotion_distribution": dict(emotion_counts),
        "total_recordings": total_notes # Assuming 1-to-1 for now
    }
