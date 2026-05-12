from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import datetime
from ..database import db
from ..schemas.user_schema import UserCreate, UserOut, Token, UserLogin
from ..utils.security import get_password_hash, verify_password, create_access_token
from ..middleware.auth_middleware import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=UserOut)
async def register(user_in: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_in.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = user_in.dict()
    user_dict["password"] = get_password_hash(user_dict.pop("password"))
    user_dict["created_at"] = datetime.utcnow()
    
    result = await db.users.insert_one(user_dict)
    user_dict["_id"] = str(result.inserted_id)
    return user_dict

@router.post("/login", response_model=Token)
async def login(user_in: UserLogin):
    user = await db.users.find_one({"email": user_in.email})
    if not user or not verify_password(user_in.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/profile", response_model=UserOut)
async def get_profile(current_user: dict = Depends(get_current_user)):
    return current_user
