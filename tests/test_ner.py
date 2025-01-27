import unittest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient
from ner.model_server import app


class TestExtractEntities(unittest.TestCase):
    @patch("ner.model_server.nlp")
    def test_extract_entities_with_mocked_pipeline(self, mock_nlp):
        """
        Test the /extract_entities endpoint with mocked NLP pipeline.
        """
        # Arrange: Mock Spacy doc and ents with example data
        mocked_doc = MagicMock()  # Fake `doc` object
        mocked_entity = MagicMock()  # Fake `Span` object

        # Mocking entity properties
        mocked_entity.text = "diabetes"
        mocked_entity.label_ = "DISEASE"
        mocked_entity._.umls_ents = [("C0011849", 0.95)]  # Mocked UMLS entities

        # Mock the UMLS linker response for top CUI
        mock_nlp.get_pipe.return_value.kb.cui_to_entity = {
            "C0011849": MagicMock(
                canonical_name="Diabetes Mellitus", aliases=["DM", "Diabetes Syndrome"]
            )
        }

        # Mock the doc.ents to return the mocked_entity
        mocked_doc.ents = [mocked_entity]
        mock_nlp.return_value = mocked_doc

        # Mock input request data
        test_request_data = {"text": "Patient shows symptoms of diabetes."}

        client = TestClient(app)

        # Act: Call the FastAPI endpoint
        response = client.post("/extract_entities", json=test_request_data)

        # Assert: Validate the response
        assert response.status_code == 200
        expected_response = {
            "entities": [
                {
                    "text": "diabetes",
                    "label": "DISEASE",
                    "umls_entities": [
                        {
                            "cui": "C0011849",
                            "score": 0.95,
                            "canonical_name": "Diabetes Mellitus",
                            "aliases": ["DM", "Diabetes Syndrome"],
                        }
                    ],
                }
            ]
        }
        self.assertEqual(response.json(), expected_response)

    @patch("ner.model_server.nlp")
    def test_extract_entities_with_no_umls_entities(self, mock_nlp):
        """
        Test the /extract_entities endpoint with no UMLS entities in the results.
        """
        # Arrange: Mock Spacy doc and ents with one mock entity but no UMLS entities
        mocked_doc = MagicMock()  # Fake `doc` object
        mocked_entity = MagicMock()  # Fake `Span` object

        # Mocking entity properties
        mocked_entity.text = "headache"
        mocked_entity.label_ = "SYMPTOM"
        mocked_entity._.umls_ents = []  # No UMLS entities for this result

        # Mock the doc.ents to return the mocked_entity
        mocked_doc.ents = [mocked_entity]
        mock_nlp.return_value = mocked_doc

        # Mock input request data
        test_request_data = {"text": "The patient is experiencing headache."}

        client = TestClient(app)

        # Act: Call the FastAPI endpoint
        response = client.post("/extract_entities", json=test_request_data)

        # Assert: Validate the response
        assert response.status_code == 200
        expected_response = {
            "entities": [{"text": "headache", "label": "SYMPTOM", "umls_entities": []}]
        }
        self.assertEqual(response.json(), expected_response)

    @patch("ner.model_server.nlp")
    def test_extract_entities_empty_input(self, mock_nlp):
        """
        Test the /extract_entities endpoint with empty input text.
        """
        # Arrange: Mock Spacy doc and ents
        mock_nlp.return_value.ents = []

        # Mock input request data
        test_request_data = {"text": ""}

        client = TestClient(app)

        # Act: Call the FastAPI endpoint
        response = client.post("/extract_entities", json=test_request_data)

        # Assert: Validate the response
        assert response.status_code == 200
        expected_response = {"entities": []}
        self.assertEqual(response.json(), expected_response)


if __name__ == "__main__":
    unittest.main()
