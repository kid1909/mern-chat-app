import { createContext, useContext, useEffect, useState } from 'react'
// import { redirect } from 'react-router-dom'
// import { useNavigate } from 'react-router-dom'
const ChatContext = createContext()

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState()
  const [selectedChat, setSelectedChat] = useState()
  const [chats, setChats] = useState([])
  // const navigate = useNavigate()
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    setUser(userInfo)
    // if (!userInfo) {
    //   // window.location.href = '/chats'
    //   navigate('/')
    // }
  }, [])

  return (
    <ChatContext.Provider
      value={{ user, setUser, setSelectedChat, selectedChat, chats, setChats }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChatState = () => {
  return useContext(ChatContext)
}

export default ChatProvider
