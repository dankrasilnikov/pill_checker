from datetime import datetime
from typing import Optional
from sqlalchemy import Column, BigInteger, DateTime, String, Text, Index
from sqlalchemy.orm import Mapped

from .base import Base


class ScannedImage(Base):
    """
    Model for storing scanned medication images.

    Attributes:
        id: Unique identifier for the scanned image
        image: Name or identifier of the scanned image
        uploaded_at: Timestamp when the image was uploaded
        file_path: Path where the image is stored in the system
        created_at: Timestamp when the record was created
        updated_at: Timestamp when the record was last updated
    """

    __tablename__ = "scanned_images"  # Use plural form and snake_case for table names

    id: Mapped[int] = Column(BigInteger, primary_key=True, autoincrement=True)
    image: Mapped[str] = Column(
        String(length=255), nullable=False, comment="Name or identifier of the uploaded image"
    )
    uploaded_at: Mapped[datetime] = Column(
        DateTime, default=datetime.utcnow, comment="Timestamp when the image was uploaded"
    )
    file_path: Mapped[Optional[str]] = Column(
        Text, nullable=True, comment="Path where the image is stored in the system"
    )

    # Indexes
    __table_args__ = (
        Index("idx_scanned_images_uploaded_at", "uploaded_at"),  # Add index for timestamp queries
    )

    def __repr__(self) -> str:
        return f"<ScannedImage id={self.id} image='{self.image}'>"
