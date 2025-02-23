from datetime import datetime
from sqlalchemy import Column, BigInteger, String, Text, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship

from .base import Base


class Medication(Base):
    """Model for storing medication information."""

    __tablename__ = "medication"  # Match Supabase table name exactly

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    profile_id = Column(BigInteger, ForeignKey("profile.id"), nullable=False)
    title = Column(String(length=255), nullable=True)
    scan_date = Column(DateTime, default=datetime.utcnow)
    active_ingredients = Column(Text, nullable=True)
    scanned_text = Column(Text, nullable=True)
    dosage = Column(String(length=255), nullable=True)
    prescription_details = Column(JSON, nullable=True)

    # Relationships
    profile = relationship("Profile", back_populates="medications")

    def __repr__(self):
        return f"<Medication id={self.id} title='{self.title}'>"
