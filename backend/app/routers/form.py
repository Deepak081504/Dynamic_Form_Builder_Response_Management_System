from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.form import (
    FormCreate,
    FormUpdate,
    FormResponse,
    FormStatusResponse,
)
from app.services.form_service import (
    create_form,
    get_forms,
    get_form,
    update_form,
    delete_form,
    update_form_status,
)


router = APIRouter(
    prefix="/api/forms",
    tags=["Forms"]
)


@router.post(
    "",
    response_model=FormResponse,
    status_code=status.HTTP_201_CREATED
)
def create(
    data: FormCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_form(
        db,
        data,
        current_user
    )


@router.get(
    "",
    response_model=list[FormResponse]
)
def list_forms(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_forms(
        db,
        current_user
    )


@router.get(
    "/{form_id}",
    response_model=FormResponse
)
def get(
    form_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_form(
        db,
        form_id
    )


@router.put(
    "/{form_id}",
    response_model=FormResponse
)
def update(
    form_id: int,
    data: FormUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return update_form(
        db,
        form_id,
        data,
        current_user
    )


@router.delete(
    "/{form_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete(
    form_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    delete_form(
        db,
        form_id,
        current_user
    )

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.patch(
    "/{form_id}/enable",
    response_model=FormStatusResponse
)
def enable(
    form_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return update_form_status(
        db,
        form_id,
        True,
        current_user
    )


@router.patch(
    "/{form_id}/disable",
    response_model=FormStatusResponse
)
def disable(
    form_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return update_form_status(
        db,
        form_id,
        False,
        current_user
    )