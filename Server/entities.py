from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from typing import List
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

#Chat class : id,doctor_id,doctor,patient_id,patient,messages:
class Chat(Base):
    __tablename__ = "chats"
    id: Mapped[int] = mapped_column(primary_key=True)
    doctor_id = Column(Integer, ForeignKey("users.id"))
    doctor = relationship("User", back_populates="doc_chats", foreign_keys=[doctor_id])
    patient_id = Column(Integer, ForeignKey("users.id"))
    patient = relationship("User", back_populates="user_chats", foreign_keys=[patient_id])
    messages: Mapped[List["Message"]] = relationship("Message", back_populates="chat")

#Message class:id,chat_id,sender_id,sender,content,chat:
class Message(Base):
    __tablename__ = "chat_messages"
    id: Mapped[int] = mapped_column(primary_key=True)
    chat_id = Column(Integer, ForeignKey("chats.id"))
    sender_id = Column(Integer, ForeignKey("users.id"))
    time = Column(String(150))
    sender = relationship("User", foreign_keys=[sender_id])
    content = Column(String(500))
    chat = relationship("Chat", back_populates="messages", foreign_keys=[chat_id])

#user class : id,email,name,password,profession,role:
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String(150), unique=True)
    name = Column(String(150))
    password = Column(String(150))
    profession = Column(String(150))
    role = Column(String(150))
#sql : 
    doc_chats = relationship("Chat", back_populates="doctor", foreign_keys="Chat.doctor_id")
    user_chats = relationship("Chat", back_populates="patient", foreign_keys="Chat.patient_id")
    doc_appointments = relationship("Appointment", back_populates="doctor", foreign_keys="Appointment.doctor_id")
    user_appointments = relationship("Appointment", back_populates="user", foreign_keys="Appointment.user_id")

# Appointment class : id,date,time,doctor_id,doctor,user_id,user:
class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True)
    date = Column(String(150))
    time = Column(String(150))
    doctor_id = Column(Integer, ForeignKey("users.id"))
    doctor = relationship("User", back_populates="doc_appointments", foreign_keys=[doctor_id])
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="user_appointments", foreign_keys=[user_id])
