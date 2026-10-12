from datetime import datetime, timedelta, timezone
import secrets

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.role import Role
from app.models.user import User
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.core.config import settings
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    ChangePasswordRequest,
)


def register_user(
    db: Session,
    data: RegisterRequest
) -> User:

    existing_user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    role_name = data.role.upper()

    if role_name not in ["ADMIN", "USER"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role. Use ADMIN or USER"
        )

    role = (
        db.query(Role)
        .filter(Role.name == role_name)
        .first()
    )

    if not role:
        role = Role(name=role_name)
        db.add(role)
        db.flush()

    user = User(
        full_name=data.full_name,
        email=data.email,
        password_hash=hash_password(data.password),
        role_id=role.id,
        is_active=True,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def login_user(
    db: Session,
    data: LoginRequest
) -> dict:

    user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(
        data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )

    access_token = create_access_token(
        {
            "sub": str(user.id),
            "role": user.role.name,
        }
    )

    refresh_token = create_refresh_token(
        {
            "sub": str(user.id),
            "role": user.role.name,
        }
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


def refresh_access_token(
    db: Session,
    refresh_token: str
) -> dict:

    payload = decode_token(refresh_token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

    user = (
        db.query(User)
        .filter(User.id == int(user_id))
        .first()
    )

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )

    access_token = create_access_token(
        {
            "sub": str(user.id),
            "role": user.role.name,
        }
    )

    new_refresh_token = create_refresh_token(
        {
            "sub": str(user.id),
            "role": user.role.name,
        }
    )

    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
    }


def create_password_reset_token(
    db: Session,
    email: str
) -> str:

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    # Do not reveal whether email exists.
    if not user:
        return ""

    token = secrets.token_urlsafe(32)

    user.reset_token = token
    user.reset_token_expires = (
        datetime.now(timezone.utc)
        + timedelta(minutes=30)
    )

    db.commit()

    return token


def reset_password(
    db: Session,
    token: str,
    new_password: str
) -> None:

    user = (
        db.query(User)
        .filter(User.reset_token == token)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reset token"
        )

    if not user.reset_token_expires:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reset token"
        )

    if user.reset_token_expires < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset token has expired"
        )

    user.password_hash = hash_password(new_password)

    user.reset_token = None
    user.reset_token_expires = None

    db.commit()


def change_password(
    db: Session,
    user: User,
    data: ChangePasswordRequest
) -> None:

    if not verify_password(
        data.current_password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )

    if data.current_password == data.new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different"
        )

    user.password_hash = hash_password(
        data.new_password
    )

    db.commit()