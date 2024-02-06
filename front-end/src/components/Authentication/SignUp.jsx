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

const SignUp = () => {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState()
  const [pic, setPic] = useState()
  const toast = useToast()

  const navigate = useNavigate()

  const handleClick = () => setShow(!show)

  const postDetails = (pics) => {
    setLoading(true)
    if (pics === undefined) {
      toast({
        title: 'Please select an Image!',
        status: 'warning',
        duration: 5000,
        position: 'bottom',
        isClosable: true,
      })
      return
    }
    console.log(pics)
    if (pics.type === 'image/png' || pics.type === 'image/jpeg') {
      const data = new FormData()
      data.append('file', pics)
      data.append('upload_preset', 'chat-app')
      data.append('cloud_name', 'domjuxgd5')
      fetch('https://api.cloudinary.com/v1_1/domjuxgd5/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString())
          console.log(data.url.toString())
          setLoading(false)
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
        })
    } else {
      toast({
        title: 'Please select an Image!',
        status: 'warning',
        duration: 5000,
        position: 'bottom',
        isClosable: true,
      })
      setLoading(false)
      return
    }
  }

  /////Fixed solution///////////

  // const postDetails = (pics) => {
  //   setLoading(true)
  //   if (pics === undefined) {
  //     toast({
  //       title: 'Please Select an Image!',
  //       status: 'warning',
  //       duration: 5000,
  //       isClosable: true,
  //       position: 'bottom',
  //     })
  //     return
  //   }
  //   console.log(pics)
  //   if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
  //     const data = new FormData()
  //     data.append('file', pics)
  //     data.append('upload_preset', 'chat-app')
  //     data.append('cloud_name', 'domjuxgd5')
  //     fetch('https://api.cloudinary.com/v1_1/domjuxgd5/image/upload', {
  //       method: 'post',
  //       body: data,
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setPic(data.url.toString())
  //         console.log(data.url.toString())
  //         setLoading(false)
  //       })
  //       .catch((err) => {
  //         console.log(err)
  //         setLoading(false)
  //       })
  //   } else {
  //     toast({
  //       title: 'Please Select an Image!',
  //       status: 'warning',
  //       duration: 5000,
  //       isClosable: true,
  //       position: 'bottom',
  //     })
  //     setLoading(false)
  //     return
  //   }
  // }

  const submitHandler = async () => {
    setLoading(true)
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: 'Please fill all the fields',
        status: 'warning',
        duration: 5000,
        position: 'bottom',
        isClosable: true,
      })
      setLoading(false)
      return
    }
    if (password !== confirmPassword) {
      toast({
        title: 'Password Do Not Match',
        status: 'warning',
        duration: 5000,
        position: 'bottom',
        isClosable: true,
      })
      return
    }

    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      }
      const { data } = await axios.post(
        '/api/v1/user',
        {
          name,
          email,
          password,
          pic,
        },
        config
      )
      toast({
        title: 'User Registered',
        status: 'success',
        duration: 5000,
        position: 'bottom',
        isClosable: true,
      })
      localStorage.setItem('userInfo', JSON.stringify(data))
      setLoading(false)
      navigate('/chats')
    } catch (error) {
      toast({
        title: 'Error Occured',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        position: 'bottom',
        isClosable: true,
      })
    }
  }

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

      <FormControl id="confirm-password" isRequired>
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
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  )
}
export default SignUp
