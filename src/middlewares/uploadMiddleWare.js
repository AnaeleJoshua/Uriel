const multer = require("multer")
const {CloudinaryStorage} = require("multer-storage-cloudinary")
const cloudinary = require('../../utils/cloudinaryConfig');
const path = require('path')

function uploadMiddleware(folderName,allowedFileTypes,fileSize){
    const storage = new CloudinaryStorage({
        cloudinary:cloudinary,
        params:(req,file)=>{
            const folderPath= `${folderName.trim()}`
            const fileExtension = path.extname(file.originalname).substring(1)
            const publicId = `${file.fieldname}-${Date.now()}`

            return {
                folder:folderPath,
                public_id:publicId,
                format:fileExtension
            }
        }
    });

    return multer({
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

        }
    })
}

module.exports=uploadMiddleware