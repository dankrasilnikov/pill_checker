from datetime import datetime
from typing import Optional
from pydantic import HttpUrl

from .base import BaseSchema


class ScannedImageBase(BaseSchema):
    """Base schema for scanned medication image."""

    image: str
    file_path: Optional[str] = None


class ScannedImageCreate(ScannedImageBase):
    """Schema for creating a scanned medication image."""

    pass


class ScannedImageUpdate(ScannedImageBase):
    """Schema for updating a scanned medication image."""

    image: Optional[str] = None


class ScannedImageInDB(ScannedImageBase):
    """Schema for scanned medication image in database."""

    id: int
    uploaded_at: datetime


class ScannedImageResponse(ScannedImageInDB):
    """Schema for scanned medication image response."""

    image_url: Optional[HttpUrl] = None
