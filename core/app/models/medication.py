from datetime import datetime
from typing import TYPE_CHECKING, Dict, Any, Optional, Union
from sqlalchemy import Column, BigInteger, String, Text, ForeignKey, JSON, DateTime, Index
from sqlalchemy.orm import relationship, Mapped

from .base import Base

if TYPE_CHECKING:
    from .profile import Profile


class Medication(Base):
    """
    Model for storing medication information.

    Attributes:
        id: Unique identifier for the medication
        profile_id: ID of the profile this medication belongs to
        title: Name or title of the medication
        scan_date: Date when the medication was scanned
        active_ingredients: List of active ingredients in text format
        scanned_text: Raw text extracted from the medication scan
        dosage: Dosage information
        prescription_details: Additional prescription details in JSON format
        image_url: URL of the uploaded medication image
        created_at: Timestamp when the record was created
        updated_at: Timestamp when the record was last updated
        profile: Reference to the associated profile
    """

    __tablename__ = "medications"  # Use plural form for table names

    id: Mapped[int] = Column(BigInteger, primary_key=True, autoincrement=True)
    profile_id: Mapped[int] = Column(
        BigInteger, 
        ForeignKey("profiles.id"), 
        nullable=False,
        comment="ID of the profile this medication belongs to"
    )
    title: Mapped[Optional[str]] = Column(
        String(length=255), 
        nullable=True,
        comment="Name or title of the medication"
    )
    scan_date: Mapped[datetime] = Column(
        DateTime, 
        default=datetime.utcnow,
        comment="Date when the medication was scanned"
    )
    active_ingredients: Mapped[Optional[str]] = Column(
        Text, 
        nullable=True,
        comment="List of active ingredients in text format"
    )
    scanned_text: Mapped[Optional[str]] = Column(
        Text, 
        nullable=True,
        comment="Raw text extracted from the medication scan"
    )
    dosage: Mapped[Optional[str]] = Column(
        String(length=255), 
        nullable=True,
        comment="Dosage information"
    )
    prescription_details: Mapped[Optional[Dict[str, Any]]] = Column(
        JSON, 
        nullable=True,
        comment="Additional prescription details in JSON format"
    )
    image_url: Mapped[Optional[str]] = Column(
        String(length=2048), 
        nullable=True,
        comment="URL of the uploaded medication image"
    )

    # Relationships
    profile: Mapped["Profile"] = relationship("Profile", back_populates="medications")

    # Indexes
    __table_args__ = (
        Index('idx_medication_profile_id', 'profile_id'),  # Add index for profile_id queries
        Index('idx_medication_scan_date', 'scan_date'),    # Add index for date-based queries
        Index('idx_medication_title', 'title'),            # Add index for title searches
    )

    def __repr__(self) -> str:
        return f"<Medication id={self.id} title='{self.title}'>"
