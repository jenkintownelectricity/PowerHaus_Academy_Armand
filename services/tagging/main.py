"""
Auto-Tagging Service for SPU LMS

This service automatically generates tags for uploaded documents using:
1. OCR (Tesseract) for extracting text from PDFs and images
2. NLP (spaCy) for keyword extraction and entity recognition
3. TF-IDF for identifying important terms

Usage:
    uvicorn main:app --host 0.0.0.0 --port 8001 --reload
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import io
import os
import re
from collections import Counter

# PDF and image processing
from PIL import Image
import pytesseract
import PyPDF2

# NLP
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer

app = FastAPI(title="SPU LMS Auto-Tagging Service", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load spaCy model for NLP
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("⚠️  spaCy model not found. Install with: python -m spacy download en_core_web_sm")
    nlp = None

# Medical/sterile processing specific terms to boost
DOMAIN_KEYWORDS = {
    'sterilization', 'decontamination', 'instruments', 'surgical', 'autoclave',
    'disinfection', 'cleaning', 'quality', 'control', 'packaging', 'wrapping',
    'indicators', 'biological', 'chemical', 'physical', 'steam', 'eto',
    'hydrogen', 'peroxide', 'plasma', 'inspection', 'assembly', 'tray',
    'case', 'cart', 'infection', 'prevention', 'reprocessing', 'medical',
    'device', 'equipment', 'central', 'supply', 'cssd', 'spd', 'sterile',
    'processing', 'department', 'procedure', 'protocol', 'standard', 'guideline',
    'aami', 'iahcsmm', 'cbspd', 'certification', 'competency', 'validation'
}


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from PDF file"""
    try:
        pdf_file = io.BytesIO(file_bytes)
        pdf_reader = PyPDF2.PdfReader(pdf_file)

        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"

        return text.strip()
    except Exception as e:
        print(f"PDF extraction error: {e}")
        return ""


def extract_text_from_image(file_bytes: bytes) -> str:
    """Extract text from image using OCR"""
    try:
        image = Image.open(io.BytesIO(file_bytes))
        text = pytesseract.image_to_string(image)
        return text.strip()
    except Exception as e:
        print(f"OCR error: {e}")
        return ""


def clean_text(text: str) -> str:
    """Clean and normalize text"""
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)

    # Remove special characters but keep important punctuation
    text = re.sub(r'[^\w\s\-\.]', ' ', text)

    return text.strip()


def extract_keywords_nlp(text: str, max_keywords: int = 10) -> List[str]:
    """Extract keywords using spaCy NLP"""
    if not nlp or not text:
        return []

    doc = nlp(text.lower())

    # Extract noun phrases and named entities
    keywords = []

    # Noun chunks (multi-word terms)
    for chunk in doc.noun_chunks:
        if len(chunk.text.split()) <= 3:  # Max 3 words
            keywords.append(chunk.text)

    # Named entities (organizations, products, etc.)
    for ent in doc.ents:
        if ent.label_ in ['ORG', 'PRODUCT', 'GPE', 'PERSON', 'WORK_OF_ART']:
            keywords.append(ent.text.lower())

    # Single important nouns
    for token in doc:
        if token.pos_ in ['NOUN', 'PROPN'] and not token.is_stop and len(token.text) > 3:
            keywords.append(token.text)

    # Count frequency
    keyword_counts = Counter(keywords)

    # Boost domain-specific keywords
    for keyword in keyword_counts:
        for domain_term in DOMAIN_KEYWORDS:
            if domain_term in keyword.lower():
                keyword_counts[keyword] *= 3  # Boost score

    # Return top keywords
    top_keywords = [k for k, v in keyword_counts.most_common(max_keywords)]

    return top_keywords


def extract_keywords_tfidf(text: str, max_keywords: int = 10) -> List[str]:
    """Extract keywords using TF-IDF"""
    if not text:
        return []

    try:
        # Split into sentences for TF-IDF
        sentences = text.split('.')

        if len(sentences) < 2:
            # If too short, use word frequency
            words = text.lower().split()
            word_counts = Counter(w for w in words if len(w) > 3)
            return [w for w, c in word_counts.most_common(max_keywords)]

        # Use TF-IDF
        vectorizer = TfidfVectorizer(
            max_features=max_keywords,
            stop_words='english',
            ngram_range=(1, 2),  # uni-grams and bi-grams
            min_df=1,
            max_df=0.8
        )

        tfidf_matrix = vectorizer.fit_transform(sentences)
        feature_names = vectorizer.get_feature_names_out()

        # Get top features
        scores = tfidf_matrix.sum(axis=0).A1
        top_indices = scores.argsort()[-max_keywords:][::-1]

        keywords = [feature_names[i] for i in top_indices]

        # Boost domain keywords
        boosted = []
        for keyword in keywords:
            for domain_term in DOMAIN_KEYWORDS:
                if domain_term in keyword.lower():
                    boosted.insert(0, keyword)  # Add to front
                    break
            else:
                boosted.append(keyword)

        return boosted[:max_keywords]

    except Exception as e:
        print(f"TF-IDF error: {e}")
        return []


