from entities import Chat,Message
from database import Session
from sqlalchemy import and_, or_
from sqlalchemy.orm import joinedload
from datetime import datetime
from encoders import serialize
from fastapi.websockets import WebSocket
class ChatManager:
    listeners: dict = {}


    def get_all_chats(self, user_id):
            with Session() as session:
                try:
                    chats = session.query(Chat).options(
                                joinedload(Chat.doctor), 
                                joinedload(Chat.patient), 
                        ).filter(or_(Chat.patient_id == int(user_id), Chat.doctor_id == int(user_id))).all()
                    return chats
                except Exception as e:
                    raise e    

    def listen_chat(self, chat_id: str, socket: WebSocket):

        if chat_id not in self.listeners:
            self.listeners[chat_id] = [socket]
        else:
            self.listeners[chat_id].append(socket)

        def unsub():
             self.listeners[chat_id].remove(socket)
        return unsub
    
    
    async def send_message(self, chat_id: str, sender_id: str, content:str) -> Message:
        with Session() as session:
            try:
                new_message = Message(
                    sender_id= sender_id,
                    chat_id = chat_id,
                    time = datetime.now().strftime("%H:%M"),
                    content = content
                )
                session.add(new_message)
                session.commit()
                session.flush()
                message = session.query(Message).options(
                            # Load the ender
                            joinedload(Message.sender), 
                    ).filter(Message.id == new_message.id).first()
                
                ## Notify chat listeners
                if chat_id in self.listeners:
                    for client in self.listeners[chat_id]:
                        assert isinstance(client, WebSocket), "Client issue"
                        await client.send_json({
                            "message": serialize(new_message)
                        })
                return message
            except Exception as e:
                session.rollback()
                raise e    

    def start_chat(self, patient_id: str, doctor_id: str) -> Chat:
         with Session() as session:
            try:
                chat = session.query(Chat).options(
                            # Load the doctor
                            joinedload(Chat.patient), 
                            # Load the user
                            # load messages
                            joinedload(Chat.messages),
                            joinedload(Chat.doctor)  # Load the doctor related to those appointments
                ).filter(and_(Chat.doctor_id == doctor_id, Chat.patient_id == patient_id)).first()
                if not chat:
                    # create a new chat
                    new_chat = Chat(
                        patient_id = patient_id,
                        doctor_id = doctor_id,
                        messages=[]
                    )

                    session.add(new_chat)
                    session.commit()
                    session.flush()

                    chat = session.query(Chat).options(
                            # Load the doctor
                            joinedload(Chat.patient), 
                            # load the messages
                            joinedload(Chat.messages),
                            # Load the user
                            joinedload(Chat.doctor)  # Load the doctor related to those appointments
                    ).filter(Chat.id == new_chat.id).first()
                    return chat
                else:
                    return chat
            except Exception as e:
                session.rollback()
                raise e