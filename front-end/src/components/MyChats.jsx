import { useEffect, useState } from 'react'
import { useChatState } from '../Context/ChatProvider'
import { Box, Button, Stack, useToast, Text } from '@chakra-ui/react'
import axios from 'axios'
import { AddIcon } from '@chakra-ui/icons'
import ChatLoading from './ChatLoading'
import { getSender } from './config/ChatLogic'
import GroupChatModal from './Authentication/miscellaneous/GroupChatModal'
// import UserListItem from './UserAvatar/UserListItem'

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState()
  // const [selectedUsers, setSelectedUsers] = useState([])
  const { selectedChat, setSelectedChat, user, chats, setChats } =
    useChatState()

  const toast = useToast()

  const fetchChats = async () => {
    try {
      // setLoadingChat(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      const { data } = await axios.get('/api/v1/chats', config)
      setChats(data)
      // console.log(data)
    } catch (error) {
      toast({
        title: 'Error Occured',
        description: 'Failed to load the Search results',
        status: 'error',
        duration: 4500,
        isClosable: true,
        position: 'bottom-left',
      })
    }
  }
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')))
    fetchChats()
    // eslint-disable-next-line
  }, [fetchAgain])
  // const handleGroup = (userToAdd) => {
  //   if (selectedUsers.includes(userToAdd)) {
  //     toast({
  //       title: 'User already added',
  //       status: 'warning',
  //       duration: 4500,
  //       isClosable: true,
  //       position: 'top',
  //     })
  //     return
  //   }
  //   console.log(userToAdd)
  //   setSelectedUsers([...selectedUsers, userToAdd])
  // }
  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: '100%', md: '31%' }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: '28px', md: '30px' }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: '17px', md: '10px', lg: '17px' }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY={'hidden'}
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                color={selectedChat === chat ? 'white' : 'black'}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}{' '}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  )
}
export default MyChats
