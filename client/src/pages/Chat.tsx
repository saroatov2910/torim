import { useNavigate, useParams } from "react-router"
import { useAuth, useDoctor } from "../../store/user.slice"
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Chat as IChat, Maybe } from "../../@types"
import sendButton from '../assets/send.png'
import AuthGuarded from "../components/AuthGuarded"
 
function Chat() {

    const {end_user_id} = useParams()// Extract end user ID from URL parameters
    const [socket] = useState(new WebSocket("ws://localhost:8000/chat/enter"))
    const {user, token} = useAuth()
    const [chat,setChat] = useState<Maybe<IChat>>()

    const nav = useNavigate()// Create a navigation function to move between routes

    const scrollToBottomArea = () => {
        if(areaRef.current) {

            const height =  areaRef.current.scrollHeight
            areaRef.current.scrollTo({top: height, behavior:'smooth'})
    }
    }
    // Function to scroll to the bottom of the chat area
    useEffect(() => {
        if(token && end_user_id) {
            if(+end_user_id === user?.id) {
                alert("Cannot chat with your self.")
                nav("/")
                return
            }

            socket.addEventListener('open', () => {
                console.log("connection opened")
                socket.send(JSON.stringify({ token, end_user_id  }))
            })
            socket.addEventListener('message', (message) => {
                const message_content = JSON.parse(message.data)
                if (message_content["chat"]) {
                    setChat(message_content["chat"])
                    setTimeout(scrollToBottomArea,50)
                } else if(message_content["message"]) {

                    console.log(message_content["message"])
                    setChat(chat => ( chat ? {...chat, messages: [...chat.messages, message_content["message"]]} : chat))
                    if(message_content["message"].sender_id != +(end_user_id!)) {
                        setTimeout(scrollToBottomArea,50)
                    }
                }
                
            })
   
        }

        return () => {
            socket.close()
        }
    },[token,end_user_id])


   useEffect(() => {console.log(chat)},[chat])
   const endUser = useMemo(() =>  {
            if(!chat || !user  || !end_user_id) return null
            if(+end_user_id === chat.doctor_id)
                return chat.doctor!
            return chat.patient!
        },[chat, user, end_user_id])


    const ref = useRef<HTMLInputElement| null>(null)
    const areaRef = useRef<HTMLDivElement | null>(null)
    const onSubmit = () => {
        const message = (ref.current as any).value
        socket.send(message)
        if(ref.current)
            ref.current.value = ""
    }


    const sender = useCallback((sender_id: number) => {
        if(sender_id === chat?.doctor_id) return chat.doctor
        return chat?.patient
    },[chat])
 
    if(!chat) {
        return <div>Connecting..</div>
    }


    return <div className="max-w-[600px]">

        <p className="font-bold">Chat with {endUser?.name}</p>
        <div ref={areaRef} className="flex p-2 flex-col border-[1px] border-[lightgray] h-[500px] overflow-y-scroll min-w-[400px] rounded-md my-2">
        {chat.messages.map(m => <div dir={m.sender_id == +(end_user_id!) ? 'rtl' : 'ltr'} className="w-full" key = {m.id.toString()}>
            <h3 className="font-bold underline">{sender(m.sender_id)?.name}</h3>
            <div className="w-full flex flex-row items-center justify-between">
                <p >{m.content}</p>
                <p className="text-[gray] text-[14px]">{m.time}</p>
            </div>
            <hr className="mt-2"/>
        </div>)}

        </div>
       
        <div  className="grid w-full gap-2 translate-x-[8px]" style={{gridTemplateColumns:'90% 10%'}}>
            <input ref={ref} name="message" className=" border-[1px] border-[lightgray] p-[8px]" placeholder="Enter message"/>
            <img onClick={onSubmit} src={sendButton} width={40} height={30} className="cursor-pointer"/>
        </div>
    </div>
}

export default AuthGuarded(Chat)