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

## API Structure

### Authentication Endpoints (`/api/v1/auth`)
| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/register` | POST | Register a new user | `UserCreate` (email, password, password_confirm, username) | User ID and message |
| `/login` | POST | Log in a user | OAuth2 form (username/password) | `Token` (access_token, token_type, expires_in, refresh_token) |
| `/logout` | POST | Log out a user | None | Success message |
| `/refresh-token` | POST | Refresh an access token | `RefreshToken` (refresh_token) | `Token` (new tokens) |
| `/password-reset/request` | POST | Request a password reset | `EmailRequest` (email) | Success message |
| `/password-reset/verify` | POST | Reset password with token | `PasswordReset` (token, new_password, new_password_confirm) | Success message |
| `/verify-email` | GET | Verify email address | `token` (query param) | Success message |
| `/create-profile` | POST | Create user profile | `ProfileCreate` (username) | Profile details |

### Medication Endpoints (`/api/v1/medications`)
| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/upload` | POST | Upload and process medication image | Image file | `MedicationResponse` |
| `/list` | GET | List user medications | Query params (page, size) | `PaginatedResponse` of medications |
| `/{medication_id}` | GET | Get medication by ID | Path param (medication_id) | `MedicationResponse` |
| `/recent` | GET | Get recent medications | Query param (limit) | List of `MedicationResponse` |

## Database Schema

### Profile Model
- `id` (UUID): Primary key, associated with Supabase user ID
- `username` (Text): Unique display name
- `bio` (Text): User's biography or description
- Relationships:
  - `medications`: One-to-many relationship with Medication model

### Medication Model
- `id` (BigInteger): Primary key
- `profile_id` (UUID): Foreign key to Profile
- `title` (String): Name or title of the medication
- `scan_date` (DateTime): Date when the medication was scanned
- `active_ingredients` (Text): List of active ingredients
- `scanned_text` (Text): Raw text extracted from the scan
- `dosage` (String): Dosage information
- `prescription_details` (JSON): Additional prescription details
- `scan_url` (Text): URL of the uploaded medication scan
- Relationships:
  - `profile`: Many-to-one relationship with Profile model

## UML Class Diagram

```
┌───────────────────────┐       ┌───────────────────────┐
│        Profile        │       │      Medication       │
├───────────────────────┤       ├───────────────────────┤
│ +id: UUID (PK)        │       │ +id: BigInteger (PK)  │
│ +username: String     │  1:N  │ +profile_id: UUID (FK)│
│ +bio: String          │◄──────┤ +title: String        │
├───────────────────────┤       │ +scan_date: DateTime  │
│ +__repr__()           │       │ +active_ingredients:  │
└───────────────────────┘       │  String               │
                                │ +scanned_text: String │
                                │ +dosage: String       │
                                │ +prescription_details:│
                                │  JSON                 │
                                │ +scan_url: String     │
                                ├───────────────────────┤
                                │ +__repr__()           │
                                └───────────────────────┘

┌─────────────────────────┐     ┌────────────────────┐
│     EasyOCRClient       │     │     OCRClient      │
├─────────────────────────┤     ├────────────────────┤
│ -reader: EasyOCR Reader │     │ +read_text(image)  │
├─────────────────────────┤     └────────────────────┘
│ +read_text(image)       │              ▲
└──────────┬──────────────┘              │
           │ implements                  │
           └──────────────────────────────
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

## Testing Options

The project includes a comprehensive testing framework with various options for running tests:

### Basic Test Commands
```bash
# Run all tests
python -m pytest

# Run specific test file
python -m pytest tests/test_models.py

# Run with verbose output
python -m pytest -v
```

### Test Categories

#### 1. Standard Tests (Fast)
These tests use mocked OCR services and run quickly:
```bash
# Skip OCR tests (run only standard tests)
python -m pytest -m "not ocr"
```

#### 2. OCR Tests (Slow)
These tests use the actual OCR implementation and may be slower:
```bash
# Run only OCR tests
python -m pytest -m "ocr"

# Skip OCR tests in CI environments
export SKIP_REAL_OCR_TESTS=True
python -m pytest
```

### Test Image Generation
The project includes utilities to generate test images for OCR testing:
```bash
# Generate test images manually
python tests/create_test_image.py [output_directory] [count]
```

### Test Coverage
```bash
# Run with coverage report
pytest --cov=app tests/

# Generate detailed coverage report
pytest --cov=app tests/ && coverage report --show-missing > coverage_report.txt
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
