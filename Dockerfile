FROM python:3.9-slim

# Install dependencies
RUN pip install --no-cache-dir spacy==3.7.5 scispacy==0.5.4 scipy==1.10.1 scikit-learn==1.1.2 uvicorn fastapi

# Install the SciSpacy model
RUN pip install https://s3-us-west-2.amazonaws.com/ai2-s2-scispacy/releases/v0.5.4/en_ner_bc5cdr_md-0.5.4.tar.gz

# Copy your model_server code
WORKDIR /app
COPY ner/model_server.py /app

EXPOSE 8081
CMD ["uvicorn", "model_server:app", "--host", "0.0.0.0", "--port", "8081"]