from typing import Any, Dict, List

import spacy
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from scispacy.abbreviation import AbbreviationDetector  # type: ignore
from scispacy.linking import EntityLinker  # type: ignore


def setup_model():
    """
    Loads the Spacy model, registers the UMLS linker component,
    and sets up necessary custom extensions for the Span object.
    """
    print("Loading model...")
    model = spacy.load("en_ner_bc5cdr_md")
    model.add_pipe("abbreviation_detector")
    model.add_pipe("scispacy_linker", config={"linker_name": "rxnorm"})

    print("Model loaded!")
    return model


app = FastAPI()
root_nlp = setup_model()

class TextRequest(BaseModel):
    text: str


@app.post("/extract_entities", response_model=Dict[str, List[Dict[str, Any]]])
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
            print(entity_detail)
            if entity_detail:
                umls_entities.append({
                    "cui": entity_detail.CUI,
                    "canonical_name": entity_detail.name,
                    "definition": entity_detail.definition,
                    "aliases": entity_detail.aliases,
                })

        entities.append({
            "text": ent.text,
            "label": ent.label_,
            "umls_entities": umls_entities,
        })

    return {"entities": entities}

@app.get("/health")
def health_check() -> Dict[str, str]:
    """
    Health check endpoint to verify that the application is running and the model is loaded.
    If the model is accessible, returns a simple JSON status.
    """
    if root_nlp is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")
    return {"status": "ok", "message": "Service is healthy"}
