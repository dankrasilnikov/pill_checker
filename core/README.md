# PillChecker Backend Service Guidelines

## Service Overview
The backend service is a FastAPI application that provides:
- OCR-based medication recognition
- Integration with BiomedNER for ingredient detection
- User authentication via Supabase
- RESTful API endpoints for medication management

## Architecture

### Component Structure
```
app/
├── api/            # API endpoints and routes
├── core/           # Core business logic
├── models/         # SQLAlchemy models
├── schemas/        # Pydantic schemas
├── services/       # Business services
├── utils/          # Utility functions
├── static/         # Static assets
└── templates/      # Jinja2 templates
```

### Architectural Dependency Map
```
                                    External Services
                                   ┌─────────────────┐
                                   │   Supabase      │
                                   │   BiomedNER     │
                                   │   OCR Service   │
                                   └────────┬────────┘
                                           │
                                           ▼
┌─────────────────┐              ┌─────────────────┐
│    API Layer    │              │    Services     │
│  (FastAPI)      │◄────────────►│  Integration    │
│ - Auth          │              │ - Authentication│
│ - Medications   │              │ - Storage       │
└───────┬─────────┘              └────────┬────────┘
        │                                 │
        ▼                                 ▼
┌─────────────────┐              ┌─────────────────┐
│  Data Models    │◄────────────►│    Schemas      │
│  (SQLAlchemy)   │              │   (Pydantic)    │
│ - Medication    │              │ - Validation    │
│ - Profile       │              │ - Serialization │
└───────┬─────────┘              └────────┬────────┘
        │                                 │
        └─────────────────┐   ┌──────────┘
                         ▼   ▼
                   ┌─────────────────┐
                   │    Database     │
                   │   (PostgreSQL)  │
                   └─────────────────┘
```

## Setup and Configuration
1. **Environment Setup**
   ```bash
   # Create virtual environment
   python -m venv .venv
   source .venv/bin/activate  # or .venv\Scripts\activate on Windows

   # Install dependencies
   pip install -r requirements.txt
   ```

2. **Environment Variables**
   ```bash
   # Copy example environment file
   cp .env.example .env

   # Required variables:
   - BIOMED_HOST         # BiomedNER service host
   - BIOMED_SCHEME      # BiomedNER service scheme (http/https)
   - DATABASE_URL       # Database connection string
   - SUPABASE_URL      # Supabase project URL
   - SUPABASE_KEY      # Supabase API key
   ```

## Database Management
1. **Migrations**
   ```bash
   # Create new migration
   alembic revision --autogenerate -m "description"

   # Apply migrations
   alembic upgrade head
   ```

2. **Models**
   - Define models in `app/models/`
   - Use SQLAlchemy for model definitions
   - Follow naming conventions

## Development Guidelines
1. **Code Organization**
   - Place API routes in `app/api/v1/`
   - Keep business logic in services
   - Use schemas for request/response validation

2. **API Development**
   - Follow REST principles
   - Document endpoints with FastAPI docstrings
   - Use dependency injection for common functionality

3. **Error Handling**
   - Use custom exceptions from `app/core/exceptions.py`
   - Implement proper error responses
   - Log errors appropriately

## Testing
1. **Running Tests**
   ```bash
   # Run all tests
   pytest

   # Run specific test file
   pytest tests/test_file.py

   # Run with coverage
   pytest --cov=app tests/

   # Generate detailed coverage report
   pytest --cov=app tests/ && coverage report --show-missing > coverage_report.txt
   ```

   The coverage report will show:
   - Coverage percentage for each module
   - Number of statements and missed statements
   - List of missing lines for each file
   - Overall project coverage

2. **Writing Tests**
   - Place tests in `tests/` directory
   - Follow test naming conventions
   - Use fixtures for common setup
   - Mock external services

## API Documentation
- Swagger UI: `/docs`
- ReDoc: `/redoc`
- OpenAPI JSON: `/openapi.json`

## Common Tasks
1. **Adding New Endpoint**
   - Create route in appropriate API module
   - Define request/response schemas
   - Implement service logic
   - Add tests

2. **Database Changes**
   - Update models
   - Generate migration
   - Test migration
   - Update related schemas

3. **External Service Integration**
   - Add service client in `app/services/`
   - Use environment variables for configuration
   - Implement retry logic
   - Add error handling

## Deployment
1. **Docker Build**
   ```bash
   docker build -t pill-checker-core .
   ```

2. **Docker Run**
   ```bash
   docker run -p 8000:8000 \
     --env-file .env \
     pill-checker-core
   ```

## Troubleshooting
1. **Common Issues**
   - Check environment variables
   - Verify database connection
   - Ensure BiomedNER service is accessible
   - Check logs in `logs/` directory

2. **Debugging**
   - Use FastAPI debug mode
   - Check application logs
   - Verify database migrations
   - Test external service connections
