"""OCR service for text recognition from images."""

import io
from typing import Union, BinaryIO

from PIL import Image


class EasyOCRClient:
    """OCR client using EasyOCR."""

    def __init__(self, languages=None):
        """Initialize EasyOCR reader immediately on startup."""
        self.languages = languages or ["en"]
        import easyocr

        self.reader = easyocr.Reader(self.languages)
        print("EasyOCR initialized and ready")

    def read_text(self, image_data: Union[bytes, BinaryIO]) -> str:
        """Extract text using EasyOCR."""
        # Process image
        if isinstance(image_data, bytes):
            image = Image.open(io.BytesIO(image_data))
        else:
            image = Image.open(image_data)

        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")

        # Convert to bytes for EasyOCR
        image_bytes = io.BytesIO()
        image.save(image_bytes, format="JPEG")
        image_bytes.seek(0)

        # Extract text
        results = self.reader.readtext(image_bytes.read(), detail=0)
        return " ".join(results)


_ocr_client = None


def get_ocr_client(languages=None):
    """Get or create the OCR client singleton."""
    global _ocr_client
    if _ocr_client is None:
        _ocr_client = EasyOCRClient(languages=languages)
    return _ocr_client


get_ocr_client()
