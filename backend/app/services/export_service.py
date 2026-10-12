from io import BytesIO

from fastapi import HTTPException, status
from openpyxl import Workbook
from sqlalchemy.orm import Session

from app.models.form import Form
from app.models.form_response import FormResponse
from app.models.form_field import FormField
from app.models.user import User

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle


def export_responses_to_excel(
    db: Session,
    form_id: int,
    current_user: User
):
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

    if (
        current_user.role.name != "ADMIN"
        and form.created_by != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to export this form responses"
        )

    fields = (
        db.query(FormField)
        .filter(FormField.form_id == form_id)
        .order_by(FormField.field_order.asc())
        .all()
    )

    responses = (
        db.query(FormResponse)
        .filter(FormResponse.form_id == form_id)
        .order_by(FormResponse.submitted_at.desc())
        .all()
    )

    workbook = Workbook()
    worksheet = workbook.active
    worksheet.title = "Responses"

    headers = [
        "Response ID",
        "Submitted By",
        "Submitted At"
    ]

    headers.extend(field.label for field in fields)

    worksheet.append(headers)

    for response in responses:
        answer_map = {
            detail.field_id: detail.answer
            for detail in response.details
        }

        row = [
            response.id,
            response.submitted_by,
            response.submitted_at
        ]

        for field in fields:
            row.append(
                answer_map.get(field.id)
            )

        worksheet.append(row)

    for column in worksheet.columns:
        max_length = 0
        column_letter = column[0].column_letter

        for cell in column:
            value = "" if cell.value is None else str(cell.value)
            max_length = max(max_length, len(value))

        worksheet.column_dimensions[column_letter].width = min(
            max_length + 2,
            40
        )

    output = BytesIO()
    workbook.save(output)
    output.seek(0)

    return output

def export_responses_to_pdf(
    db: Session,
    form_id: int,
    current_user: User
):
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

    if (
        current_user.role.name != "ADMIN"
        and form.created_by != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to export this form responses"
        )

    fields = (
        db.query(FormField)
        .filter(FormField.form_id == form_id)
        .order_by(FormField.field_order.asc())
        .all()
    )

    responses = (
        db.query(FormResponse)
        .filter(FormResponse.form_id == form_id)
        .order_by(FormResponse.submitted_at.desc())
        .all()
    )

    output = BytesIO()

    document = SimpleDocTemplate(
        output,
        pagesize=landscape(A4),
        rightMargin=20,
        leftMargin=20,
        topMargin=20,
        bottomMargin=20
    )

    headers = [
        "Response ID",
        "Submitted By",
        "Submitted At"
    ]

    headers.extend(field.label for field in fields)

    table_data = [headers]

    for response in responses:
        answer_map = {
            detail.field_id: detail.answer
            for detail in response.details
        }

        row = [
            str(response.id),
            str(response.submitted_by or "Public"),
            str(response.submitted_at)
        ]

        for field in fields:
            row.append(
                str(answer_map.get(field.id, ""))
            )

        table_data.append(row)

    table = Table(
        table_data,
        repeatRows=1
    )

    table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
            ("FONTSIZE", (0, 0), (-1, -1), 8),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 4),
            ("RIGHTPADDING", (0, 0), (-1, -1), 4),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ])
    )

    document.build([table])

    output.seek(0)

    return output