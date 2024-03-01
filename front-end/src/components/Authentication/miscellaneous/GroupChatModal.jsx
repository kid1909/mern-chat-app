import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useChatState } from '../../../Context/ChatProvider'
import axios from 'axios'
import UserListItem from '../../UserAvatar/UserListItem'
import UserBadgeItem from '../../UserAvatar/UserBadgeItem'

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName, setGroupChatName] = useState()
  const [selectedUsers, setSelectedUsers] = useState([])
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)

  const toast = useToast()

  const { user, chats, setChats } = useChatState()

  const handleSearch = async (query) => {
    setSearch(query)
    if (!query) {
      return
    }
    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const { data } = await axios.get(`/api/v1/user?search=${search}`, config)
      console.log(data)
      setLoading(false)
      setSearchResult(data)
    } catch (error) {
      toast({
        title: 'Error Ouccured !',
        description: 'Failed to Load the Search Results',
        status: 'error',
        duration: 4500,
        isClosable: true,
        position: 'bottom-left',
      })
    }
  }
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: 'Please fill all the fields',
        status: 'warning',
        duration: 4500,
        isClosable: true,
        position: 'top',
      })
      return
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const { data } = await axios.post(
        '/api/v1/chats/group',
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      )
      setChats([data, ...chats])
      onClose()
      toast({
        title: 'New Group Chat Created!',
        status: 'success',
        duration: 4500,
        isClosable: true,
        position: 'bottom',
      })
    } catch (error) {
      toast({
        title: 'Failed to create the chat',
        description: error.response.data,
        status: 'error',
        duration: 4500,
        isClosable: true,
        position: 'bottom',
      })
    }
  }
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id))
  }
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: 'User already added',
        status: 'warning',
        duration: 4500,
        isClosable: true,
        position: 'top',
      })
      return
    }
    console.log(userToAdd)
    setSelectedUsers([...selectedUsers, userToAdd])
  }
  return (
    <>
      <Button onClick={onOpen}>New Group Chat</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={'35px'}
            fontFamily={'Work sans'}
            display={'flex'}
            justifyContent={'center'}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={'flex'} flexDir={'column'} alignItems={'center'}>
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg:John , Potter"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
            {/* selected users */}
            <Box w="100%" display={'flex'} flexWrap={'wrap'}>
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {/* render search users */}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
export default GroupChatModal
