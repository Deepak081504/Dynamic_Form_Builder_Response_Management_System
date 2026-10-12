from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.form import Form
from app.models.form_field import FormField
from app.models.field_option import FieldOption
from app.models.user import User
from app.schemas.form_field import (
    FormFieldCreate,
    FormFieldUpdate,
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


def check_form_permission(
    form: Form,
    current_user: User
) -> None:

    if (
        current_user.role.name != "ADMIN"
        and form.created_by != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to modify this form"
        )


def create_field(
    db: Session,
    form_id: int,
    data: FormFieldCreate,
    current_user: User
) -> FormField:

    form = get_form(db, form_id)

    check_form_permission(
        form,
        current_user
    )

    if data.condition_field_id:

        condition_field = (
            db.query(FormField)
            .filter(
                FormField.id == data.condition_field_id,
                FormField.form_id == form_id
            )
            .first()
        )

        if not condition_field:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Condition field does not belong to this form"
            )

    if data.field_type not in [
        "dropdown",
        "checkbox",
        "radio"
    ] and data.options:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Options are only allowed for dropdown, checkbox, or radio fields"
        )

    field = FormField(
        form_id=form_id,
        label=data.label,
        field_type=data.field_type,
        is_required=data.is_required,
        field_order=data.field_order,
        placeholder=data.placeholder,
        description=data.description,
        condition_field_id=data.condition_field_id,
        condition_operator=data.condition_operator,
        condition_value=data.condition_value,
    )

    db.add(field)
    db.flush()

    for option in data.options:

        field_option = FieldOption(
            field_id=field.id,
            option_label=option.option_label,
            option_value=option.option_value,
            option_order=option.option_order,
        )

        db.add(field_option)

    db.commit()
    db.refresh(field)

    return field


def get_fields(
    db: Session,
    form_id: int,
    current_user: User
) -> list[FormField]:

    form = get_form(
        db,
        form_id
    )

    if (
        current_user.role.name != "ADMIN"
        and form.created_by != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view these fields"
        )

    return (
        db.query(FormField)
        .filter(FormField.form_id == form_id)
        .order_by(FormField.field_order.asc())
        .all()
    )


def get_field(
    db: Session,
    form_id: int,
    field_id: int
) -> FormField:

    field = (
        db.query(FormField)
        .filter(
            FormField.id == field_id,
            FormField.form_id == form_id
        )
        .first()
    )

    if not field:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form field not found"
        )

    return field


def update_field(
    db: Session,
    form_id: int,
    field_id: int,
    data: FormFieldUpdate,
    current_user: User
) -> FormField:

    form = get_form(
        db,
        form_id
    )

    check_form_permission(
        form,
        current_user
    )

    field = get_field(
        db,
        form_id,
        field_id
    )

    if data.condition_field_id:

        if data.condition_field_id == field_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A field cannot depend on itself"
            )

        condition_field = (
            db.query(FormField)
            .filter(
                FormField.id == data.condition_field_id,
                FormField.form_id == form_id
            )
            .first()
        )

        if not condition_field:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Condition field does not belong to this form"
            )

    if data.field_type is not None:

        if data.field_type not in [
            "dropdown",
            "checkbox",
            "radio"
        ] and data.options:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Options are only allowed for dropdown, checkbox, or radio fields"
            )

        field.field_type = data.field_type

    if data.label is not None:
        field.label = data.label

    if data.is_required is not None:
        field.is_required = data.is_required

    if data.field_order is not None:
        field.field_order = data.field_order

    if data.placeholder is not None:
        field.placeholder = data.placeholder

    if data.description is not None:
        field.description = data.description

    if data.condition_field_id is not None:
        field.condition_field_id = data.condition_field_id

    if data.condition_operator is not None:
        field.condition_operator = data.condition_operator

    if data.condition_value is not None:
        field.condition_value = data.condition_value

    if data.options is not None:

        db.query(FieldOption).filter(
            FieldOption.field_id == field.id
        ).delete(
            synchronize_session=False
        )

        for option in data.options:

            field_option = FieldOption(
                field_id=field.id,
                option_label=option.option_label,
                option_value=option.option_value,
                option_order=option.option_order,
            )

            db.add(field_option)

    db.commit()
    db.refresh(field)

    return field


def delete_field(
    db: Session,
    form_id: int,
    field_id: int,
    current_user: User
) -> None:

    form = get_form(
        db,
        form_id
    )

    check_form_permission(
        form,
        current_user
    )

    field = get_field(
        db,
        form_id,
        field_id
    )

    db.delete(field)
    db.commit()