from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class ResponseHistory(Base):
    __tablename__ = "response_history"

    id = Column(Integer, primary_key=True, index=True)

    response_id = Column(
        Integer,
        ForeignKey("form_responses.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    changed_by = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )

    changes = Column(Text, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    response = relationship(
        "FormResponse",
        backref="history"
    )

    user = relationship(
        "User",
        backref="response_history"
    )