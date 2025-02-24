from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import Column, BigInteger, Text, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, Mapped
import uuid

from .base import Base

if TYPE_CHECKING:
    from .medication import Medication


class Profile(Base):
    """
    Model for user profiles.

    Attributes:
        id: Unique identifier for the profile
        user_id: UUID of the associated Supabase user
        display_name: Display name of the user
        bio: User's biography or description
        medications: List of medications associated with this profile
    """

    __tablename__ = "profiles"  # Use plural form for table names

    id: Mapped[int] = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[uuid.UUID] = Column(
        UUID(as_uuid=True), nullable=False, unique=True, index=True, default=uuid.uuid4,
        comment="UUID of the associated Supabase user"
    )
    display_name: Mapped[Optional[str]] = Column(Text, nullable=True, 
        comment="Display name of the user")
    bio: Mapped[Optional[str]] = Column(Text, nullable=True,
        comment="User's biography or description")

    # Relationships
    medications: Mapped[List["Medication"]] = relationship(
        "Medication", 
        back_populates="profile", 
        cascade="all, delete-orphan"
    )

    # Indexes
    __table_args__ = (
        Index('idx_profile_display_name', 'display_name'),  # Add index for display_name searches
    )

    def __repr__(self) -> str:
        return f"<Profile id={self.id} display_name='{self.display_name}'>"
