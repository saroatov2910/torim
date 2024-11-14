from dto.appointments import ScheuledAppointmentDTO
from database import Session
from entities import Appointment, User
from managers.auth import AuthManager
from sqlalchemy.orm import joinedload
class AppointmentsManager:

    user_manager = AuthManager()

    def __init__(self):
        pass

    def schedule_appointment(self, dto: ScheuledAppointmentDTO):
        with Session() as session:
            doctor = self.user_manager.get_user_by_id(dto.doctor_id)
            user = self.user_manager.get_user_by_id(dto.user_id)
            date = dto.date
            time = dto.time
            
            has_existing_appointments_at_date_for_doc = (
                len(
                    list(
                        filter(
                            lambda x: x.date == date and x.time == time,
                            doctor.doc_appointments,
                        )
                    )
                )
                > 0
            )

            has_existing_appointments_at_date_for_user = (
                len(
                    list(
                        filter(
                            lambda x: x.date == date and x.time == time,
                            user.user_appointments,
                        )
                    )
                )
                > 0
            )

            if has_existing_appointments_at_date_for_doc:
                raise Exception("Doctor already has an appointment at this time")

            if has_existing_appointments_at_date_for_user:
                raise Exception("User already has an appointment at this time")

            if not doctor:
                raise Exception("Doctor not found")
            
            if doctor.role != "doctor":
                raise Exception(
                    "Appointing appointment with a non doctor user is not acceptable"
                )
            if not user:
                raise Exception("User not found")
            
            if user.role != "patient":
                raise Exception(
                    "Appointing appointment with a non user user is not acceptable"
                )

            new_appointment = Appointment(
                user_id=dto.user_id,
                doctor_id=dto.doctor_id,
                date=dto.date,
                time=dto.time,
            )
            session.add(new_appointment)
            session.commit()
            session.flush()
            app = session.query(Appointment).options(
                    # Load the doctor
                    joinedload(Appointment.user), 
                    # Load the user
                    joinedload(Appointment.doctor)  # Load the doctor related to those appointments
            ).filter(Appointment.id == new_appointment.id).first()
            return app
