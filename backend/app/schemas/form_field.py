from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


ALLOWED_FIELD_TYPES = {
    "text",
    "number",
    "email",
    "date",
    "dropdown",
    "checkbox",
    "radio",
    "file",
    "rating",
}


class FieldOptionCreate(BaseModel):
    option_label: str = Field(
        ...,
        min_length=1,
        max_length=200
    )

    option_value: str = Field(
        ...,
        min_length=1,
        max_length=200
    )

    option_order: int = Field(
        ...,
        ge=1
    )


class FieldOptionResponse(BaseModel):
    id: int
    field_id: int
    option_label: str
    option_value: str
    option_order: int

    model_config = ConfigDict(
        from_attributes=True
    )


class FormFieldCreate(BaseModel):
    label: str = Field(
        ...,
        min_length=1,
        max_length=200
    )

    field_type: str

    is_required: bool = False

    field_order: int = Field(
        ...,
        ge=1
    )

    placeholder: str | None = Field(
        default=None,
        max_length=255
    )

    description: str | None = None

    condition_field_id: int | None = None

    condition_operator: str | None = None

    condition_value: str | None = None

    options: list[FieldOptionCreate] = []

    @field_validator("field_type")
    @classmethod
    def validate_field_type(cls, value: str):
        value = value.lower()

        if value not in ALLOWED_FIELD_TYPES:
            raise ValueError(
                "Invalid field type. "
                "Use text, number, email, date, dropdown, "
                "checkbox, radio, file, or rating"
            )

        return value


class FormFieldUpdate(BaseModel):
    label: str | None = Field(
        default=None,
        min_length=1,
        max_length=200
    )

    field_type: str | None = None

    is_required: bool | None = None

    field_order: int | None = Field(
        default=None,
        ge=1
    )

    placeholder: str | None = Field(
        default=None,
        max_length=255
    )

    description: str | None = None

    condition_field_id: int | None = None

    condition_operator: str | None = None

    condition_value: str | None = None

    options: list[FieldOptionCreate] | None = None

    @field_validator("field_type")
    @classmethod
    def validate_field_type(cls, value: str | None):
        if value is None:
            return value

        value = value.lower()

        if value not in ALLOWED_FIELD_TYPES:
            raise ValueError(
                "Invalid field type. "
                "Use text, number, email, date, dropdown, "
                "checkbox, radio, file, or rating"
            )

        return value


class FormFieldResponse(BaseModel):
    id: int
    form_id: int
    label: str
    field_type: str
    is_required: bool
    field_order: int
    placeholder: str | None
    description: str | None
    condition_field_id: int | None
    condition_operator: str | None
    condition_value: str | None
    created_at: datetime
    updated_at: datetime
    options: list[FieldOptionResponse] = []

    model_config = ConfigDict(
        from_attributes=True
    )