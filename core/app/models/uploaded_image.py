from datetime import datetime
from sqlalchemy import Column, BigInteger, DateTime, String, Text

from .base import Base


class UploadedImage(Base):
    """Model for storing uploaded images."""

    __tablename__ = "uploadedimage"  # Match Supabase table name exactly

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    image = Column(String(length=255), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    file_path = Column(Text, nullable=True)

    def __repr__(self):
        return f"<UploadedImage id={self.id} image='{self.image}'>"
