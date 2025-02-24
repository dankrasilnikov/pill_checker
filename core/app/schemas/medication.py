from datetime import datetime
from enum import Enum
from typing import Optional, Dict, Any, List
from pydantic import Field, HttpUrl, conint, constr

from .base import BaseSchema


class MedicationStatus(str, Enum):
    """Medication status enum."""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    ERROR = "error"


class MedicationBase(BaseSchema):
    """Base schema for medication."""

    title: Optional[constr(min_length=1, max_length=200)] = Field(
        None, description="Medication title"
    )
    active_ingredients: Optional[constr(min_length=1, max_length=500)] = Field(
        None, description="Active ingredients list"
    )
    ocr_text: Optional[constr(min_length=1)] = Field(
        None, description="Text extracted from image"
    )
    dosage: Optional[constr(min_length=1, max_length=100)] = Field(
        None, description="Medication dosage"
    )
    prescription_details: Optional[Dict[str, Any]] = Field(
        default_factory=dict,
        description="Additional prescription details"
    )


class MedicationCreate(MedicationBase):
    """Schema for creating a medication."""

    profile_id: conint(gt=0) = Field(..., description="Profile ID")
    image_url: HttpUrl = Field(..., description="URL of the uploaded image")


class MedicationUpdate(MedicationBase):
    """Schema for updating a medication."""

    title: Optional[constr(min_length=1, max_length=200)] = None
    active_ingredients: Optional[constr(min_length=1, max_length=500)] = None
    dosage: Optional[constr(min_length=1, max_length=100)] = None
    prescription_details: Optional[Dict[str, Any]] = None


class MedicationInDB(MedicationBase):
    """Schema for medication in database."""

    id: conint(gt=0)
    profile_id: conint(gt=0)
    scan_date: datetime = Field(..., description="Date when medication was scanned")


class MedicationResponse(MedicationInDB):
    """Schema for medication response."""

    image_url: Optional[HttpUrl] = Field(None, description="URL of the medication image")
    status: MedicationStatus = Field(
        default=MedicationStatus.PENDING,
        description="Current status of the medication"
    )
    status_color: str = Field(
        "warning",
        pattern="^(primary|secondary|success|danger|warning|info)$",
        description="Bootstrap color class for status"
    )

    @property
    def formatted_scan_date(self) -> str:
        """Return formatted scan date."""
        return self.scan_date.strftime("%Y-%m-%d %H:%M")


class PaginatedResponse(BaseSchema):
    """Schema for paginated response."""

    items: List[MedicationResponse]
    total: conint(ge=0) = Field(..., description="Total number of items")
    page: conint(ge=1) = Field(..., description="Current page number")
    size: conint(ge=1, le=100) = Field(..., description="Items per page")
    pages: conint(ge=0) = Field(..., description="Total number of pages")
