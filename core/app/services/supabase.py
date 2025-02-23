"""Unified Supabase service for authentication and profile management."""
from functools import lru_cache
from typing import Optional, Tuple, Dict, Any
from uuid import UUID

from fastapi import HTTPException, status
from postgrest import APIError
from supabase import Client, create_client
from supabase.lib.client_options import ClientOptions

from app.core.config import settings
from app.core.logging_config import logger
from app.schemas.profile import ProfileCreate, ProfileUpdate, ProfileInDB

class SupabaseService:
    """Unified service for Supabase operations."""
    
    def __init__(self):
        """Initialize Supabase client with proper configuration."""
        try:
            options = ClientOptions(
                postgrest_client_timeout=10,
                storage_client_timeout=30,
            )
            
            self.client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_KEY,
                options=options
            )
            
            # Test connection
            self.client.auth.get_session()
            logger.info("Supabase client initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize Supabase client: {e}")
            raise

    async def create_user_with_profile(
        self,
        email: str,
        password: str,
        display_name: Optional[str] = None
    ) -> Tuple[bool, Optional[Dict[str, Any]]]:
        """
        Create a new user and their profile.
        
        Args:
            email: User's email
            password: User's password
            display_name: Optional display name
            
        Returns:
            Tuple[bool, dict]: Success status and user data if successful
        """
        try:
            # Create auth user
            auth_response = await self.client.auth.sign_up({
                "email": email,
                "password": password,
            })
            
            if not auth_response or not auth_response.user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to create user"
                )
            
            # Create profile
            profile_data = ProfileCreate(
                user_id=auth_response.user.id,
                display_name=display_name or email.split('@')[0]
            )
            
            profile_response = await self.client.from_("profiles").insert(
                profile_data.model_dump(exclude_unset=True)
            ).execute()
            
            if not profile_response.data:
                # Rollback: delete auth user if profile creation fails
                await self.client.auth.admin.delete_user(auth_response.user.id)
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to create user profile"
                )
            
            return True, {
                "user_id": auth_response.user.id,
                "email": auth_response.user.email,
                "profile": profile_response.data[0]
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error creating user with profile: {e}")
            return False, None

    async def get_user_profile(self, user_id: UUID) -> Optional[ProfileInDB]:
        """
        Get user profile by user ID.
        
        Args:
            user_id: User's UUID from auth
            
        Returns:
            Optional[ProfileInDB]: Profile data if found
        """
        try:
            response = await self.client.from_("profiles").select("*").eq("user_id", user_id).single().execute()
            return ProfileInDB(**response.data) if response.data else None
        except Exception as e:
            logger.error(f"Error fetching user profile: {e}")
            return None

    async def update_user_profile(
        self,
        user_id: UUID,
        profile_data: ProfileUpdate
    ) -> Optional[ProfileInDB]:
        """
        Update user profile.
        
        Args:
            user_id: User's UUID from auth
            profile_data: Profile update data
            
        Returns:
            Optional[ProfileInDB]: Updated profile data if successful
        """
        try:
            response = await self.client.from_("profiles").update(
                profile_data.model_dump(exclude_unset=True)
            ).eq("user_id", user_id).execute()
            
            return ProfileInDB(**response.data[0]) if response.data else None
        except Exception as e:
            logger.error(f"Error updating user profile: {e}")
            return None

    async def delete_user_with_profile(self, user_id: UUID) -> bool:
        """
        Delete user and their profile.
        
        Args:
            user_id: User's UUID from auth
            
        Returns:
            bool: True if deletion was successful
        """
        try:
            # Delete profile first (due to foreign key constraint)
            await self.client.from_("profiles").delete().eq("user_id", user_id).execute()
            
            # Delete auth user
            await self.client.auth.admin.delete_user(user_id)
            return True
        except Exception as e:
            logger.error(f"Error deleting user with profile: {e}")
            return False

    async def authenticate_user(
        self,
        email: str,
        password: str
    ) -> Tuple[bool, Optional[Dict[str, Any]]]:
        """
        Authenticate user and return session data.
        
        Args:
            email: User's email
            password: User's password
            
        Returns:
            Tuple[bool, dict]: Success status and session data if successful
        """
        try:
            auth_response = await self.client.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            
            if not auth_response or not auth_response.user:
                return False, None
            
            # Get user profile
            profile = await self.get_user_profile(auth_response.user.id)
            
            return True, {
                "access_token": auth_response.session.access_token,
                "refresh_token": auth_response.session.refresh_token,
                "user": {
                    "id": auth_response.user.id,
                    "email": auth_response.user.email,
                    "profile": profile.model_dump() if profile else None
                }
            }
            
        except Exception as e:
            logger.error(f"Authentication error: {e}")
            return False, None

    async def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """
        Verify JWT token and return user data.
        
        Args:
            token: JWT token
            
        Returns:
            Optional[dict]: User data if token is valid
        """
        try:
            user = await self.client.auth.get_user(token)
            if not user:
                return None
                
            profile = await self.get_user_profile(user.id)
            
            return {
                "id": user.id,
                "email": user.email,
                "profile": profile.model_dump() if profile else None
            }
        except Exception as e:
            logger.error(f"Token verification error: {e}")
            return None

@lru_cache()
def get_supabase_service() -> SupabaseService:
    """Get or create Supabase service instance."""
    return SupabaseService() 