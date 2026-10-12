from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    RefreshTokenRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ChangePasswordRequest,
    TokenResponse,
    MessageResponse,
)
from app.schemas.user import UserResponse
from app.services.auth_service import (
    register_user,
    login_user,
    refresh_access_token,
    create_password_reset_token,
    reset_password,
    change_password,
)


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):
    return register_user(db, data)


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):
    return login_user(db, data)


@router.post(
    "/refresh",
    response_model=TokenResponse
)
def refresh(
    data: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    return refresh_access_token(
        db,
        data.refresh_token
    )


@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user


@router.post(
    "/forgot-password",
    response_model=MessageResponse
)
def forgot_password(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    create_password_reset_token(
        db,
        data.email
    )

    return {
        "message": "If the email exists, a password reset request has been created."
    }


@router.post(
    "/reset-password",
    response_model=MessageResponse
)
def reset_password_endpoint(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    reset_password(
        db,
        data.token,
        data.new_password
    )

    return {
        "message": "Password reset successfully"
    }


@router.post(
    "/change-password",
    response_model=MessageResponse
)
def change_password_endpoint(
    data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    change_password(
        db,
        current_user,
        data
    )

    return {
        "message": "Password changed successfully"
    }