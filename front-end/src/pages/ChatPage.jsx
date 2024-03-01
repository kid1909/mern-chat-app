// import axios from 'axios'
// import { useEffect, useState } from 'react'

import { useChatState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/layout'
import SideDrawer from '../components/Authentication/miscellaneous/SideDrawer'
import ChatBox from '../components/ChatBox'
import MyChats from '../components/MyChats'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
const ChatPage = () => {
  const { user } = useChatState()
  const navigate = useNavigate()
  const [fetchAgain, setFetchAgain] = useState(false)
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))

    if (!userInfo) {
      // window.location.href = '/chats'
      navigate('/')
    }
  }, [navigate])

  return (
    <div style={{ width: '100%' }}>
      {user && <SideDrawer />}

      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  )
}
export default ChatPage
