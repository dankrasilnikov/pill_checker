"""Test configuration and fixtures."""

import os
import uuid
import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.config import Settings
from app.models import Base

# Override environment to use test database
os.environ["APP_ENV"] = "testing"
os.environ["TEST_DATABASE_USER"] = "postgres"
os.environ["TEST_DATABASE_PASSWORD"] = ""
os.environ["TEST_DATABASE_HOST"] = "localhost"
os.environ["TEST_DATABASE_PORT"] = "5432"
os.environ["TEST_DATABASE_NAME"] = "test_pillchecker"

# Required for settings validation
os.environ["SECRET_KEY"] = "test-secret-key"
os.environ["SUPABASE_URL"] = "http://localhost:8000"
os.environ["SUPABASE_KEY"] = "test-key"
os.environ["SUPABASE_JWT_SECRET"] = "test-jwt-secret"


def get_test_settings() -> Settings:
    """Get settings configured for testing."""
    return Settings()


@pytest.fixture(scope="session")
def test_settings():
    """Fixture for test settings."""
    return get_test_settings()


@pytest.fixture(scope="session")
def test_db_engine(test_settings):
    """Create a test database engine."""
    engine = create_engine(
        test_settings.SQLALCHEMY_DATABASE_URI,
        poolclass=StaticPool,
        echo=True,  # Enable SQL logging for debugging
    )

    # Drop all tables to ensure clean state
    with engine.connect() as conn:
        conn.execute(text("DROP SCHEMA IF EXISTS public CASCADE"))
        conn.execute(text("CREATE SCHEMA public"))
        conn.commit()

    # Create all tables
    Base.metadata.create_all(engine)

    yield engine

    # Clean up after tests
    Base.metadata.drop_all(engine)


@pytest.fixture(scope="function")
def test_db_session(test_db_engine):
    """Create a test database session."""
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_db_engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.rollback()
        session.close()


@pytest.fixture
def sample_profile_data():
    """Sample profile data for testing."""
    return {"user_id": uuid.uuid4(), "display_name": "Test User", "bio": "Test bio"}


@pytest.fixture
def sample_medication_data():
    """Sample medication data for testing."""
    return {
        "title": "Test Medication",
        "active_ingredients": "Test Ingredient",
        "scanned_text": "Test scan text",
        "dosage": "10mg",
        "prescription_details": {"frequency": "daily"},
        "image_url": "https://example.com/test_image.jpg",
    }


@pytest.fixture
def sample_scanned_image_data():
    """Sample scanned medication image data for testing."""
    return {"image": "test_image.jpg", "file_path": "/path/to/test_image.jpg"}
