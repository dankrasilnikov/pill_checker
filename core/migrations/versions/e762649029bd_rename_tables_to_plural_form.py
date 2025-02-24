"""Rename tables to plural form

Revision ID: e762649029bd
Revises: a78d164b6898
Create Date: 2025-02-24 21:48:01.124857

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "e762649029bd"
down_revision: Union[str, None] = "a78d164b6898"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop foreign key constraint first
    op.drop_constraint("medication_profile_id_fkey", "medication", type_="foreignkey")

    # Drop indexes that reference the old table names
    op.drop_index("idx_medication_profile_id", table_name="medication")
    op.drop_index("idx_medication_scan_date", table_name="medication")
    op.drop_index("idx_medication_title", table_name="medication")
    op.drop_index("idx_profile_display_name", table_name="profile")
    op.drop_index("idx_uploadedimage_uploaded_at", table_name="uploadedimage")
    op.drop_index("ix_profile_user_id", table_name="profile")

    # Rename tables
    op.rename_table("profile", "profiles")
    op.rename_table("medication", "medications")
    op.rename_table("uploadedimage", "uploadedimages")

    # Recreate indexes with new table names
    op.create_index("idx_medications_profile_id", "medications", ["profile_id"])
    op.create_index("idx_medications_scan_date", "medications", ["scan_date"])
    op.create_index("idx_medications_title", "medications", ["title"])
    op.create_index("idx_profiles_display_name", "profiles", ["display_name"])
    op.create_index("idx_uploadedimages_uploaded_at", "uploadedimages", ["uploaded_at"])
    op.create_index("ix_profiles_user_id", "profiles", ["user_id"], unique=True)

    # Recreate foreign key constraint with new table names
    op.create_foreign_key(
        "medications_profile_id_fkey", "medications", "profiles", ["profile_id"], ["id"]
    )


def downgrade() -> None:
    # Drop foreign key constraint first
    op.drop_constraint("medications_profile_id_fkey", "medications", type_="foreignkey")

    # Drop indexes that reference the new table names
    op.drop_index("idx_medications_profile_id", table_name="medications")
    op.drop_index("idx_medications_scan_date", table_name="medications")
    op.drop_index("idx_medications_title", table_name="medications")
    op.drop_index("idx_profiles_display_name", table_name="profiles")
    op.drop_index("idx_uploadedimages_uploaded_at", table_name="uploadedimages")
    op.drop_index("ix_profiles_user_id", table_name="profiles")

    # Rename tables back
    op.rename_table("profiles", "profile")
    op.rename_table("medications", "medication")
    op.rename_table("uploadedimages", "uploadedimage")

    # Recreate indexes with old table names
    op.create_index("idx_medication_profile_id", "medication", ["profile_id"])
    op.create_index("idx_medication_scan_date", "medication", ["scan_date"])
    op.create_index("idx_medication_title", "medication", ["title"])
    op.create_index("idx_profile_display_name", "profile", ["display_name"])
    op.create_index("idx_uploadedimage_uploaded_at", "uploadedimage", ["uploaded_at"])
    op.create_index("ix_profile_user_id", "profile", ["user_id"], unique=True)

    # Recreate foreign key constraint with old table names
    op.create_foreign_key(
        "medication_profile_id_fkey", "medication", "profile", ["profile_id"], ["id"]
    )
