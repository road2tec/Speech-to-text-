import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

async def view_all_data():
    # MongoDB connection
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    database_name = os.getenv("DATABASE_NAME", "voice_notes_db")
    
    client = AsyncIOMotorClient(mongodb_url)
    db = client[database_name]
    
    print("\n" + "="*50)
    print("--- AI VOICE NOTES DATABASE VIEW ---")
    print("="*50 + "\n")
    
    # Check Users
    users_count = await db.users.count_documents({})
    print(f"Total Users: {users_count}")
    
    # Check Notes
    notes_cursor = db.notes.find({})
    notes = await notes_cursor.to_list(length=100)
    
    print(f"Total Notes: {len(notes)}\n")
    
    if len(notes) > 0:
        print("--- RECENT NOTES ---")
        for i, note in enumerate(notes, 1):
            print(f"{i}. Title: {note.get('title', 'N/A')}")
            print(f"   Topic: {note.get('topic', 'N/A')}")
            print(f"   Sentiment: {note.get('sentiment', 'N/A')}")
            print(f"   Summary: {note.get('summary', 'N/A')[:100]}...")
            print("-" * 30)
    else:
        print("No notes found in database.")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(view_all_data())
