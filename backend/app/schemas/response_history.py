from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ResponseHistoryResponse(BaseModel):
    id: int
    response_id: int
    changed_by: int | None
    changes: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)