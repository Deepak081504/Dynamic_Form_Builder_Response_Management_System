from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.activity_log import ActivityLogResponse
from app.services.activity_log_service import get_activity_logs


router = APIRouter(
    prefix="/api/activity-logs",
    tags=["Activity Logs"]
)


@router.get(
    "",
    response_model=list[ActivityLogResponse]
)
def get_logs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_activity_logs(
        db,
        current_user
    )