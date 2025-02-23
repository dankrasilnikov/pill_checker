"""Database configuration and session management."""

from contextlib import contextmanager
from typing import AsyncGenerator, Generator
from urllib.parse import urlparse, parse_qs

from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import QueuePool

from .config import settings
from .logging_config import logger

# Parse the database URL to handle SSL mode separately for asyncpg
db_url = settings.SQLALCHEMY_DATABASE_URI
parsed = urlparse(db_url)
query_params = parse_qs(parsed.query)
ssl_mode = query_params.get('sslmode', ['disable'])[0]

# Create the base async URL without SSL mode
async_url = db_url.replace("postgresql+psycopg2", "postgresql+asyncpg").split('?')[0]

# Configure SSL for asyncpg
connect_args = {"ssl": "require"} if ssl_mode == "require" else {}

# Create async engine for the application
async_engine = create_async_engine(
    async_url,
    pool_pre_ping=True,  # Enable connection health checks
    pool_size=5,  # Maximum number of connections in the pool
    max_overflow=10,  # Maximum number of connections that can be created beyond pool_size
    pool_timeout=30,  # Timeout for getting a connection from the pool
    pool_recycle=1800,  # Recycle connections after 30 minutes
    echo=settings.DEBUG,  # Log SQL statements in debug mode
    connect_args=connect_args,  # Apply SSL configuration
)

# Create sync engine for migrations and testing
sync_engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URI,
    poolclass=QueuePool,
    pool_size=5,
    max_overflow=10,
    pool_timeout=30,
    pool_recycle=1800,
    echo=settings.DEBUG,
)

# Create session factories
AsyncSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=async_engine,
    class_=AsyncSession,
)

SyncSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=sync_engine,
)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    """Get an async database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as e:
            logger.error(f"Database session error: {e}")
            await session.rollback()
            raise
        finally:
            await session.close()


@contextmanager
def get_sync_session() -> Generator[Session, None, None]:
    """Get a synchronous database session."""
    session = SyncSessionLocal()
    try:
        yield session
    except Exception as e:
        logger.error(f"Database session error: {e}")
        session.rollback()
        raise
    finally:
        session.close()


# Dependency for FastAPI
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency for getting a database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as e:
            logger.error(f"Database session error: {e}")
            await session.rollback()
            raise
        finally:
            await session.close()
