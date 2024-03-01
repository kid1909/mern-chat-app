const asyncHandler = require('express-async-handler')
const Chat = require('../models/chatModel')
const User = require('../models/userModel')

const accessChat = asyncHandler(async (req, res) => {
  // looking for userId of other person from history chat
  const { userId } = req.body
  // can't find userId give error
  if (!userId) {
    console.log('UserId param not sent with request')
    return res.sendStatus(400)
  }
  // FOUND user => find history chat

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      // in the chat has to have 2 users => these 2 id has to match with sender - receiver
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    //then get by users without password // then get latest message
    .populate('users', '-password')
    .populate('latestMessage')

  // look for sender info name pic email
  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'name pic email',
  })
  // if there was chat history , return chat info
  if (isChat.length > 0) {
    res.send(isChat[0])
  } else {
    // if there was not chat history, create new
    var chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    }
    try {
      const createdChat = await Chat.create(chatData)
      // full chat is sent to user
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        'users',
        '-password'
      )
      res.status(200).send(FullChat)
    } catch (error) {
      res.status(400)
      throw new Error(error.message)
    }
  }
})
const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updateAt: -1 })
      .then(async (results) => {
        result = await User.populate(results, {
          path: 'latestMessage.sender',
          select: 'name pic email',
        })
        res.status(200).send(results)
      })
  } catch (error) {
    console.log(error)
  }
})
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: 'Please fill all the fields' })
  }
  var users = JSON.parse(req.body.users)
  if (users.length < 2) {
    return res
      .status(400)
      .send('More than 2 users are required for a group chat')
  }

  users.push(req.user)

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    })

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')

    res.status(200).json(fullGroupChat)
  } catch (error) {}
})
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password')

  if (!updatedChat) {
    res.status(400)
    throw new Error('Chat Not Found')
  } else {
    res.json(updatedChat)
  }
})
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password')

  if (!added) {
    res.status(400)
    throw new Error('Chat Not Found')
  } else {
    res.json(added)
  }
})
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body

  const remvoved = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password')

  if (!remvoved) {
    res.status(400)
    throw new Error('Chat Not Found')
  } else {
    res.json(remvoved)
  }
})

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
}
