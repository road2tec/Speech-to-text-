import whisper
import os
from ..config import settings

# Load model globally
model = whisper.load_model("base")

async def transcribe_audio(file_path: str):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Audio file not found at {file_path}")
    
    result = model.transcribe(file_path)
    return result["text"]