def extract_headers(text: str) -> List[str]:
    """Extract section headers from document"""
    headers = []

    # Pattern for headers (all caps, or title case at start of line)
    header_patterns = [
        r'^([A-Z][A-Z\s]{3,30})\n',  # ALL CAPS headers
        r'^\d+\.\s+([A-Z][a-zA-Z\s]{3,50})\n',  # Numbered headers
        r'^([A-Z][a-zA-Z\s]{3,50}):\n',  # Headers with colon
    ]

    for pattern in header_patterns:
        matches = re.findall(pattern, text, re.MULTILINE)
        headers.extend(matches)

    return [h.strip().lower() for h in headers if len(h.strip()) > 3]


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "auto-tagging",
        "nlp_available": nlp is not None,
        "ocr_available": True
    }


@app.post("/analyze")
async def analyze_document(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Analyze uploaded document and generate tags

    Supports:
    - PDF files (.pdf)
    - Images (.jpg, .jpeg, .png, .gif, .bmp)
    """

    # Read file
    file_bytes = await file.read()
    file_ext = os.path.splitext(file.filename)[1].lower()

    # Extract text based on file type
    text = ""

    if file_ext == '.pdf':
        text = extract_text_from_pdf(file_bytes)
    elif file_ext in ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff']:
        text = extract_text_from_image(file_bytes)
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file_ext}. Supported: PDF, JPG, PNG, GIF, BMP"
        )

    if not text or len(text) < 10:
        return {
            "success": False,
            "message": "Could not extract sufficient text from document",
            "tags": [],
            "headers": [],
            "word_count": 0
        }

    # Clean text
    cleaned_text = clean_text(text)

    # Extract tags using multiple methods
    nlp_tags = extract_keywords_nlp(cleaned_text, max_keywords=10)
    tfidf_tags = extract_keywords_tfidf(cleaned_text, max_keywords=10)
    headers = extract_headers(text)

    # Combine and deduplicate
    all_tags = list(dict.fromkeys(nlp_tags + tfidf_tags + headers))

    # Filter and clean tags
    final_tags = []
    for tag in all_tags:
        # Remove numbers and clean
        tag_clean = re.sub(r'^\d+\s*', '', tag).strip()

        # Filter criteria
        if (len(tag_clean) >= 3 and
            len(tag_clean) <= 30 and
            not tag_clean.isdigit() and
            tag_clean not in final_tags):
            final_tags.append(tag_clean)

    # Limit to top 15 tags
    final_tags = final_tags[:15]

    return {
        "success": True,
        "tags": final_tags,
        "headers": headers[:10],
        "word_count": len(cleaned_text.split()),
        "character_count": len(cleaned_text),
        "suggested_category": categorize_content(final_tags)
    }


def categorize_content(tags: List[str]) -> str:
    """Suggest content category based on tags"""
    tags_str = ' '.join(tags).lower()

    if any(term in tags_str for term in ['station', 'hands', 'practical', 'procedure', 'step']):
        return 'hands_on_station'
    elif any(term in tags_str for term in ['book', 'chapter', 'study', 'guide', 'material']):
        return 'book_materials'
    else:
        return 'book_materials'  # Default


@app.post("/suggest-tags")
async def suggest_tags(text: str, max_tags: int = 10) -> Dict[str, Any]:
    """
    Suggest tags for plain text input

    Use this for analyzing text from:
    - Discussion posts
    - Blog articles
    - Class descriptions
    """

    if not text or len(text) < 10:
        return {
            "success": False,
            "message": "Text too short for analysis",
            "tags": []
        }

    cleaned_text = clean_text(text)

    # Extract tags
    nlp_tags = extract_keywords_nlp(cleaned_text, max_keywords=max_tags)
    tfidf_tags = extract_keywords_tfidf(cleaned_text, max_keywords=max_tags)

    # Combine and deduplicate
    all_tags = list(dict.fromkeys(nlp_tags + tfidf_tags))

    # Clean and filter
    final_tags = []
    for tag in all_tags:
        tag_clean = re.sub(r'^\d+\s*', '', tag).strip()
        if (len(tag_clean) >= 3 and
            len(tag_clean) <= 30 and
            not tag_clean.isdigit() and
            tag_clean not in final_tags):
            final_tags.append(tag_clean)

    return {
        "success": True,
        "tags": final_tags[:max_tags]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
