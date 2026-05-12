# AI Voice-to-Text Notes with NLP Insights

A modern AI-powered web application that converts voice recordings into text notes and generates intelligent NLP insights.

## Features
- **Speech-to-Text**: High-accuracy transcription using OpenAI Whisper.
- **NLP Insights**: Automatic generation of summaries, keywords, sentiment, and action items.
- **Modern Dashboard**: Beautiful UI with analytics and note management.
- **Secure Auth**: JWT-based authentication with protected routes.
- **Mobile Responsive**: Fully responsive design using Tailwind CSS and Framer Motion.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Framer Motion, Axios.
- **Backend**: FastAPI, MongoDB, OpenAI Whisper, HuggingFace Transformers.

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js & npm
- MongoDB (running locally on port 27017)

### Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Download spaCy model:
   ```bash
   python -m spacy download en_core_web_sm
   ```
5. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Usage
- Register an account or log in.
- Go to the **Record** page to start a new voice note.
- Once recorded, click **Process with AI** to get transcriptions and insights.
- Save the note to view it in your dashboard and notes history.

## AI Models
Note: On first run, the backend will download the Whisper (base) and BART-large-CNN summarization models. This may take a few minutes depending on your internet connection.
