from fastapi import File, UploadFile, Depends
from fastapi import Request, HTTPException, status
from fastapi.responses import HTMLResponse, RedirectResponse

from core.main import app, templates
from decorators import supabase_login_required
from models import Medication
from ocr_service import recognise


@app.post("/upload-image")
async def upload_image(request: Request, image: UploadFile = File(...)):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid image file.")

    active_ingredients = recognise(image)
    request.session["active_ingredients"] = active_ingredients
    return RedirectResponse(url="/result", status_code=status.HTTP_200_OK)


@app.get("/dashboard", response_class=HTMLResponse)
def user_dashboard(user=Depends(supabase_login_required)):
    medications = Medication.objects.filter(profile=user).order_by(F("scan_date").desc())
    return templates.TemplateResponse("dashboard.html", {"medications": medications})


@app.get("/result", response_class=HTMLResponse)
async def show_result(request: Request):
    ingredients = request.session.get("active_ingredients", [])
    return templates.TemplateResponse(
        "result.html", {"request": request, "active_ingredients": ingredients}
    )


@app.get("/", response_class=HTMLResponse)
def index():
    return templates.TemplateResponse("index.html")
