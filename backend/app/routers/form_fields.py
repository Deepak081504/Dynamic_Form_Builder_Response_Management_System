from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.form_field import (
    FormFieldCreate,
    FormFieldUpdate,
    FormFieldResponse,
)
from app.services.form_field_service import (
    create_field,
    get_fields,
    get_field,
    update_field,
    delete_field,
)


router = APIRouter(
    prefix="/api/forms/{form_id}/fields",
    tags=["Form Fields"]
)


@router.post(
    "",
    response_model=FormFieldResponse,
    status_code=status.HTTP_201_CREATED
)
def create_form_field(
    form_id: int,
    data: FormFieldCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_field(
        db=db,
        form_id=form_id,
        data=data,
        current_user=current_user
    )


@router.get(
    "",
    response_model=list[FormFieldResponse]
)
def get_form_fields(
    form_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_fields(
        db=db,
        form_id=form_id,
        current_user=current_user
    )


@router.get(
    "/{field_id}",
    response_model=FormFieldResponse
)
def get_single_form_field(
    form_id: int,
    field_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    field = get_field(
        db=db,
        form_id=form_id,
        field_id=field_id
    )

    if field.form.created_by != current_user.id and current_user.role.name != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this field"
        )

    return field


@router.put(
    "/{field_id}",
    response_model=FormFieldResponse
)
def update_form_field(
    form_id: int,
    field_id: int,
    data: FormFieldUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return update_field(
        db=db,
        form_id=form_id,
        field_id=field_id,
        data=data,
        current_user=current_user
    )


@router.delete(
    "/{field_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_form_field(
    form_id: int,
    field_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    delete_field(
        db=db,
        form_id=form_id,
        field_id=field_id,
        current_user=current_user
    )

    return Response(status_code=status.HTTP_204_NO_CONTENT)