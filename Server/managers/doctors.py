from dto.appointments import ScheuledAppointmentDTO
from database import Session
from entities import User
from managers.auth import AuthManager
from sqlalchemy.orm import joinedload

#DoctorsManager class: 
class DoctorsManager:

    def __init__(self):
        pass

    def all_doctors(self):
        with Session() as session:

            doctors = (
                session.query(User)
                .options(joinedload(User.doc_appointments))
                .filter(User.role == "doctor")
                .all()
            )

            return doctors
