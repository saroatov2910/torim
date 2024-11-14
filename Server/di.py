from managers.auth import AuthManager
from managers.appointments import AppointmentsManager
from managers.doctors import DoctorsManager
from managers.chat import ChatManager


def provide_auth_manager(manager=AuthManager()):
    return manager


def provide_appointments_manager(manager=AppointmentsManager()):
    return manager


def provide_doctors_manager(manager=DoctorsManager()):
    return manager


def provide_chat_manager(manager=ChatManager()):
    return manager

