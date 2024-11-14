from fastapi import APIRouter, Depends, Response, Body
from dto.auth import (
    UserLoginForm,
    PatientRegisterForm,
    DoctorRegisterForm,
    DoctorEditProfileDto,
)
from managers.auth import AuthManager
from di import provide_auth_manager
from middlewares import auth_validation
from entities import User

router = APIRouter(prefix="/auth", tags=["auth"])

#T Handle user login and return an access token
@router.post("/login")
async def login(
    form: UserLoginForm, user_manager: AuthManager = Depends(provide_auth_manager)
):
    try:
        print(form)
        token = user_manager.login_user(form)
        return {"access_token": token}
    except Exception as e:
        print(e)
        return Response(content=str(e), status_code=400)

#TODO conmments 
@router.post("/register_doctor")
async def register_doctor(
    form: DoctorRegisterForm, user_manager: AuthManager = Depends(provide_auth_manager)
):
    try:
        id = user_manager.register_user(form)
        return {"id": id}
    except Exception as e:
        return Response(content=str(e), status_code=400)

#TODO conmments 
@router.post("/register_patient")
async def register_patient(
    form: PatientRegisterForm, user_manager: AuthManager = Depends(provide_auth_manager)
):
    try:
        id = user_manager.register_user(form)
        return {"id": id}
    except Exception as e:
        return Response(content=str(e), status_code=400)

#TODO conmments 
@router.get("/me")
async def me(user=Depends(auth_validation)):
    return user

#TODO conmments 
@router.put("/edit-doctor")
async def edit_doctor(
    form: DoctorEditProfileDto,
    user: User = Depends(auth_validation),
    user_manager: AuthManager = Depends(provide_auth_manager),
):
    try:
        user = user_manager.edit_doctor(user, form)
        return user
    except Exception as e:
        return Response(content=str(e), status_code=400)
