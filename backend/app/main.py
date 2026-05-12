from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth, notes, transcription
from .config import settings

app = FastAPI(title=settings.PROJECT_NAME)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(notes.router)
app.include_router(transcription.router)

@app.get("/")
async def root():
    return {"message": "Welcome to AI Voice-to-Text Notes API"}
