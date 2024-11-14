from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.doctors import router as doctors_router
from routes.chat import router as chat_router

from routes.appointments import router as appointments_router

app = FastAPI()
from dotenv import load_dotenv


origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(appointments_router)
app.include_router(doctors_router)
load_dotenv("./.env")
