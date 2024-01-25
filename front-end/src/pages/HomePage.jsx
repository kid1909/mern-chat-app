import {
  Container,
  Box,
  Text,
  Tabs,
  TabPanel,
  TabList,
  TabPanels,
  Tab,
} from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import SignUp from '../components/Authentication/SignUp'

const Homepage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily={'Work sans'} color={'black'}>
          Chat App
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius={'lg'} borderWidth={'1px'}>
        <Tabs variant="soft-rounded" colorScheme="blue">
          <TabList>
            <Tab width={'50%'}>Login</Tab>
            <Tab width={'50%'}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}
export default Homepage
