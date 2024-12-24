const router = require('express').Router()
const isAuthenticated = require('../middlewares/IsAuthenticatedMiddleware')
const UserController = require('../controllers/usersController')
const User = require('../models/User')
const uploadMiddleware = require('../middlewares/uploadMiddleWare')



router.get('/:id',[isAuthenticated.check,UserController.getUserById])
router.put('/update/:id',[isAuthenticated.check,UserController.updateUser])
router.post('/:id/upload',[isAuthenticated.check,UserController.upload])

module.exports = router