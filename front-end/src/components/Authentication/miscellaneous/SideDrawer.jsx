import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  Input,
  useToast,
  Spinner,
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/hooks'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import { useChatState } from '../../../Context/ChatProvider'
import ProfileModal from './ProfileModal'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ChatLoading from '../../ChatLoading'
import UserListItem from '../../UserAvatar/UserListItem'

const SideDrawer = () => {
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState()
  const { user, setSelectedChat, chats, setChats } = useChatState()
  const navigate = useNavigate()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please enter name or email to search',
        status: 'warning',
        duration: 4500,
        isClosable: true,
        position: 'top-left',
      })
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
      setLoading(false)
      setSearchResult(data)
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

  const logoutHandler = () => {
    localStorage.removeItem('userInfo')
    navigate('/')
  }

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true)
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      }
      const { data } = await axios.post('/api/v1/chats', { userId }, config)

      if (!chats.find((c) => c._id === data.id)) setChats([data, ...chats])

      setSelectedChat(data)
      setLoadingChat(false)
      onClose()
    } catch (error) {}
  }
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: 'none', md: 'flex' }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
          {' '}
          Chat App
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>

              <MenuItem onClick={logoutHandler}> Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>
          <DrawerBody>
            <Box display={'flex'} pb={2}>
              <Input
                placeholder="Search by email or name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Find</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : searchResult && searchResult.length > 0 ? (
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            ) : (
              <span>No results</span>
            )}
            {loadingChat && <Spinner ml="auto" display={'flex'} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
export default SideDrawer
