import os

import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from starlette.templating import Jinja2Templates

from core.auth_views import SupabaseAuthRoutes
from core.medication_views import MedicationRoutes


class AppEntry:

    def __init__(self, app: FastAPI):
        self.templates = Jinja2Templates(directory="templates")
        self.app = app
        self.static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
        self._register_routes()


    def _register_routes(self):
        BasicRoutes(self.app, self.templates, self.static_dir)
        MedicationRoutes(self.app, self.templates)
        SupabaseAuthRoutes(self.app, self.templates)
        # TODO add mobile


class BasicRoutes:
    def __init__(self, app: FastAPI, templates: Jinja2Templates, static_dir: str):
        @app.get("/")
        async def home(request: Request):
            return templates.TemplateResponse(request, "index.html")

        @app.get("/favicon.ico")
        async def favicon(request: Request):
            return FileResponse(static_dir+"/favicon.ico", media_type="image/x-icon")
