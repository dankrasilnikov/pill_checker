FROM python:3.9-slim

RUN pip install --no-cache-dir -r requirements.txt

WORKDIR /app
COPY main.py /app

EXPOSE 8081
CMD ["uvicorn", "main:big_app", "--host", "0.0.0.0", "--port", "8081"]