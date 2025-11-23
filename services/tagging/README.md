# Auto-Tagging Service

Automatically generates tags for uploaded documents using OCR and NLP.

## Features

- **PDF Text Extraction**: Extracts text from PDF documents
- **OCR**: Extracts text from images (JPG, PNG, GIF, BMP)
- **NLP Keyword Extraction**: Uses spaCy for intelligent keyword extraction
- **TF-IDF Analysis**: Identifies important terms using TF-IDF
- **Domain-Specific**: Optimized for medical/sterile processing terminology
- **Category Suggestion**: Automatically suggests content category

## Installation

### Local Development

1. Install system dependencies:
```bash
# macOS
brew install tesseract

# Ubuntu/Debian
sudo apt-get install tesseract-ocr tesseract-ocr-eng

# Windows
# Download from: https://github.com/UB-Mannheim/tesseract/wiki
```

2. Install Python dependencies:
```bash
cd services/tagging
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

3. Run the service:
```bash
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

### Docker

```bash
cd services/tagging
docker build -t spu-lms-tagging .
docker run -p 8001:8001 spu-lms-tagging
```

## API Endpoints

### POST /analyze

Analyze uploaded document and generate tags.

**Request:**
```bash
curl -X POST "http://localhost:8001/analyze" \
  -F "file=@document.pdf"
```

**Response:**
```json
{
  "success": true,
  "tags": [
    "sterilization",
    "instruments",
    "decontamination",
    "quality control",
    "steam autoclave"
  ],
  "headers": [
    "introduction",
    "sterilization methods",
    "quality assurance"
  ],
  "word_count": 1523,
  "character_count": 9845,
  "suggested_category": "book_materials"
}
```

### POST /suggest-tags

Suggest tags for plain text.

**Request:**
```bash
curl -X POST "http://localhost:8001/suggest-tags" \
  -H "Content-Type: application/json" \
  -d '{"text": "This guide covers proper decontamination procedures for surgical instruments...", "max_tags": 10}'
```

**Response:**
```json
{
  "success": true,
  "tags": [
    "decontamination",
    "procedures",
    "surgical instruments",
    "cleaning",
    "inspection"
  ]
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "auto-tagging",
  "nlp_available": true,
  "ocr_available": true
}
```

## Integration with Main LMS

Add to your Express server:

```javascript
// Call tagging service when uploading materials
app.post('/api/materials', upload.single('file'), async (req, res) => {
  try {
    // Upload file as usual...

    // Call auto-tagging service
    const formData = new FormData();
    formData.append('file', req.file.buffer, req.file.originalname);

    const taggingResponse = await fetch('http://localhost:8001/analyze', {
      method: 'POST',
      body: formData
    });

    if (taggingResponse.ok) {
      const taggingData = await taggingResponse.json();
      // Use taggingData.tags as suggested tags
    }

    // Save material with tags...
  } catch (error) {
    console.error('Tagging error:', error);
  }
});
```

## Customization

### Add Domain-Specific Keywords

Edit `DOMAIN_KEYWORDS` in `main.py` to add medical terminology specific to your needs:

```python
DOMAIN_KEYWORDS = {
    'sterilization', 'decontamination', 'instruments',
    # Add your custom terms here
    'your_custom_term', 'another_term'
}
```

### Adjust Tag Limits

Modify `max_keywords` parameter in function calls:

```python
nlp_tags = extract_keywords_nlp(cleaned_text, max_keywords=15)  # Default: 10
```

## Performance

- **PDF (10 pages)**: ~1-2 seconds
- **Image (1200x800)**: ~2-3 seconds
- **Plain text**: ~0.1-0.5 seconds

## Troubleshooting

### "spaCy model not found"
```bash
python -m spacy download en_core_web_sm
```

### "Tesseract not found"
Install Tesseract OCR for your OS (see Installation section)

### Poor OCR quality
- Ensure images are high resolution (at least 300 DPI)
- Use well-lit, clear images
- Pre-process images with contrast enhancement if needed

## Future Enhancements

- [ ] Support for Word documents (.docx)
- [ ] Multi-language support
- [ ] Custom medical terminology dictionary
- [ ] Integration with medical ontologies (SNOMED CT, MeSH)
- [ ] Auto-categorization using ML classification
- [ ] Batch processing API
