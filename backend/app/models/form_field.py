from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Boolean,
    Text,
)
from sqlalchemy.orm import relationship

from app.core.database import Base


class FormField(Base):
    __tablename__ = "form_fields"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    form_id = Column(
        Integer,
        ForeignKey("forms.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    label = Column(
        String(200),
        nullable=False
    )

    field_type = Column(
        String(50),
        nullable=False
    )

    is_required = Column(
        Boolean,
        default=False,
        nullable=False
    )

    field_order = Column(
        Integer,
        nullable=False
    )

    placeholder = Column(
        String(255),
        nullable=True
    )

    description = Column(
        Text,
        nullable=True
    )

    condition_field_id = Column(
        Integer,
        ForeignKey("form_fields.id", ondelete="SET NULL"),
        nullable=True
    )

    condition_operator = Column(
        String(50),
        nullable=True
    )

    condition_value = Column(
        String(255),
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    form = relationship(
        "Form",
        backref="fields"
    )

    condition_field = relationship(
        "FormField",
        remote_side=[id],
        foreign_keys=[condition_field_id]
    )