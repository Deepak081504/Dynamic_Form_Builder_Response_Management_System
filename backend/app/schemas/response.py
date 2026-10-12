from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ResponseAnswer(BaseModel):
    field_id: int
    answer: str | None = None


class FormResponseCreate(BaseModel):
    answers: list[ResponseAnswer] = Field(..., min_length=1)


class ResponseDetailResponse(BaseModel):
    id: int
    response_id: int
    field_id: int
    answer: str | None

    model_config = ConfigDict(from_attributes=True)


class FormResponseResponse(BaseModel):
    id: int
    form_id: int
    submitted_by: int | None
    submitted_at: datetime
    updated_at: datetime
    details: list[ResponseDetailResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)