import logging
import os

from fastapi import File, UploadFile, Depends, FastAPI
from fastapi import Request, HTTPException, status
from fastapi.responses import HTMLResponse, RedirectResponse
from starlette.templating import Jinja2Templates

from decorators import supabase_login_required
from models import Medication
from ocr_service import recognise


class MedicationRoutes:
    def __init__(self, app: FastAPI, templates: Jinja2Templates):
        STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "templates")
        logger = logging.getLogger(__name__)

        @app.post("/upload-image")
        async def upload_image(request: Request, image: UploadFile = File(...)):
            if not image.content_type.startswith("image/"):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid image file."
                )

            active_ingredients = recognise(image)
            request.session["active_ingredients"] = active_ingredients
            return RedirectResponse(url="/result", status_code=status.HTTP_200_OK)

        @app.get("/dashboard", name="dashboard", response_class=HTMLResponse)
        async def user_dashboard(request: Request, user=Depends(supabase_login_required)):
            medications = Medication.objects.filter(profile=user).order_by(F("scan_date").desc())
            return templates.TemplateResponse("dashboard.html", {"request": request, "medications": medications})

        @app.get("/result", name="result", response_class=HTMLResponse)
        async def show_result(request: Request):
            ingredients = request.session.get("active_ingredients", [])
            return templates.TemplateResponse(
                "result.html", {"request": request, "active_ingredients": ingredients}
            )
