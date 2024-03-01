import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputRightElement,
  VStack,
  InputGroup,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useChatState } from '../../Context/ChatProvider'
import { configAuth, config } from './configHeader'

const Login = () => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setUser } = useChatState()
  const toast = useToast()
  const navigate = useNavigate()

  const handleClick = () => setShow(!show)

  const submitHandler = async () => {
    if (!email || !password) {
      toast({
        title: 'Please Fill all the Feilds',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.post(
        '/api/v1/user/login',
        { email, password },
        config
      )

      toast({
        title: 'Login Successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })

      setUser(data)
      localStorage.setItem('userInfo', JSON.stringify(data))
      navigate('/chats')
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
      setLoading(false)
    }
  }

  const onEnter = (event) => {
    if (event.key === 'Enter') {
      submitHandler()
    }
  }
  return (
    <VStack spacing={'5px'}>
      {/* EMAIL */}
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      {/* PASSWORD */}
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? 'text' : 'password'}
            onKeyDown={onEnter}
          />
          <InputRightElement width={'4.5rem'}>
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail('guest@example.com')
          setPassword('secret')
        }}
      >
        Login as Guest
      </Button>
    </VStack>
  )
}
export default Login
