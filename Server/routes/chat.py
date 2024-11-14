from fastapi import APIRouter, Depends, Response
from dto.appointments import ScheuledAppointmentDTO
from middlewares import auth_validation
from di import provide_chat_manager, provide_auth_manager
from managers.chat import ChatManager
from managers.auth import AuthManager
from encoders import serialize
from entities import User
from fastapi import Body
from fastapi.websockets import WebSocket
router = APIRouter(prefix="/chat", tags=["chat"])



@router.get("/allchats")
async def all_chats(
    user = Depends(auth_validation),
    chat_manager: ChatManager = Depends(provide_chat_manager),
):
    try:
         return {"chats": [serialize(c, ignore=["messages"]) for c in chat_manager.get_all_chats(user.id)]}
    except Exception as e:
        print(e)    
        return Response(content=str(e), status_code=400)

@router.websocket("/enter")
async def enter_chat(
    websocket: WebSocket,
    user_manager: AuthManager = Depends(provide_auth_manager),
    chat_manager: ChatManager = Depends(provide_chat_manager),
):
    unsubscribe = None
    import json
    try:
        await websocket.accept()
        connection_data = await websocket.receive_json()
        user = user_manager.get_user(connection_data["token"])
        end_user_id = connection_data["end_user_id"]
        doctor_id = user.id if user.role == 'doctor' else end_user_id
        patient_id = user.id if user.role == 'patient' else end_user_id
        # start a chat with the end user
        chat = chat_manager.start_chat(patient_id=patient_id, doctor_id=doctor_id)
        unsubscribe = chat_manager.listen_chat(chat.id, websocket)

             
        await websocket.send_json({"chat": serialize(chat)})
        while True:
               content = await websocket.receive_text()
               sender_id = user.id
               await chat_manager.send_message(chat_id=chat.id, sender_id=sender_id, content=content)
    except Exception as e:
        if unsubscribe:
            unsubscribe()
        print(e)    
        return Response(content=str(e), status_code=400)
