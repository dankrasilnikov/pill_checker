FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-binary :all: nmslib

COPY . .

EXPOSE 8081
CMD ["uvicorn", "main:big_app", "--host", "0.0.0.0", "--port", "8081"]