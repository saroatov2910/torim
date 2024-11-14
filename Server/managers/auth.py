from dto.auth import (
    PatientRegisterForm,
    DoctorRegisterForm,
    UserLoginForm,
    DoctorEditProfileDto,
)
from database import Session
from entities import User
from datetime import datetime
from entities import Appointment
from utils.tokens import TokenManager
from utils.password_hashing import PasswordHasher
from sqlalchemy.orm import joinedload


def unix_timestamp_to_date(timestamp: int) -> datetime:
    return timestamp.fromtimestamp(datetime.timezone.utc)


class AuthManager:

    password_hasher = PasswordHasher()
    token_manager = TokenManager()

    def __init__(self):
        pass

    def edit_doctor(self, user: User, form: DoctorEditProfileDto):

        with Session() as session:
            try:
                if user.role != "doctor":
                    raise Exception("User is not a doctor")
                # update the user's profession
                session.query(User).filter(User.id == user.id).update(
                    {"profession": form.profession}
                )
                user.profession = form.profession
                session.commit()
                return user
            except Exception as e:
                print(e)
                session.rollback()
                raise e

    def get_user(self, token: str):
        decoded = self.token_manager.decode(token)
        if not decoded:
            raise Exception("Invalid token")
        id = decoded["id"]
        user = self.get_user_by_id(id)
        if not user:
            raise Exception("Invalid token")
        return user

    def user_exists(self, email: str) -> int:
        with Session() as session:
            user = session.query(User).filter(User.email == email).first()
            if user:
                return user

    def register_user(self, dto) -> int:
        with Session() as session:
            try:
                exists = self.user_exists(dto.email)
                if exists:
                    raise Exception(f"User with email already exists {dto.email}")

                hashed_password = self.password_hasher.hash_pass(dto.password)
                is_doctor = isinstance(dto, DoctorRegisterForm)
                new_user = User(
                    email=dto.email,
                    role="doctor" if is_doctor else "patient",
                    password=hashed_password,
                    profession=dto.profession if is_doctor else None,
                    name=dto.name,
                )
                session.add(new_user)
                session.commit()
                session.flush()  # To get the new user_id
                return new_user.id
            except Exception as e:
                print(e)
                session.rollback()
                raise e

    def login_user(self, dto: UserLoginForm):
        user = self.user_exists(email=dto.email)
        if not user:
            raise Exception(f"User with email does not exist: {dto.email}")
        encoded = self.token_manager.encode({"id": user.id})
        return encoded

    def get_user_by_id(self, id):
        with Session() as session:
            user = (
                session.query(User)
                .options(
                    # Load the doctor's appointments
                    joinedload(User.doc_appointments).joinedload(
                        Appointment.user
                    ),  # Load the user related to those appointments
                    # Load the user's appointments
                    joinedload(User.user_appointments).joinedload(
                        Appointment.doctor
                    ),  # Load the doctor related to those appointments
                )
                .filter(User.id == id)
                .first()
            )
            return user
