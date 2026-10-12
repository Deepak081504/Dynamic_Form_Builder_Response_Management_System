from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.form import Form
from app.models.user import User
from app.schemas.form import FormCreate, FormUpdate

from app.services.activity_log_service import create_activity_log


def create_form(
    db: Session,
    data: FormCreate,
    current_user: User
) -> Form:

    form = Form(
        title=data.title,
        description=data.description,
        created_by=current_user.id,
        is_enabled=True,
    )

    db.add(form)
    db.commit()
    db.refresh(form)

    return form


def get_forms(
    db: Session,
    current_user: User
) -> list[Form]:

    return (
        db.query(Form)
        .order_by(Form.id.desc())
        .all()
    )


def get_form(
    db: Session,
    form_id: int
) -> Form:

    form = (
        db.query(Form)
        .filter(Form.id == form_id)
        .first()
    )

    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form not found"
        )

    return form


def update_form(
    db: Session,
    form_id: int,
    data: FormUpdate,
    current_user: User
) -> Form:

    form = get_form(db, form_id)

    if (
        current_user.role.name != "ADMIN"
        and form.created_by != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this form"
        )

    if data.title is not None:
        form.title = data.title

    if data.description is not None:
        form.description = data.description

    db.commit()
    db.refresh(form)

    return form


def delete_form(
    db: Session,
    form_id: int,
    current_user: User
) -> None:

    form = get_form(db, form_id)

    if (
        current_user.role.name != "ADMIN"
        and form.created_by != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this form"
        )

    db.delete(form)
    db.commit()


def update_form_status(
    db: Session,
    form_id: int,
    enabled: bool,
    current_user: User
) -> Form:

    form = get_form(db, form_id)

    if (
        current_user.role.name != "ADMIN"
        and form.created_by != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to change this form"
        )

    form.is_enabled = enabled

    db.commit()
    db.refresh(form)

    return form