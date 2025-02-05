import logging
import warnings
from typing import Any, Dict, List

import spacy
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from scispacy.abbreviation import AbbreviationDetector  # type: ignore
from scispacy.linking import EntityLinker  # type: ignore
from spacy.language import Language

warnings.filterwarnings("ignore", message="Possible set union at position")

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class TextRequest(BaseModel):
    text: str


def get_nlp() -> Language:
    try:
        try:
            nlp = spacy.load("en_ner_bc5cdr_md")
            logger.info("Successfully loaded model en_ner_bc5cdr_md")
        except Exception as e:
            logger.exception("Error loading model en_ner_bc5cdr_md: %s", e)
            raise e

        nlp.add_pipe("abbreviation_detector")
        nlp.add_pipe("scispacy_linker", config={"linker_name": "umls"})
        logger.info("Model and UMLS linker loaded successfully.")
    except Exception as e:
        logger.exception("Failed to load the spaCy model: %s", e)
        raise e

    return nlp


big_app = FastAPI()
root_nlp = get_nlp()


@big_app.post("/extract_entities", response_model=Dict[str, List[Dict[str, Any]]])
def extract_entities(req: TextRequest) -> Dict[str, List[Dict[str, Any]]]:
    """
    Process the input text and return recognized entities along with their UMLS details.
    """
    doc = root_nlp(req.text)
    entities = []

    # Retrieve the linker component to access UMLS mapping.
    linker = root_nlp.get_pipe("scispacy_linker")

    for ent in doc.ents:
        umls_entities = []
        for umls_ent in ent._.kb_ents:
            entity_detail = linker.kb.cui_to_entity[umls_ent[0]]
            if entity_detail:
                umls_entities.append({
                    "cui": entity_detail.cui,
                    "score": entity_detail.score,
                    "canonical_name": entity_detail.canonical_name,
                    "aliases": entity_detail.aliases,
                })

        entities.append({
            "text": ent.text,
            "label": ent.label_,
            "umls_entities": umls_entities,
        })

    return {"entities": entities}

@big_app.get("/health")
def health_check() -> Dict[str, str]:
    """
    Health check endpoint to verify that the application is running and the model is loaded.
    If the model is accessible, returns a simple JSON status.
    """
    if root_nlp is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")
    return {"status": "ok", "message": "Service is healthy"}
