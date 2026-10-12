from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.auth import router as auth_router
from app.routers.form import router as form_router
from app.routers.form_fields import router as form_fields_router
from app.routers.response import router as response_router
from app.routers.activity_logs import router as activity_logs_router
from app.routers.analytics import router as analytics_router
from app.routers.response_history import router as response_history_router


app = FastAPI(
    title="Dynamic Form Builder & Response Management System",
    version="1.0.0"
)

# CORS configuration for Frontend integration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(form_router)
app.include_router(form_fields_router)
app.include_router(response_router)
app.include_router(activity_logs_router)
app.include_router(analytics_router)
app.include_router(response_history_router)


@app.get("/")
def root():
    return {"message": "Dynamic Form Builder API is running"}