from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
import os
import uuid
from ..services.whisper_service import transcribe_audio
from ..services.nlp_service import get_summary, get_keywords, get_sentiment, extract_tasks, get_topic
from ..middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/api/transcribe", tags=["transcription"])

UPLOAD_DIR = "app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/")
async def transcribe_and_analyze(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    # Save file
    file_extension = file.filename.split(".")[-1]
    file_id = str(uuid.uuid4())
    file_name = f"{file_id}.{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, file_name)
    
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    
    try:
        # Transcribe
        transcript = await transcribe_audio(file_path)
        
        # NLP Insights
        summary = get_summary(transcript)
        keywords = get_keywords(transcript)
        sentiment = get_sentiment(transcript)
        tasks = extract_tasks(transcript)
        topic = get_topic(transcript)
        
        return {
            "transcript": transcript,
            "summary": summary,
            "keywords": keywords,
            "sentiment": sentiment,
            "tasks": tasks,
            "topic": topic,
            "audio_file": file_name
        }
    except Exception as e:
        # Cleanup file if transcription fails
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))
