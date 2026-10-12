from sqlalchemy.orm import Session

from app.models.activity_log import ActivityLog
from app.models.user import User


def create_activity_log(
    db: Session,
    user: User | None,
    action: str,
    entity_type: str | None = None,
    entity_id: int | None = None,
    description: str | None = None
):
    log = ActivityLog(
        user_id=user.id if user else None,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        description=description
    )

    db.add(log)
    db.commit()
    db.refresh(log)

    return log


def get_activity_logs(
    db: Session,
    current_user: User
):
    query = db.query(ActivityLog)

    # Admin can view all activity logs.
    if current_user.role.name != "ADMIN":
        query = query.filter(
            ActivityLog.user_id == current_user.id
        )

    return (
        query
        .order_by(ActivityLog.created_at.desc())
        .all()
    )