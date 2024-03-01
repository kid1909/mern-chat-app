import './App.css'
// import { Button } from '@chakra-ui/button'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HomePage, ChatPage } from './pages'
import Error from './pages/Error'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path: '/chats',
      element: <ChatPage />,
      errorElement: <Error />,
    },
  ])

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
