"""Tests for Pydantic schema validation and conversion."""

import uuid
from datetime import datetime

import pytest
from pydantic import ValidationError

from core.app.schemas import (
    ProfileCreate,
    ProfileUpdate,
    ProfileResponse,
    ProfileWithStats,
    MedicationCreate,
    MedicationUpdate,
    UploadedImageCreate,
    UploadedImageUpdate,
)


class TestProfileSchemas:
    """Test suite for Profile-related schemas."""

    def test_profile_create_schema(self, sample_profile_data):
        """Test ProfileCreate schema validation."""
        # Test valid data
        profile = ProfileCreate(**sample_profile_data)
        assert isinstance(profile.user_id, uuid.UUID)
        assert profile.user_id == sample_profile_data["user_id"]
        assert profile.display_name == sample_profile_data["display_name"]
        assert profile.bio == sample_profile_data["bio"]

        # Test optional fields
        test_uuid = uuid.uuid4()
        profile = ProfileCreate(user_id=test_uuid)
        assert profile.user_id == test_uuid
        assert profile.display_name is None
        assert profile.bio is None

        # Test invalid UUID
        with pytest.raises(ValidationError):
            ProfileCreate(user_id="invalid-uuid")

    def test_profile_update_schema(self, sample_profile_data):
        """Test ProfileUpdate schema validation."""
        # Test partial update
        update_data = {"display_name": "Updated Name"}
        profile = ProfileUpdate(**update_data)
        assert profile.display_name == "Updated Name"
        assert profile.bio is None

        # Test full update
        profile = ProfileUpdate(**{k: v for k, v in sample_profile_data.items() if k != "user_id"})
        assert profile.display_name == sample_profile_data["display_name"]
        assert profile.bio == sample_profile_data["bio"]

    def test_profile_response_schema(self, sample_profile_data):
        """Test ProfileResponse schema."""
        data = {
            "id": 1,
            "user_id": sample_profile_data["user_id"],
            "display_name": sample_profile_data["display_name"],
            "bio": sample_profile_data["bio"],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        response = ProfileResponse(**data)
        assert response.id == data["id"]
        assert isinstance(response.user_id, uuid.UUID)
        assert response.user_id == data["user_id"]
        assert response.display_name == data["display_name"]
        assert response.bio == data["bio"]
        assert isinstance(response.created_at, datetime)
        assert isinstance(response.updated_at, datetime)


class TestMedicationSchemas:
    """Test suite for Medication-related schemas."""

    def test_medication_create_schema(self, sample_medication_data):
        """Test MedicationCreate schema validation."""
        # Test valid data
        data = {"profile_id": 1, **sample_medication_data}
        medication = MedicationCreate(**data)
        assert medication.profile_id == 1
        assert medication.title == data["title"]
        assert medication.active_ingredients == data["active_ingredients"]
        assert medication.prescription_details == data["prescription_details"]

        # Test optional fields
        medication = MedicationCreate(profile_id=1)
        assert medication.title is None
        assert medication.active_ingredients is None
        assert medication.prescription_details == {}

    def test_medication_update_schema(self, sample_medication_data):
        """Test MedicationUpdate schema validation."""
        # Test partial update
        update_data = {"title": "Updated Title"}
        medication = MedicationUpdate(**update_data)
        assert medication.title == "Updated Title"
        assert medication.active_ingredients is None

        # Test full update
        medication = MedicationUpdate(**sample_medication_data)
        assert medication.title == sample_medication_data["title"]
        assert medication.active_ingredients == sample_medication_data["active_ingredients"]


class TestUploadedImageSchemas:
    """Test suite for UploadedImage-related schemas."""

    def test_uploaded_image_create_schema(self, sample_uploaded_image_data):
        """Test UploadedImageCreate schema validation."""
        # Test valid data
        image = UploadedImageCreate(**sample_uploaded_image_data)
        assert image.image == sample_uploaded_image_data["image"]
        assert image.file_path == sample_uploaded_image_data["file_path"]

        # Test required fields
        with pytest.raises(ValidationError):
            UploadedImageCreate()

    def test_uploaded_image_update_schema(self, sample_uploaded_image_data):
        """Test UploadedImageUpdate schema validation."""
        # Test partial update
        update_data = {"file_path": "/new/path/to/image.jpg"}
        image = UploadedImageUpdate(**update_data)
        assert image.file_path == update_data["file_path"]
        assert image.image is None

        # Test full update
        image = UploadedImageUpdate(**sample_uploaded_image_data)
        assert image.image == sample_uploaded_image_data["image"]
        assert image.file_path == sample_uploaded_image_data["file_path"]


def test_schema_inheritance():
    """Test schema inheritance and base functionality."""
    # Test ProfileWithStats
    stats_data = {
        "id": 1,
        "user_id": "123e4567-e89b-12d3-a456-426614174000",
        "display_name": "Test User",
        "bio": "Test bio",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "total_medications": 5,
        "active_medications": 3,
        "last_scan_date": "2024-02-23",
    }
    profile_stats = ProfileWithStats(**stats_data)
    assert profile_stats.total_medications == 5
    assert profile_stats.active_medications == 3
    assert profile_stats.last_scan_date == "2024-02-23"
