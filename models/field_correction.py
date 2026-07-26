from models import db
from datetime import datetime


class FieldCorrection(db.Model):

    __tablename__ = "field_corrections"

    id = db.Column(db.Integer, primary_key=True)

    entry_id = db.Column(
        db.Integer,
        db.ForeignKey("dataset_entries.id"),
        nullable=False
    )

    field_name = db.Column(
        db.String(100),
        nullable=False
    )

    comment = db.Column(
        db.Text,
        nullable=False
    )

    created_by = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    is_active = db.Column(
        db.Boolean,
        default=True
    )

    __table_args__ = (
        db.UniqueConstraint(
            "entry_id",
            "field_name",
            name="uq_entry_field_comment"
        ),
    )