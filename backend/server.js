const express = require('express')
const dotenv = require('dotenv')
const { chats } = require('./data/data')
const connectDB = require('./config/db.js')
const colors = require('colors')


///////////////////////////////////
// Routes//
const userRoutes = require('./routes/userRoute.js')
const chatRoutes = require('./routes/chatRoute.js')
const messageRoute = require('./routes/messageRoute.js')
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js')
///////////////////////////////////

const app = express()
dotenv.config()

connectDB()
app.use(express.json()) // to accept JSON format

app.get('/api/v1/test', (req, res) => {
  res.json({ msg: 'test route' })
})

app.use('/api/v1/user', userRoutes)
app.use('/api/v1/chats', chatRoutes)
app.use('/api/v1/message', messageRoute)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(
  5000,
  console.log(`Server is running on port ${PORT}`.yellow.bold)
)

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: ['http://localhost:5000', 'http://localhost:5173'],
    // methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.log('connected to socket.io')

  socket.on('setup', (userData) => {
    socket.join(userData._id)
    socket.emit('connected')
  })

  socket.on('join chat', (room) => {
    socket.join(room)
    console.log(`User joined room ` + room)
  })

  socket.on('typing', (room) => socket.in(room).emit('typing'))
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))

  // check more logic for this
  socket.on('new message', (newMessageReceived) => {
    var chat = newMessageReceived.chat

    if (!chat.users) return console.log(`${chat.users} not defined`)

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived._id) return

      socket.in(user._id).emit('message received', newMessageReceived)
    })
  })
})