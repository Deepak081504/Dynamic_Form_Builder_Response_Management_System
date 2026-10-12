from sqlalchemy.orm import Session

from app.models.form_response import FormResponse
from app.models.response_history import ResponseHistory
from app.models.user import User


def create_response_history(
    db: Session,
    response: FormResponse,
    changed_by: User | None,
    changes: str
):
    history = ResponseHistory(
        response_id=response.id,
        changed_by=changed_by.id if changed_by else None,
        changes=changes
    )

    db.add(history)
    db.commit()
    db.refresh(history)

    return history


def get_response_history(
    db: Session,
    response: FormResponse,
    current_user: User
):
    form = response.form

    if (
        current_user.role.name != "ADMIN"
        and form.created_by != current_user.id
        and response.submitted_by != current_user.id
    ):
        from fastapi import HTTPException, status

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view response history"
        )

    return (
        db.query(ResponseHistory)
        .filter(ResponseHistory.response_id == response.id)
        .order_by(ResponseHistory.created_at.desc())
        .all()
    )