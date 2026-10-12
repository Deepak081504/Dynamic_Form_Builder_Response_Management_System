from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    Text,
)
from sqlalchemy.orm import relationship

from app.core.database import Base


class ResponseDetail(Base):
    __tablename__ = "response_details"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    response_id = Column(
        Integer,
        ForeignKey(
            "form_responses.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    field_id = Column(
        Integer,
        ForeignKey(
            "form_fields.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    answer = Column(
        Text,
        nullable=True
    )

    response = relationship(
        "FormResponse",
        back_populates="details"
    )

    field = relationship(
        "FormField",
        backref="response_details"
    )