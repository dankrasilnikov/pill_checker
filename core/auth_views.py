import logging

from fastapi import Request, Depends, Form, status, FastAPI
from fastapi.openapi.models import Response
from fastapi.responses import HTMLResponse, RedirectResponse
import os

from starlette.templating import Jinja2Templates

from auth_service import sign_up_user, sign_in_user
from decorators import supabase_login_required
from forms import ProfileUpdateForm
from models import Profile


class SupabaseAuthRoutes:
    def __init__(self, app: FastAPI, templates: Jinja2Templates):
        STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "templates")
        logger = logging.getLogger(__name__)

        @app.post("/signup", name="signup", response_class=HTMLResponse)
        def supabase_signup_view(request):
            email = request.POST.get("email")
            password = request.POST.get("password")
            request.POST.get("username", email)
            try:
                result = sign_up_user(email, password)
                if result and hasattr(result, "user"):
                    request.session["supabase_user"] = result.user.id
                    request.user = result.user

                    Profile.objects.create(user_id=result.user.id, defaults={"display_name": email})
                    logger.success(request, "Signed up successfully. Please log in.")
                    return RedirectResponse(url="/login", status_code=status.HTTP_200_OK)
                else:
                    logger.error(request, "Sign-up failed. Check your email/password.")
                    return RedirectResponse(
                        url="/signup?error=Sign-up failed. Check your email/password.",
                        status_code=status.HTTP_400_BAD_REQUEST,
                    )
            except Exception as e:
                logger.error(request, f"Sign-up error: {e}")
                return RedirectResponse(
                    url="/signup?error=Sign-up error: {e}", status_code=status.HTTP_400_BAD_REQUEST
                )

        @app.get("/signup", name="signup", response_class=HTMLResponse)
        def supabase_signup_view():
            return RedirectResponse(url="/signup", status_code=status.HTTP_200_OK)

        @app.post("/login", name="login", response_class=HTMLResponse)
        def supabase_login_view(
            request: Request,
            email: str = Form(...),
            password: str = Form(...),
        ):
            try:
                result = sign_in_user(email, password)
                if result and hasattr(result, "user"):
                    request.session["supabase_user"] = result.user.id
                    request.user = result.user

                    # Ensure the profile exists
                    Profile.objects.get_or_create(
                        user_id=result.user.id, defaults={"display_name": email}
                    )

                    logger.success(request, "Successfully logged in!")
                    return RedirectResponse(url="/dashboard", status_code=status.HTTP_200_OK)
                else:
                    logger.error(request, "Invalid credentials or login failed.")
                    return Response(description="Invalid credentials or login failed")
            except Profile.DoesNotExist:
                logger.error("Profile does not exist for user: %s", email)
                return RedirectResponse(
                    url="/login?error=Profile does not exist.",
                    status_code=status.HTTP_404_NOT_FOUND,
                )
            except Exception:
                logger.exception("Supabase login error for user: %s", email)
                return RedirectResponse(
                    url="/login?error=Supabase login error for user",
                    status_code=status.HTTP_403_FORBIDDEN,
                )

        @app.get("/login", name="login", response_class=HTMLResponse)
        def get_supabase_login_view(request: Request):
            return templates.TemplateResponse("login.html", {"request": request})

        @app.post("/logout", name="logout", response_class=HTMLResponse)
        def supabase_logout_view(request: Request):
            # TODO Implement logging out from supabase
            return RedirectResponse(url="/logout", status_code=status.HTTP_200_OK)

        @app.get("/logout", name="logout", response_class=HTMLResponse)
        def supabase_logout_view(request: Request):
            return templates.TemplateResponse("logout.html", {"request": request})

        @app.post("/profile/update", name="update_profile", response_class=HTMLResponse)
        async def update_profile(
            profile_updates: ProfileUpdateForm, user=Depends(supabase_login_required)
        ):
            try:
                profile = Profile.objects.get(user_id=user.id)
            except Profile.DoesNotExist:
                return RedirectResponse(
                    url="/profile/update?error=Profile does not exist.",
                    status_code=status.HTTP_404_NOT_FOUND,
                )
            try:
                profile.display_name = profile_updates.display_name
                profile.bio = profile_updates.bio
                profile.save()
            except Exception as e:
                logger.exception("Profile update error:")
                return RedirectResponse(
                    url=f"/profile/update?error=Profile update error: {e}",
                    status_code=status.HTTP_400_BAD_REQUEST,
                )

            return RedirectResponse(url="/dashboard", status_code=status.HTTP_200_OK)
