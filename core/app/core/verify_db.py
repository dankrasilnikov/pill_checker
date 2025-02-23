from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

from .config import settings

def verify_database_connection() -> bool:
    """
    Verify database connection using current settings.
    Returns True if connection is successful, False otherwise.
    """
    try:
        # Create engine with the current environment's database settings
        engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)
        
        # Try to connect and execute a simple query
        with engine.connect() as connection:
            result = connection.execute(text("SELECT version();"))
            version = result.scalar()
            print(f"Successfully connected to the database ({settings.APP_ENV} environment)")
            print(f"PostgreSQL version: {version}")
            print(f"Database host: {settings.DATABASE_HOST}")
            print(f"Database name: {settings.DATABASE_NAME}")
            return True
            
    except SQLAlchemyError as e:
        print(f"Failed to connect to the database: {str(e)}")
        print(f"Current environment: {settings.APP_ENV}")
        print(f"Database host: {settings.DATABASE_HOST}")
        print(f"Database name: {settings.DATABASE_NAME}")
        return False

if __name__ == "__main__":
    verify_database_connection() 