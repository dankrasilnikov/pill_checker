from fastapi import FastAPI
from pydantic import BaseModel
import spacy
from scispacy.umls_linking import UmlsEntityLinker
from spacy.language import Language
from spacy.tokens import Span


# Register the EntityLinker as a component
@Language.factory("umls_linker")
def create_umls_linker(nlp, name):
    return UmlsEntityLinker(resolve_abbreviations=True, filter_for_definitions=False)


def setup_model():
    """
    Loads the Spacy model, registers the UMLS linker component,
    and sets up necessary custom extensions for the Span object.
    """
    print("Loading model...")
    model = spacy.load("en_ner_bc5cdr_md")

    if not Language.has_factory("umls_linker"):
        raise ValueError("The 'umls_linker' factory is not registered properly.")

    model.add_pipe("umls_linker", last=True)

    if not Span.has_extension("umls_ents"):
        Span.set_extension("umls_ents", default=None)

    print("Model loaded!")
    return model


# Initialize the app and load the model
app = FastAPI()
nlp = setup_model()


class TextRequest(BaseModel):
    text: str


@app.post("/extract_entities")
def extract_entities(req: TextRequest):
    """
    Takes a string, runs the NER + linking pipeline, returns the recognized entities.
    """
    doc = nlp(req.text)
    results = []
    for ent in doc.ents:
        # Basic structure for entity data
        ent_data = {"text": ent.text, "label": ent.label_, "umls_entities": []}
        if not ent._.umls_ents:
            results.append(ent_data)
            continue

        # Take the top match (highest confidence)
        top_cui, score = ent._.umls_ents[0]
        # Retrieve the full concept info
        umls_linker = nlp.get_pipe("umls_linker")
        umls_concept = umls_linker.kb.cui_to_entity[top_cui]

        ent_data["umls_entities"].append(
            {
                "cui": top_cui,
                "score": score,
                "canonical_name": umls_concept.canonical_name,
                "aliases": umls_concept.aliases[:5],
            }
        )
        results.append(ent_data)
    return {"entities": results}
