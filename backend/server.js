const express = require('express')
const dotenv = require('dotenv')
const { chats } = require('./data/data')
const connectDB = require('./config/db.js')
const colors = require('colors')

///////////////////////////////////
// Routes//
const userRoutes = require('./routes/userRoute.js')
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

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(5000, console.log(`Server is running on port ${PORT}`.yellow.bold))
