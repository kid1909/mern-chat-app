import { Box, Stack, Text } from '@chakra-ui/layout'
import { useChatState } from '../Context/ChatProvider'
import {
  FormControl,
  IconButton,
  Input,
  InputGroup,
  // InputLeftElement,
  InputRightAddon,
  Spinner,
  useToast,
} from '@chakra-ui/react'
import { ArrowBackIcon, ArrowLeftIcon, PhoneIcon } from '@chakra-ui/icons'
import { getSender, getFullSender } from './config/ChatLogic'
import ProfileModal from './Authentication/miscellaneous/ProfileModal'
import UpdateGroupChatModal from './Authentication/miscellaneous/UpdateGroupChatModal'
import { useEffect, useState } from 'react'
import { configAuth } from './Authentication/configHeader'
import axios from 'axios'
import './styles.css'
import ScrollableChat from './ScrollableChat'
import io from 'socket.io-client'

//animation typing
import Lottie from 'react-lottie'
import animationData from '../animations/typing.json'

const ENDPOINT = 'http://localhost:5000'
var socket, selectedChatCompare

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState()
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    renderSettings: {
      preserveAspectRation: 'xMidYMid slice',
    },
  }

  const toast = useToast()

  const { user, selectedChat, setSelectedChat } = useChatState()
  const typingHandler = (e) => {
    setNewMessage(e.target.value)

    if (!socketConnected) return

    if (!typing) {
      setTyping(true)
      socket.emit('typing', selectedChat._id)
    }
    let lastTypingTime = new Date().getTime()
    var timerLength = 3000
    setTimeout(() => {
      var timeNow = new Date().getTime()
      var timeDiff = timeNow - lastTypingTime

      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id)
        setTyping(false)
      }
    }, timerLength)
  }

  const sendMessage = async (event) => {
    socket.emit('stop typing', selectedChat._id)
    if (newMessage)
      try {
        setNewMessage('')
        const { data } = await axios.post(
          '/api/v1/message',
          {
            content: newMessage,
            chatId: selectedChat,
          },
          configAuth(user)
        )
        socket.emit('new message', data)
        setMessages([...messages, data])
        // console.log(messages)
      } catch (error) {
        toast({
          title: 'Error Occured',
          description: 'Failed to send the message',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        })
      }
  }
  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit('setup', user)
    socket.on('connected', () => setSocketConnected(true))

    socket.on('typing', () => setIsTyping(true))
    socket.on('stop typing', () => setIsTyping(false))
  }, [])

  useEffect(() => {
    fetchMessages()
    // console.log()
    selectedChatCompare = selectedChat
  }, [selectedChat])

  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // give notification
      } else {
        setMessages([...messages, newMessageReceived])
      }
    })
  })

  const sendMessageEnter = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }
  const fetchMessages = async () => {
    if (!selectedChat) return

    try {
      setLoading(true)
      const { data } = await axios.get(
        `/api/v1/message/${selectedChat._id}`,
        configAuth(user)
      )
      console.log(messages)
      setMessages(data)
      setLoading(false)

      socket.emit('join chat', selectedChat._id)
    } catch (error) {
      toast({
        title: 'Error Occured',
        description: 'Failed to send the message',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
    }
  }

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: '28px', md: '30px' }}
            pb={3}
            px={2}
            w="100%"
            fontFamily={'Work sans'}
            display={'flex'}
            justifyContent={{ base: 'space-between' }}
            alignItems={'center'}
          >
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat('')}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getFullSender(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>{' '}
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            background="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessageEnter} isRequired mt={3}>
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Stack spacing={4}>
                <InputGroup>
                  <Input
                    // variant={'filled'}
                    background={'#E0E0E0'}
                    placeholder="Enter a message"
                    onChange={typingHandler}
                    value={newMessage}
                  />{' '}
                  <InputRightAddon>
                    <ArrowBackIcon
                      color={newMessage ? 'default' : 'gray.300'}
                      onClick={sendMessage}
                      cursor={newMessage ? 'pointer' : 'not-allowed'}
                    />
                  </InputRightAddon>
                </InputGroup>
              </Stack>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  )
}
export default SingleChat
