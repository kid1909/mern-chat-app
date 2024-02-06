import './App.css'
// import { Button } from '@chakra-ui/button'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HomePage, ChatPage } from './pages'
function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path: '/chat',
      element: <ChatPage />,
    },
  ])

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
