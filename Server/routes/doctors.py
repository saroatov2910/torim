from fastapi import APIRouter, Depends, Response
from dto.appointments import ScheuledAppointmentDTO
from middlewares import auth_validation
from di import provide_doctors_manager
from managers.doctors import DoctorsManager

router = APIRouter(prefix="/doctors", tags=["doctors"])


@router.get("/")
async def all_doctors(
    user=Depends(auth_validation),
    doctors_manager: DoctorsManager = Depends(provide_doctors_manager),
):
    try:
        doctors = doctors_manager.all_doctors()
        return doctors
    except Exception as e:
        return Response(content=str(e), status_code=400)
