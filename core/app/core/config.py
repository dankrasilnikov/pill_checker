import os
from functools import lru_cache
from typing import List, Optional

from dotenv import load_dotenv
from pydantic.v1 import BaseSettings, validator

# Load environment variables
load_dotenv()


class Settings(BaseSettings):
    # Environment
    APP_ENV: str = "development"
    DEBUG: bool = True

    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "PillChecker"

    # Security
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 11520

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = []

    # Supabase Settings
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_JWT_SECRET: str
    SUPABASE_STORAGE_BUCKET: str = "pill-images"

    # Database - The actual values will be set based on APP_ENV
    DATABASE_USER: str = None
    DATABASE_PASSWORD: str = None
    DATABASE_HOST: str = None
    DATABASE_PORT: str = None
    DATABASE_NAME: str = None

    # Storage
    STORAGE_URL: Optional[str] = None

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "app.log"

    @validator("ACCESS_TOKEN_EXPIRE_MINUTES", pre=True)
    def validate_token_expire(cls, v):
        """Validate and convert ACCESS_TOKEN_EXPIRE_MINUTES."""
        try:
            return int(str(v).split("#")[0].strip())
        except (ValueError, TypeError):
            return 11520

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def parse_cors_origins(cls, v):
        """Parse CORS origins from string to list."""
        if isinstance(v, str):
            try:
                import json

                return json.loads(v)
            except json.JSONDecodeError:
                return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    @validator(
        "DATABASE_USER",
        "DATABASE_PASSWORD",
        "DATABASE_HOST",
        "DATABASE_PORT",
        "DATABASE_NAME",
        pre=True,
    )
    def set_db_credentials(cls, v, values, field):
        """Set database credentials based on environment."""
        env_prefix = {"development": "DEV_", "testing": "TEST_", "production": "PROD_"}.get(
            values.get("APP_ENV", "development"), "DEV_"
        )

        env_var = f"{env_prefix}{field.name}"
        value = os.getenv(env_var)
        if not value and field.name != "DATABASE_PASSWORD":  # Allow empty password
            raise ValueError(f"Database environment variable {env_var} is not set")
        return value or ""  # Return empty string for empty password

    @validator("SECRET_KEY", pre=True)
    def validate_secret_key(cls, v):
        """Validate that SECRET_KEY is set."""
        if not v:
            raise ValueError("SECRET_KEY environment variable is not set")
        return v

    @validator("SUPABASE_URL", "SUPABASE_KEY", "SUPABASE_JWT_SECRET", pre=True)
    def validate_supabase_settings(cls, v, field):
        """Validate that Supabase settings are set."""
        if not v:
            raise ValueError(f"{field.name} environment variable is not set")
        return v

    @property
    def storage_url(self) -> str:
        """Get storage URL."""
        if not self.STORAGE_URL:
            return f"{self.SUPABASE_URL}/storage/v1/object/public/{self.SUPABASE_STORAGE_BUCKET}"
        return self.STORAGE_URL

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        """Construct database URI."""
        sslmode = "require" if self.APP_ENV == "production" else "disable"
        return f"postgresql+psycopg2://{self.DATABASE_USER}:{self.DATABASE_PASSWORD}@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_NAME}?sslmode={sslmode}"

    class Config:
        case_sensitive = True
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()
