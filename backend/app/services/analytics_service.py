from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.form import Form
from app.models.form_response import FormResponse
from app.models.user import User


def get_dashboard_analytics(
    db: Session,
    current_user: User
):
    if current_user.role.name == "ADMIN":
        forms_query = db.query(Form)
        responses_query = db.query(FormResponse)
    else:
        forms_query = db.query(Form).filter(
            Form.created_by == current_user.id
        )

        responses_query = db.query(FormResponse).join(
            Form,
            Form.id == FormResponse.form_id
        ).filter(
            Form.created_by == current_user.id
        )

    total_forms = forms_query.count()

    enabled_forms = forms_query.filter(
        Form.is_enabled.is_(True)
    ).count()

    disabled_forms = forms_query.filter(
        Form.is_enabled.is_(False)
    ).count()

    total_responses = responses_query.count()

    return {
        "total_forms": total_forms,
        "enabled_forms": enabled_forms,
        "disabled_forms": disabled_forms,
        "total_responses": total_responses
    }


def get_form_analytics(
    db: Session,
    form_id: int,
    current_user: User
):
    form = db.query(Form).filter(
        Form.id == form_id
    ).first()

    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form not found"
        )

    if (
        current_user.role.name != "ADMIN"
        and form.created_by != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this analytics"
        )

    total_responses = db.query(
        FormResponse
    ).filter(
        FormResponse.form_id == form_id
    ).count()

    return {
        "form_id": form.id,
        "form_title": form.title,
        "total_responses": total_responses,
        "enabled": form.is_enabled
    }