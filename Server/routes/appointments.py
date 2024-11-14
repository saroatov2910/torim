from fastapi import APIRouter, Depends, Response
from dto.appointments import ScheuledAppointmentDTO
from middlewares import auth_validation
from di import provide_appointments_manager
from managers.appointments import AppointmentsManager

router = APIRouter(prefix="/appointments", tags=["appointments"])

@router.post("/schedule")
async def schedule_appointment(
    form: ScheuledAppointmentDTO,
    appointments_manager: AppointmentsManager = Depends(provide_appointments_manager),
    user=Depends(auth_validation),
):
    try:
        appointment = appointments_manager.schedule_appointment(form)
        return appointment
    except Exception as e:
        print(e)
        return Response(content=str(e), status_code=400)
