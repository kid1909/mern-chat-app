import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputRightElement,
  VStack,
  InputGroup,
} from '@chakra-ui/react'
import { useState } from 'react'

const SignUp = () => {
  const [show, setShow] = useState(false)
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState()
  const [pic, setPic] = useState()

  const handleClick = () => setShow(!show)

  const postDetails = (pic) => {}

  const submitHandler = () => {}

  return (
    <VStack spacing={'5px'}>
      {/* USERNAME */}
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
          type="text"
        />
      </FormControl>

      {/* EMAIL */}
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your email"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
      </FormControl>

      {/* PASSWORD */}
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Enter Your Name"
            onChange={(e) => setPassword(e.target.value)}
            type={show ? 'text' : 'password'}
          />
          <InputRightElement width={'4.5rem'}>
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      {/* CONFIRM PASSWORD */}

      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Enter Your Name"
            onChange={(e) => setConfirmPassword(e.target.value)}
            type={show ? 'text' : 'password'}
          />
          <InputRightElement width={'4.5rem'}>
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      {/* UPLOAD PIC */}
      <FormControl id="pic" isRequired>
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          onChange={(e) => postDetails(e.target.files[0])}
          type="file"
          p={1.5}
          accept="image/*"
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
      >
        Sign Up
      </Button>
    </VStack>
  )
}
export default SignUp
