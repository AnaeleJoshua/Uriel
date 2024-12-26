const router = require('express').Router()
const isAuthenticated = require('../middlewares/IsAuthenticatedMiddleware')
const UserController = require('../controllers/usersController')
const upload = require('../middlewares/uploadMiddleWare')




router.get('/:id',[isAuthenticated.check,UserController.getUserById])
router.put('/update/:id',[isAuthenticated.check,UserController.updateUser])
// router.post('/:id/upload',upload.single('avatar'),
// UserController.upload)
router.post('/:id/upload', [isAuthenticated.check,upload.single('avatar'), UserController.uploadAvatar]);
router.get('/:id/avatar', isAuthenticated.check,UserController.getAvatar);

module.exports = router

