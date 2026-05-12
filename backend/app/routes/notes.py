from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from bson import ObjectId
from ..database import db
from ..schemas.note_schema import NoteCreate, NoteOut, NoteUpdate
from ..middleware.auth_middleware import get_current_user
from collections import Counter

router = APIRouter(prefix="/api/notes", tags=["notes"])

# --- Analytics Route (Must be BEFORE /{note_id}) ---
@router.get("/analytics")
async def get_analytics(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    # Get all notes for user
    notes_cursor = db.notes.find({"user_id": user_id})
    notes = await notes_cursor.to_list(length=1000)
    
    total_notes = len(notes)
    if total_notes == 0:
        return {
            "total_notes": 0,
            "total_tasks": 0,
            "sentiment_distribution": {},
            "topic_distribution": {},
            "total_recordings": 0
        }
    
    # Sentiment distribution
    sentiments = [n.get("sentiment", "Neutral") for n in notes]
    sentiment_counts = Counter(sentiments)
    
    # Topic distribution
    topics = [n.get("topic", "General") for n in notes]
    topic_counts = Counter(topics)
    
    # Total tasks
    total_tasks = sum([len(n.get("tasks", [])) for n in notes])
    
    return {
        "total_notes": total_notes,
        "total_tasks": total_tasks,
        "sentiment_distribution": dict(sentiment_counts),
        "topic_distribution": dict(topic_counts),
        "total_recordings": total_notes
    }

# --- Standard Notes Routes ---

@router.get("/", response_model=List[NoteOut])
async def get_notes(current_user: dict = Depends(get_current_user)):
    notes_cursor = db.notes.find({"user_id": str(current_user["_id"])}).sort("created_at", -1)
    notes = await notes_cursor.to_list(length=100)
    for note in notes:
        note["_id"] = str(note["_id"])
    return notes

@router.post("/", response_model=NoteOut)
async def create_note(note_in: NoteCreate, current_user: dict = Depends(get_current_user)):
    note_dict = note_in.dict()
    note_dict["user_id"] = str(current_user["_id"])
    note_dict["created_at"] = datetime.utcnow()
    note_dict["is_favorite"] = note_dict.get("is_favorite", False)
    
    result = await db.notes.insert_one(note_dict)
    note_dict["_id"] = str(result.inserted_id)
    return note_dict

@router.get("/{note_id}", response_model=NoteOut)
async def get_note(note_id: str, current_user: dict = Depends(get_current_user)):
    # Validate ObjectId
    if not ObjectId.is_valid(note_id):
        raise HTTPException(status_code=400, detail="Invalid note ID format")
        
    note = await db.notes.find_one({"_id": ObjectId(note_id), "user_id": str(current_user["_id"])})
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    note["_id"] = str(note["_id"])
    return note

@router.put("/{note_id}", response_model=NoteOut)
async def update_note(note_id: str, note_update: NoteUpdate, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(note_id):
        raise HTTPException(status_code=400, detail="Invalid note ID format")
        
    update_data = {k: v for k, v in note_update.dict().items() if v is not None}
    
    result = await db.notes.find_one_and_update(
        {"_id": ObjectId(note_id), "user_id": str(current_user["_id"])},
        {"$set": update_data},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Note not found")
    
    result["_id"] = str(result["_id"])
    return result

@router.delete("/{note_id}")
async def delete_note(note_id: str, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(note_id):
        raise HTTPException(status_code=400, detail="Invalid note ID format")
        
    result = await db.notes.delete_one({"_id": ObjectId(note_id), "user_id": str(current_user["_id"])})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"message": "Note deleted successfully"}
