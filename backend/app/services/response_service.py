from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.form import Form
from app.models.form_field import FormField
from app.models.form_response import FormResponse
from app.models.response_detail import ResponseDetail
from app.models.user import User
from app.schemas.response import FormResponseCreate

from app.services.activity_log_service import create_activity_log
from app.services.response_history_service import create_response_history


def get_form(db: Session, form_id: int) -> Form:
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


def get_form_fields(
    db: Session,
    form_id: int
) -> list[FormField]:

    fields = (
        db.query(FormField)
        .filter(FormField.form_id == form_id)
        .order_by(FormField.field_order.asc())
        .all()
    )

    return fields


def validate_answers(
    db: Session,
    form_id: int,
    data: FormResponseCreate
) -> tuple[list[FormField], dict[int, str | None]]:

    fields = get_form_fields(db, form_id)

    if not fields:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This form has no fields"
        )

    submitted_answers: dict[int, str | None] = {}

    for item in data.answers:
        submitted_answers[item.field_id] = item.answer

    valid_field_ids = {field.id for field in fields}

    # Check field IDs
    for item in data.answers:
        if item.field_id not in valid_field_ids:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Field {item.field_id} does not belong to this form"
            )

    # Check required fields
    for field in fields:

        if not field.is_required:
            continue

        if field.id not in submitted_answers:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"{field.label} is required"
            )

        answer = submitted_answers[field.id]

        if answer is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"{field.label} is required"
            )

        if isinstance(answer, str) and not answer.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"{field.label} is required"
            )

    return fields, submitted_answers


def submit_response(
    db: Session,
    form_id: int,
    data: FormResponseCreate,
    current_user: User | None = None
) -> FormResponse:

    form = get_form(db, form_id)

    if not form.is_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This form is disabled"
        )

    fields, submitted_answers = validate_answers(
        db,
        form_id,
        data
    )

    response = FormResponse(
        form_id=form_id,
        submitted_by=current_user.id if current_user else None
    )

    db.add(response)
    db.flush()

    for field in fields:

        if field.id not in submitted_answers:
            continue

        answer = submitted_answers[field.id]

        detail = ResponseDetail(
            response_id=response.id,
            field_id=field.id,
            answer=str(answer) if answer is not None else None
        )

        db.add(detail)

    db.commit()
    db.refresh(response)

    # Activity log
    create_activity_log(
        db=db,
        user=current_user,
        action="RESPONSE_SUBMITTED",
        entity_type="FormResponse",
        entity_id=response.id,
        description=f"Response submitted for form '{form.title}'"
    )

    return response


def get_responses(
    db: Session,
    form_id: int,
    current_user: User,
    search: str | None = None,
    submitted_by: int | None = None,
    from_date: str | None = None,
    to_date: str | None = None
) -> list[FormResponse]:

    form = get_form(db, form_id)

    # Permission filtering
    if current_user.role.name == "ADMIN" or form.created_by == current_user.id:
        query = db.query(FormResponse).filter(
            FormResponse.form_id == form_id
        )
    else:
        query = db.query(FormResponse).filter(
            FormResponse.form_id == form_id,
            FormResponse.submitted_by == current_user.id
        )

    # Filter by submitted user
    if submitted_by is not None:
        query = query.filter(
            FormResponse.submitted_by == submitted_by
        )

    # Filter by date
    from datetime import datetime

    if from_date:
        try:
            from_datetime = datetime.fromisoformat(from_date)
            query = query.filter(
                FormResponse.submitted_at >= from_datetime
            )
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid from_date format. Use ISO format."
            )

    if to_date:
        try:
            to_datetime = datetime.fromisoformat(to_date)
            query = query.filter(
                FormResponse.submitted_at <= to_datetime
            )
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid to_date format. Use ISO format."
            )

    # Search inside response answers
    if search:
        query = (
            query
            .join(ResponseDetail, ResponseDetail.response_id == FormResponse.id)
            .filter(ResponseDetail.answer.ilike(f"%{search}%"))
            .distinct()
        )

    return query.order_by(
        FormResponse.submitted_at.desc()
    ).all()


def get_response(
    db: Session,
    form_id: int,
    response_id: int,
    current_user: User
) -> FormResponse:

    response = (
        db.query(FormResponse)
        .filter(
            FormResponse.id == response_id,
            FormResponse.form_id == form_id
        )
        .first()
    )

    if not response:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Response not found"
        )

    form = get_form(db, form_id)

    # Admin or form creator can view any response
    if (
        current_user.role.name == "ADMIN"
        or form.created_by == current_user.id
    ):
        return response

    # Normal user can view only their own response
    if response.submitted_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this response"
        )

    return response


def update_response(
    db: Session,
    form_id: int,
    response_id: int,
    data: FormResponseCreate,
    current_user: User
) -> FormResponse:

    response = (
        db.query(FormResponse)
        .filter(
            FormResponse.id == response_id,
            FormResponse.form_id == form_id
        )
        .first()
    )

    if not response:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Response not found"
        )

    form = get_form(db, form_id)

    # Admin or form creator can update any response
    is_admin = current_user.role.name == "ADMIN"
    is_form_creator = form.created_by == current_user.id

    # Normal user can update only their own response
    is_response_owner = response.submitted_by == current_user.id

    if not (
        is_admin
        or is_form_creator
        or is_response_owner
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this response"
        )

    if not form.is_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This form is disabled"
        )

    fields, submitted_answers = validate_answers(
        db,
        form_id,
        data
    )

    # Delete old response details
    (
        db.query(ResponseDetail)
        .filter(ResponseDetail.response_id == response.id)
        .delete(synchronize_session=False)
    )

    # Add updated answers
    for field in fields:

        if field.id not in submitted_answers:
            continue

        answer = submitted_answers[field.id]

        detail = ResponseDetail(
            response_id=response.id,
            field_id=field.id,
            answer=str(answer) if answer is not None else None
        )

        db.add(detail)

    db.commit()
    db.refresh(response)

    # Response history
    create_response_history(
        db=db,
        response=response,
        changed_by=current_user,
        changes="Response updated"
    )

    # Activity log
    create_activity_log(
        db=db,
        user=current_user,
        action="RESPONSE_UPDATED",
        entity_type="FormResponse",
        entity_id=response.id,
        description=f"Response updated for form '{form.title}'"
    )

    return response