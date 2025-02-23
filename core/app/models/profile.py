from sqlalchemy import Column, BigInteger, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from .base import Base


class Profile(Base):
    """Model for user profiles."""

    __tablename__ = "profile"  # Match Supabase table name exactly

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(
        UUID(as_uuid=True), nullable=False, unique=True, index=True, default=uuid.uuid4
    )
    display_name = Column(Text, nullable=True)
    bio = Column(Text, nullable=True)

    # Relationships
    medications = relationship("Medication", back_populates="profile", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Profile id={self.id} display_name='{self.display_name}'>"
