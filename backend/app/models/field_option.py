from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class FieldOption(Base):
    __tablename__ = "field_options"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    field_id = Column(
        Integer,
        ForeignKey("form_fields.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    option_label = Column(
        String(200),
        nullable=False
    )

    option_value = Column(
        String(200),
        nullable=False
    )

    option_order = Column(
        Integer,
        nullable=False
    )

    field = relationship(
        "FormField",
        backref="options"
    )