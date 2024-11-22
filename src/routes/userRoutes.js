const router = require('express').Router()
const isAuthenticated = require('../middlewares/IsAuthenticatedMiddleware')
const UserController = require('../controllers/usersController')
const User = require('../models/User')


router.get('/:id',[isAuthenticated.check,UserController.getUserById])
router.put('/update/:id',[isAuthenticated.check,UserController.updateUser])

module.exports = router