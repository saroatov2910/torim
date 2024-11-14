import { useSelector } from "react-redux"
import AuthGuarded from "./AuthGuarded"
import { Chat, Maybe, User } from "../../@types"
import { RootState } from "../../store"
import { useCallback } from "react"
import { useNavigate } from "react-router"


function ChatList() {

    const chats = useSelector<RootState, Chat[]>(state => state.user.chats)
    const user = useSelector<RootState, Maybe<User>>(state => state.user.user)
    const nav = useNavigate()

    const otherUser = useCallback((chat: Chat) => {
        if(user?.id === chat.doctor_id)
            return chat.patient 
        else return chat.doctor
    } ,[user])
    return <div>
        <h3 className="font-bold text-[20px] mt-4">My chats:</h3>
      <div className="flex flex-col gap-2 max-w-[400px] p-3 border-[1px] my-2 border-[black] rounded-md">
          {chats.map(c =><div className="flex flex-col gap-3">
            <div className="flex flex-row items-center gap-2" key={c.id}>
                <p className="min-w-[200px]">Chat with: {otherUser(c)?.name}</p>
                <button
                    onClick={() => nav(`/chat/${otherUser(c)?.id}`)}
                    className="bg-[#5a5acc] text-[white] px-2 py-0 hover:bg-[#4646ad] transition-colors active:bg-[#32329a]"
                >Enter</button>
                </div>
                <hr className="w-full"/>
          </div>)}
      </div>
    </div>
}


export default AuthGuarded(ChatList)