const multer = require("multer")
const {CloudinaryStorage} = require("multer-storage-cloudinary")
const cloudinary = require('../../utils/cloudinaryConfig');
const path = require('path')

const allowedFileTypes = ['image/jpg','image/jpeg','image/png']
// function uploadMiddleware(folderName,allowedFileTypes,fileSize){
    const storage = new CloudinaryStorage({
        cloudinary:cloudinary,
        params:(req,file)=>{
            // const folderPath= `${folderName.trim()}`
            const id = req.params
            console.log(id)
            const fileExtension = path.extname(file.originalname).substring(1)
            const publicId = `${file.fieldname}-${Date.now()}`

            return {
                folder:'cloudy',
                public_id:publicId,
                format:fileExtension
            }
        }
    });

//     return storage
// }
const upload = multer({
    storage:storage,
    limits:{
        fileSize:5*1024*1024
    },
    // fileFilter:(req,file,cb)=>{
    //     if (allowedFileTypes.includes(file.mimetype)){
    //         cb(null,true)
    //     }else{
    //         cb(new Error(`Invalid file type:only ${allowedFileTypes.join(', ')} is allowed`))
    //     }

    // }
})

module.exports=upload