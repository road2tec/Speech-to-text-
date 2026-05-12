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
