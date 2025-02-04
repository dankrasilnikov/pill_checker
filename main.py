import logging
from typing import Any, Dict, List
from contextlib import asynccontextmanager

import spacy
from scispacy.abbreviation import AbbreviationDetector  # type: ignore
from scispacy.linking import EntityLinker  # type: ignore
from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel
from spacy.language import Language

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


class TextRequest(BaseModel):
    text: str


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager to handle startup and shutdown events.
    This function loads the spaCy model and attaches it to app.state during startup.
    """
    try:
        nlp = spacy.load("en_ner_bc5cdr_md")
        # Add the UMLS linker to run after the NER component.
        nlp.add_pipe("scispacy_linker", config={"resolve_abbreviations": True, "threshold": 0.7, "linker_name": "umls"}, last=True)
        app.state.nlp = nlp
        logger.info("Model and UMLS linker loaded successfully.")
    except Exception as e:
        logger.exception("Failed to load the spaCy model: %s", e)
        raise e

    yield  # This yield marks the point where the application is up and running.

    logger.info("Shutting down the application. Cleanup if required.")


big_app = FastAPI(lifespan=lifespan)


def get_nlp() -> Language:
    """
    Dependency to retrieve the spaCy model from app state.
    """
    nlp = getattr(big_app.state, "nlp", None)
    if nlp is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")
    return nlp


@big_app.post("/extract_entities", response_model=Dict[str, List[Dict[str, Any]]])
def extract_entities(req: TextRequest, nlp: Language = Depends(get_nlp)) -> Dict[str, List[Dict[str, Any]]]:
    """
    Process the input text and return recognized entities along with their UMLS details.
    """
    doc = nlp(req.text)
    entities = []

    # Retrieve the linker component to access UMLS mapping.
    linker = nlp.get_pipe("scispacy_linker")

    for ent in doc.ents:
        umls_entities = []
        # ent._.umls_ents contains tuples of (cui, score).
        for cui, score in ent._.umls_ents:
            # Lookup additional details from the linker's mapping.
            entity_detail = linker.umls.cui_to_entity.get(cui)
            if entity_detail:
                umls_entities.append({
                    "cui": cui,
                    "score": score,
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
def health_check(nlp: Language = Depends(get_nlp)) -> Dict[str, str]:
    """
    Health check endpoint to verify that the application is running and the model is loaded.
    If the model is accessible, returns a simple JSON status.
    """
    return {"status": "ok", "message": "Service is healthy"}
