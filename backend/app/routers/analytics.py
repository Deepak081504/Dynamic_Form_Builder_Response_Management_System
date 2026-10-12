from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.analytics import (
    DashboardResponse,
    FormAnalyticsResponse,
)
from app.services.analytics_service import (
    get_dashboard_analytics,
    get_form_analytics,
)


router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics"]
)


@router.get(
    "/dashboard",
    response_model=DashboardResponse
)
def dashboard_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_dashboard_analytics(
        db,
        current_user
    )


@router.get(
    "/forms/{form_id}",
    response_model=FormAnalyticsResponse
)
def form_analytics(
    form_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_form_analytics(
        db,
        form_id,
        current_user
    )