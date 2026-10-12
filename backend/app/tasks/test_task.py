from app.core.celery_app import celery_app


@celery_app.task
def test_task(message: str):
    return f"Celery task completed: {message}"