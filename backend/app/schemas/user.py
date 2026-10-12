from datetime import datetime

from pydantic import BaseModel, ConfigDict, field_validator


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    role: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )

    @field_validator("role", mode="before")
    @classmethod
    def get_role_name(cls, value):
        if hasattr(value, "name"):
            return value.name

        return value