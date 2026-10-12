from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.form_response import FormResponse
from app.models.user import User
from app.schemas.response_history import ResponseHistoryResponse
from app.services.response_history_service import get_response_history


router = APIRouter(
    prefix="/api/forms/{form_id}/responses/{response_id}/history",
    tags=["Response History"]
)


@router.get(
    "",
    response_model=list[ResponseHistoryResponse]
)
def get_history(
    form_id: int,
    response_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    response = (
        db.query(FormResponse)
        .filter(
            FormResponse.id == response_id,
            FormResponse.form_id == form_id
        )
        .first()
    )

    from fastapi import HTTPException, status

    if not response:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Response not found"
        )

    return get_response_history(
        db,
        response,
        current_user
    )