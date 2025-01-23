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

# Load the model
print("Loading model...")
nlp = spacy.load("en_ner_bc5cdr_md")

# Add the registered linker component to the pipeline
nlp.add_pipe("umls_linker", last=True)

# Register the 'umls_ents' extension manually
if not Span.has_extension("umls_ents"):
    Span.set_extension("umls_ents", default=None)

print("Model loaded!")

app = FastAPI()

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
        ent_data = {
            "text": ent.text,
            "label": ent.label_,
            "umls_entities": []
        }
        if not ent._.umls_ents:
            results.append(ent_data)
            continue

        # Take the top match (highest confidence)
        top_cui, score = ent._.umls_ents[0]
        # Retrieve the full concept info
        umls_linker = nlp.get_pipe("umls_linker")
        umls_concept = umls_linker.kb.cui_to_entity[top_cui]
        brand_names = extract_brand_name_synonyms(umls_concept)

        ent_data["umls_entities"].append({
            "cui": top_cui,
            "score": score,
            "canonical_name": umls_concept.canonical_name,
            "aliases": umls_concept.aliases[:5],
            "brand_names": brand_names
        })
        results.append(ent_data)
    return {"entities": results}


def extract_brand_name_synonyms(umls_concept):
    brand_candidates = []

    canonical = umls_concept.canonical_name.lower()

    for alias in umls_concept.aliases:
        if alias.lower() == canonical:
            continue
        if alias.isupper() or "brand name" in alias.lower():
            brand_candidates.append(alias)

    return brand_candidates