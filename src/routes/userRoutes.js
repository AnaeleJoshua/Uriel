const router = require('express').Router()
const isAuthenticated = require('../middlewares/IsAuthenticatedMiddleware')
const UserController = require('../controllers/usersController')
const upload = require('../middlewares/uploadMiddleWare')




router.get('/:id',[isAuthenticated.check,UserController.getUserById])
router.put('/update/:id',[isAuthenticated.check,UserController.updateUser])
// router.post('/:id/upload',upload.single('avatar'),
// UserController.upload)
app.post('/:id/upload', upload.single('image'), function (req, res) {
    res.json(req.file);
  });

module.exports = router

// async(req,res,next)=>{
//     try{
//         const dbInitialization = require("../models/modelInit");
//         const {User}= await dbInitialization
//          //import user
//          const {id} = req.params
//         const user = await User.findOne({where:{userId:id}});
//         if(!user){
//             return res.status(401).json({
//                 error:'unauthorized'
//             })
//         }
//         // console.log(user)
//         const folderName = `${user.firstName}_${user.lastName}`
//             // console.log(folderName)
//             const allowedFileTypes = ['image/jpg','image/jpeg','image/png']
//             const fileSize = 5*1024*1024
//             //create dynamic upload middleware
//             const upload = uploadMiddleWare(folderName,allowedFileTypes,fileSize)
//             // console.log(upload)
//             upload.single("avatar")(req,res,(err)=>{
//                 if (err){
//                     return res.status(400).json({error:err.message})
//                 }
//                 next()
//             })
//     }catch(err){
//         console.error(err)
//         res.status(500).json({
//             error:'an error occured'
//         })
//     }
// },