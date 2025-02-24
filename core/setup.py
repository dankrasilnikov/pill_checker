from setuptools import setup, find_packages

setup(
    name="pillchecker",
    version="1.0.0",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        "fastapi>=0.68.0",
        "uvicorn[standard]>=0.15.0",
        "sqlalchemy[asyncio]>=1.4.23",
        "alembic>=1.7.1",
        "pydantic>=2.0.0",
        "python-multipart>=0.0.5",
        "python-jose[cryptography]>=3.3.0",
        "passlib[bcrypt]>=1.7.4",
        "email-validator>=2.0.0",
        "pillow>=9.0.0",
        "easyocr>=1.7.0",
        "supabase>=1.0.3",
        "jinja2>=3.0.1",
        "aiofiles>=0.7.0",
    ],
    python_requires=">=3.9",
)
