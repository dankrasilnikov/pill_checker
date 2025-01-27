
# NER Service with UMLS Integration

## Overview

The **NER Service** is a RESTful API designed for extracting **medical entities** from text and linking them to the **Unified Medical Language System (UMLS)**. The service uses a pre-trained **SciSpacy biomedical NER model** and supports UMLS concept mapping for recognized entities.

---

## Features

- **Named Entity Recognition (NER):**
  Extracts entities like chemicals, drugs, diseases, and other biomedical terms.
- **UMLS Concept Linking:**
  Maps recognized entities to UMLS concepts with **Concept Unique Identifiers (CUIs)**, canonical names, and aliases.
- **RESTful API:**
  Provides a simple interface to process text input and return structured entity data.

---

## Architecture

1. **Model Pipeline:**
   - `en_ner_bc5cdr_md`: Pre-trained biomedical NER model.
   - `UmlsEntityLinker`: Links recognized entities to UMLS concepts.
2. **REST API:** Built using [FastAPI](https://fastapi.tiangolo.com/).
3. **Containerization:** Dockerfile provided for easy deployment.

---

## API Endpoints

### 1. `POST /extract_entities`

**Description:** Extract medical entities from input text and link them to UMLS concepts.

**Request:**
```json
{
  "text": "The patient took advil."
}
```

**Response:**
```json
{
  "entities": [
    {
      "text": "advil",
      "label": "CHEMICAL",
      "umls_entities": [
        {
          "cui": "C0000870",
          "score": 0.95,
          "canonical_name": "Ibuprofen",
          "aliases": ["Advil", "Motrin", "Brufen"]
        }
      ]
    }
  ]
}
```

---

## Installation

### Prerequisites
- Python 3.9+
- Docker (optional for containerized deployment)

### Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/ner-service.git
   cd ner-service
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Download the pre-trained SciSpacy model:
   ```bash
   pip install https://s3-us-west-2.amazonaws.com/ai2-s2-scispacy/releases/v0.5.4/en_ner_bc5cdr_md-0.5.4.tar.gz
   ```

4. Run the service:
   ```bash
   uvicorn model_server:app --host 0.0.0.0 --port 8000
   ```

---

## Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t ner-service .
   ```

2. Run the container:
   ```bash
   docker run -d -p 8000:8000 ner-service
   ```

3. Test the service:
   ```bash
   curl -X POST -H "Content-Type: application/json"         -d '{"text": "The patient took advil."}'         http://localhost:8000/extract_entities
   ```

---

## Usage

### Example: Python Client

```python
import requests

api_url = "http://localhost:8000/extract_entities"
text = "The patient took advil."

response = requests.post(api_url, json={"text": text})
if response.status_code == 200:
    print(response.json())
else:
    print(f"Error: {response.status_code}")
```

---

## Development

### Run Unit Tests
Run tests locally to validate functionality:
```bash
pytest tests/
```

### Run Integration Tests
Ensure the API integrates correctly with client applications:
```bash
pytest tests/integration/
```

---

## Future Enhancements

- Add support for **brand/trademark recognition**.
- Improve UMLS concept linking for ambiguous entities.
- Integrate additional NER models for multilingual support.
