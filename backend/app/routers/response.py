from datetime import datetime

from fastapi import APIRouter, Depends, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.response import (
    FormResponseCreate,
    FormResponseResponse,
)
from app.services.response_service import (
    submit_response,
    get_responses,
    get_response,
    update_response,
)
from app.services.export_service import export_responses_to_excel

from app.services.export_service import (
    export_responses_to_excel,
    export_responses_to_pdf,
)


router = APIRouter(
    prefix="/api/forms/{form_id}/responses",
    tags=["Form Responses"]
)


@router.post(
    "",
    response_model=FormResponseResponse,
    status_code=status.HTTP_201_CREATED
)
def submit_authenticated_response(
    form_id: int,
    data: FormResponseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return submit_response(
        db,
        form_id,
        data,
        current_user
    )


@router.get(
    "",
    response_model=list[FormResponseResponse]
)
def get_form_responses(
    form_id: int,
    search: str | None = Query(
        default=None,
        description="Search text inside response answers"
    ),
    submitted_by: int | None = Query(
        default=None,
        description="Filter responses by user ID"
    ),
    from_date: datetime | None = Query(
        default=None,
        description="Show responses submitted from this date/time"
    ),
    to_date: datetime | None = Query(
        default=None,
        description="Show responses submitted until this date/time"
    ),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_responses(
        db=db,
        form_id=form_id,
        current_user=current_user,
        search=search,
        submitted_by=submitted_by,
        from_date=from_date,
        to_date=to_date
    )


@router.post(
    "/public",
    response_model=FormResponseResponse,
    status_code=status.HTTP_201_CREATED
)
def submit_public_response(
    form_id: int,
    data: FormResponseCreate,
    db: Session = Depends(get_db)
):
    return submit_response(
        db,
        form_id,
        data,
        current_user=None
    )


@router.get(
    "/export/excel"
)
def export_excel(
    form_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    output = export_responses_to_excel(
        db,
        form_id,
        current_user
    )

    filename = f"form_{form_id}_responses.xlsx"

    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )

@router.get(
    "/export/pdf"
)
def export_pdf(
    form_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    output = export_responses_to_pdf(
        db,
        form_id,
        current_user
    )

    filename = f"form_{form_id}_responses.pdf"

    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )


@router.get(
    "/{response_id}",
    response_model=FormResponseResponse
)
def get_single_response(
    form_id: int,
    response_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_response(
        db,
        form_id,
        response_id,
        current_user
    )


@router.put(
    "/{response_id}",
    response_model=FormResponseResponse
)
def update_form_response(
    form_id: int,
    response_id: int,
    data: FormResponseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return update_response(
        db,
        form_id,
        response_id,
        data,
        current_user
    )