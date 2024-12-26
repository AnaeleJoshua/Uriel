const multer = require("multer")
const {CloudinaryStorage} = require("multer-storage-cloudinary")
const cloudinary = require('../../config/cloudinaryConfig');
const path = require('path')
const dbInitialization = require("../models/modelInit");

const allowedFileTypes = ['image/jpg','image/jpeg','image/png']
const fileSize= 5*1024*1024
 
    const storage = new CloudinaryStorage({
        cloudinary:cloudinary,
        params:async (req,file)=>{
            const {User} = await dbInitialization 
            // const folderPath= `${folderName.trim()}`
            const id = req.params
            // const user = await  User.findOne({where:{userId:id}})
            // const folderName = `${user.firstName}_${user.lastName}`
            const fileExtension = path.extname(file.originalname).substring(1)
            const publicId = `${file.fieldname}-${Date.now()}`

            return {
                folder:"folderName",
                public_id:publicId,
                format:fileExtension
            }
        // }
    }
});


//     return storage

const uploader = function uploadMiddleware(allowedFileTypes,fileSize){

return multer({
    // dest:path.join(__dirname,'../','uploads')
    
    storage:storage,
    limits:{
        fileSize:fileSize
    },
    fileFilter:(req,file,cb)=>{
        if (allowedFileTypes.includes(file.mimetype)){
            cb(null,true)
        }else{
            cb(new Error(`Invalid file type:only ${allowedFileTypes.join(', ')} is allowed`))
        }

    // }
}
})

}
const upload = uploader(allowedFileTypes,fileSize)

module.exports = upload