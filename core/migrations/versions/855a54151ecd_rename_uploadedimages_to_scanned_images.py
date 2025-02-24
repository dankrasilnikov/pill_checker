"""Rename uploadedimages to scanned_images

Revision ID: 855a54151ecd
Revises: e762649029bd
Create Date: 2025-02-24 21:52:23.598836

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '855a54151ecd'
down_revision: Union[str, None] = 'e762649029bd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop the old index
    op.drop_index('idx_uploadedimages_uploaded_at', table_name='uploadedimages')

    # Rename the table
    op.rename_table('uploadedimages', 'scanned_images')

    # Create new index with new name
    op.create_index('idx_scanned_images_uploaded_at', 'scanned_images', ['uploaded_at'])


def downgrade() -> None:
    # Drop the new index
    op.drop_index('idx_scanned_images_uploaded_at', table_name='scanned_images')

    # Rename the table back
    op.rename_table('scanned_images', 'uploadedimages')

    # Recreate old index
    op.create_index('idx_uploadedimages_uploaded_at', 'uploadedimages', ['uploaded_at'])
