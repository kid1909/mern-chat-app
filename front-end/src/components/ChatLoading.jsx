import { Stack } from '@chakra-ui/layout'
import { Skeleton } from '@chakra-ui/react'

Skeleton

const ChatLoading = () => {
  return (
    <Stack>
      <Skeleton height={'45px'} />
      <Skeleton height={'35px'} />
      <Skeleton height={'25px'} />
    </Stack>
  )
}
export default ChatLoading
