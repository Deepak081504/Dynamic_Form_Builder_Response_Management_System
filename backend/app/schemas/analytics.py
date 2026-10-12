from pydantic import BaseModel


class DashboardResponse(BaseModel):
    total_forms: int
    enabled_forms: int
    disabled_forms: int
    total_responses: int


class FormAnalyticsResponse(BaseModel):
    form_id: int
    form_title: str
    total_responses: int
    enabled: bool