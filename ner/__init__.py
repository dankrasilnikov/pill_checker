import os

from ner.model_server import app

if __name__ == '__main__':
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", "80"))
    app.run(host=host, port=port)