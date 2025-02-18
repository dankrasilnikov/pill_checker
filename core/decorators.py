from fastapi import HTTPException, status, Request
from postgrest import APIError

from supabase_client import get_supabase_client


def supabase_login_required(request: Request):
    """
    Checks if a supabase_user is in the session. If not, raises an HTTPException.
    Otherwise, retrieves the corresponding user Profile and returns it.
    """
    supabase_user = request.session.get("supabase_user")
    if not supabase_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    try:
        # Query the profile from Supabase
        # TODO fixme
        profile = (
            get_supabase_client()
            .from_("profiles")
            .select("*")
            .eq("user_id", supabase_user)
            .single()
            .execute()
        )

        if not profile.data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Profile not found"
            )

        request.state.auth_user = profile.data
        return profile.data

    except APIError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error: {str(e)}"
        )
