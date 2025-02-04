# FastAPI NER & UMLS Linking Service

This service provides named entity recognition (NER) and UMLS entity linking for biomedical text using spaCy with a scispaCy model. It exposes a REST API built with FastAPI to process text and return entities along with their UMLS details.

## Overview

- **Input:** JSON payload with a text field.
- **Processing:** Loads the `en_ner_bc5cdr_md` scispaCy model and attaches the UMLS linker during startup. When a request is received, the model extracts entities and looks up additional UMLS details.
- **Output:** JSON response listing the entities with UMLS linking details (e.g., CUI, score, canonical name, and aliases).

## Architecture

- **FastAPI:** Provides the REST API endpoints.
- **spaCy & scispaCy:** Performs NER and UMLS linking.
- **Lifespan Manager:** Uses FastAPI’s lifespan context manager (via `asynccontextmanager`) to load the model once at startup and release resources on shutdown.
- **Dependency Injection:** The spaCy model is attached to the application state and injected into endpoints as needed.
- **Health Check Endpoint:** A dedicated `/health` endpoint is provided to verify the application’s readiness.

## Features

- **/health Endpoint:** Returns a simple JSON indicating the service status.
- **/extract_entities Endpoint:** Accepts a JSON payload with a text field, performs NER and UMLS linking, and returns the extracted entities with additional UMLS details.
- **Swagger Documentation:** Interactive API documentation is available at `/docs` (Swagger UI) and `/redoc` (ReDoc).

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
   curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"text": "This text contains ibuprofen and paracetamol"}' \
     http://localhost:8000/extract_entities
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

## API Documentation

Once the application is running, visit http://localhost:8000/docs for the Swagger UI or http://localhost:8000/redoc for the ReDoc documentation.

---

## Model Notes

The application uses the `en_ner_bc5cdr_md` model from scispaCy along with the UMLS linker. Make sure that any required model data is accessible at runtime. If not available locally, the model package can be installed via pip (refer to scispaCy’s documentation for details).

---

## Future Enhancements

- Add support for **brand/trademark recognition**.
- Improve UMLS concept linking for ambiguous entities.
- Integrate additional NER models for multilingual support.
