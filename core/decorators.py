from fastapi import HTTPException, status, Request
from models import Profile


def supabase_login_required(request: Request):
    """
    Checks if a supabase_user is in the session. If not, raises an HTTPException.
    Otherwise, retrieves the corresponding user Profile and returns it.
    """
    supabase_user = request.session.get("supabase_user")
    if not supabase_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    try:
        auth_user = Profile.objects.get(user_id=supabase_user)
    except Profile.DoesNotExist:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Profile not found")

    request.state.auth_user = auth_user

    return auth_user
