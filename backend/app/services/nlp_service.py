from transformers import pipeline
from keybert import KeyBERT
from textblob import TextBlob
import re
import spacy

# Global variables to store models (Lazy Loading)
_summarizer = None
_kw_model = None
_nlp = None

def get_summarizer():
    global _summarizer
    if _summarizer is None:
        try:
            _summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
        except Exception:
            _summarizer = pipeline("text2text-generation", model="facebook/bart-large-cnn")
    return _summarizer

def get_kw_model():
    global _kw_model
    if _kw_model is None:
        _kw_model = KeyBERT()
    return _kw_model

def get_spacy_nlp():
    global _nlp
    if _nlp is None:
        try:
            _nlp = spacy.load("en_core_web_sm")
        except Exception:
            _nlp = None
    return _nlp

def get_summary(text: str):
    if len(text) < 50:
        return text
    
    summarizer = get_summarizer()
    input_text = text[:1024]
    summary = summarizer(input_text, max_length=150, min_length=30, do_sample=False)
    return summary[0]['summary_text']

def get_keywords(text: str):
    kw_model = get_kw_model()
    keywords = kw_model.extract_keywords(text, keyphrase_ngram_range=(1, 2), stop_words='english', top_n=5)
    return [kw[0] for kw in keywords]

def get_sentiment(text: str):
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    if polarity > 0.1:
        return "Positive"
    elif polarity < -0.1:
        return "Negative"
    else:
        return "Neutral"

def extract_tasks(text: str):
    tasks = []
    lines = text.split('.')
    keywords = ['need to', 'must', 'should', 'task', 'todo', 'deadline', 'reminder', 'call', 'meeting']
    
    for line in lines:
        line = line.strip()
        if any(kw in line.lower() for kw in keywords):
            tasks.append(line)
    return tasks[:5]

def get_topic(text: str):
    keywords = get_keywords(text)
    if keywords:
        return keywords[0].capitalize()
    return "General"

_emotion_classifier = None

def get_emotion_classifier():
    global _emotion_classifier
    if _emotion_classifier is None:
        try:
            # Lazy load the emotion classification model
            _emotion_classifier = pipeline("text-classification", model="bhadresh-savani/distilbert-base-uncased-emotion")
        except Exception:
            _emotion_classifier = "fallback"
    return _emotion_classifier

def detect_emotion_fallback(text: str) -> str:
    # Lexicon-based fallback
    text_lower = text.lower()
    
    emotion_keywords = {
        "Joy": ["happy", "joy", "excited", "wonderful", "great", "love", "glad", "excellent", "awesome", "fantastic", "amazing", "cheerful", "delighted"],
        "Sadness": ["sad", "depressed", "sorry", "cry", "hurt", "pain", "unhappy", "lonely", "grief", "gloomy", "mourn", "disappointed"],
        "Anger": ["angry", "mad", "hate", "furious", "annoyed", "irritated", "rage", "pissed", "offended", "resentful"],
        "Fear": ["scared", "afraid", "fear", "anxious", "nervous", "terrified", "panic", "worried", "dread", "frightened"],
        "Surprise": ["surprised", "shocked", "unexpected", "wow", "amazing", "sudden", "unbelievable", "astonished"],
        "Love": ["love", "adore", "affection", "passion", "sweetheart", "beloved", "caring", "fondness"]
    }
    
    counts = {emotion: 0 for emotion in emotion_keywords}
    for emotion, keywords in emotion_keywords.items():
        for word in keywords:
            if re.search(r'\b' + re.escape(word) + r'\b', text_lower):
                counts[emotion] += 1
                
    max_emotion = max(counts, key=counts.get)
    if counts[max_emotion] > 0:
        return max_emotion
        
    # If no keywords matched, use TextBlob sentiment to guess
    try:
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity
        subjectivity = blob.sentiment.subjectivity
        
        if polarity > 0.3:
            return "Joy"
        elif polarity < -0.3:
            return "Sadness" if subjectivity > 0.5 else "Anger"
        elif subjectivity > 0.6:
            return "Surprise"
    except Exception:
        pass
        
    return "Neutral"

def get_emotion(text: str) -> str:
    if not text or len(text.strip()) == 0:
        return "Neutral"
        
    classifier = get_emotion_classifier()
    if classifier != "fallback":
        try:
            # We take the first 512 characters to avoid model input length limits
            truncated_text = text[:512]
            res = classifier(truncated_text)
            if res and len(res) > 0:
                label = res[0]["label"]
                # bhadresh-savani/distilbert-base-uncased-emotion labels: 
                # sadness, joy, love, anger, fear, surprise
                emotion_map = {
                    "sadness": "Sadness",
                    "joy": "Joy",
                    "love": "Love",
                    "anger": "Anger",
                    "fear": "Fear",
                    "surprise": "Surprise"
                }
                return emotion_map.get(label.lower(), label.capitalize())
        except Exception:
            pass
            
    # Fallback if model fails or pipeline was offline
    return detect_emotion_fallback(text)

