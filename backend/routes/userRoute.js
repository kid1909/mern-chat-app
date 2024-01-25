const express = require('express')

const { registerUser, authUser } = require('../controller/userController.js')

const router = express.Router()

router.post('/', registerUser)
router.post('/login', authUser)

module.exports = router
