from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
)

from sqlalchemy.orm import relationship

from app.core.database import Base


class FormResponse(Base):
    __tablename__ = "form_responses"

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

    submitted_by = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )

    submitted_at = Column(
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
        backref="responses"
    )

    user = relationship(
        "User",
        backref="form_responses"
    )

    details = relationship(
        "ResponseDetail",
        back_populates="response",
        cascade="all, delete-orphan"
    )