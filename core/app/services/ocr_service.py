"""OCR service for processing medication images."""

import io
import easyocr
from PIL import Image


def recognise(uploaded_file):
    image = Image.open(io.BytesIO(uploaded_file))
    if image.mode in ("RGBA", "P"):
        image = image.convert("RGB")
    extracted_text = extract_text_with_easyocr(image)
    return extracted_text


def extract_text_with_easyocr(image):
    if image.mode in ("RGBA", "P"):
        image = image.convert("RGB")

    image_bytes = io.BytesIO()
    image.save(image_bytes, format="JPEG")
    image_bytes.seek(0)

    reader = easyocr.Reader(["en"], gpu=True)
    results = reader.readtext(image_bytes.read(), detail=0)
    return " ".join(results)
