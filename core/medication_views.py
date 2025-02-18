import logging

from fastapi import File, UploadFile, Depends, FastAPI
from fastapi import Request, HTTPException, status
from fastapi.responses import HTMLResponse, RedirectResponse
from starlette.templating import Jinja2Templates

from decorators import supabase_login_required
from ocr_service import recognise
from supabase_client import get_supabase_client


class MedicationRoutes:
    def __init__(self, app: FastAPI, templates: Jinja2Templates):
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
            logger.info(f"Accessing dashboard with user: {user}")
            try:
                # Get medications from Supabase, ordered by scan_date descending
                medications_response = (
                    get_supabase_client()
                    .from_("medications")
                    .select("*")
                    .eq("user_id", user["user_id"])
                    .order("scan_date", desc=True)
                    .execute()
                )

                medications = medications_response.data

                # Ensure the response is properly rendered
                response = templates.TemplateResponse(
                    "dashboard.html", {"request": request, "medications": medications, "user": user}
                )
                return response

            except Exception:
                logger.exception("Dashboard error:")
                response = RedirectResponse(
                    url="/login?error=Error loading dashboard",
                    status_code=status.HTTP_303_SEE_OTHER,
                )
                response.headers["Location"] = "/login?error=Error loading dashboard"
                return response

        @app.get("/result", name="result", response_class=HTMLResponse)
        async def show_result(request: Request):
            ingredients = request.session.get("active_ingredients", [])
            return templates.TemplateResponse(
                "result.html", {"request": request, "active_ingredients": ingredients}
            )
