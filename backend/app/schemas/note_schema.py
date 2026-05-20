from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class NoteBase(BaseModel):
    title: str
    transcript: str
    summary: Optional[str] = None
    keywords: List[str] = []
    sentiment: Optional[str] = None
    emotion: Optional[str] = None
    tasks: List[str] = []
    topic: Optional[str] = None

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    transcript: Optional[str] = None
    summary: Optional[str] = None
    keywords: Optional[List[str]] = None
    sentiment: Optional[str] = None
    emotion: Optional[str] = None
    tasks: Optional[List[str]] = None
    topic: Optional[str] = None
    is_favorite: Optional[bool] = None
    is_pinned: Optional[bool] = None

class NoteOut(NoteBase):
    id: str = Field(..., alias="_id")
    user_id: str
    audio_file: Optional[str] = None
    is_favorite: bool = False
    is_pinned: bool = False
    created_at: datetime

    class Config:
        populate_by_name = True
