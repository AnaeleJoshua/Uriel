const dbInitialization = require("../models/modelInit");
const getSequelizeInstance = require('../../config/db');
const uploadMiddleWare= require('../middlewares/uploadMiddleWare')

module.exports = {
    getUserById : async (req,res)=>{
        const {User,Organisation} = await dbInitialization
        const {
            params: { id }
          } = req;
    console.log(`userId: ${id}`)
    const sequelize = await getSequelizeInstance()
    const transaction = await sequelize.transaction()
        let user = await User.findOne({userId:id},{transaction})
        if(!user){
            await transaction.rollback()
            return res.status(401).json({
                "status":"Bad request",
                "message":"Invalid user"
            })
        }
        let organisations = await Organisation.findAll({
            attributes:['name'],
            include:{
                model:User,
                where:{userId:id},
                attributes:[]
        }},{transaction})// find all organisation user belongs to
        if(organisations.length === 0){
            await transaction.rollback()
            return res.status(401).json({
                "status":"Bad request",
                "message":"Invalid user"
            })
        }
        await transaction.commit()
        user = user.toJSON()
        return res.status(200).json({
            "status":"success",
                "user":{
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    organisations: organisations
                }
        })
    },
    //update user info
    updateUser: async(req,res)=>{
        const {User} = await dbInitialization
        const { params: { id }, body: payload } = req;
        console.log(payload)
        const sequelize = await getSequelizeInstance()
        const transaction = await sequelize.transaction()
          try{
              const [updatedRows] = await User.update(
                  payload , // Fields to update
                  {
                    where: { userId: id }, // Conditions
                    transaction,           // Transaction (inside options object)
                  }
              );
                console.log(updatedRows)
              if (!updatedRows) {
                throw new Error(" no changes applied");
                }
              transaction.commit()
              return res.status(200).json({
                status:"success",
                "message":"record updated"
              })
          }catch(err){
              console.error(err);
              if (transaction) await transaction.rollback();
              return res.status(400).json({
                  status: "Bad Request",
                  message: "Failed to update record",
              });
        }
    },
    //upload avatar
    uploadAvatar:async (req,res)=>{
            const {params:{id}} = req
            const {file} = req
            if (!file) {
                return res.status(400).json({ status: "Bad Request", message: "No file uploaded" });
            }
            // File upload successful
            const fileUrl = req.file.path; // URL of the uploaded file in Cloudinary
            const sequelize = await getSequelizeInstance();
            const transaction = await sequelize.transaction();
          try{
            const {User} = await dbInitialization
              // Perform any additional logic or save the file URL to a database
              const user = await User.findOne({userId:id},{transaction})
              if (!user) {
                throw new Error("User not found");
            }
              user.avatarUrl = fileUrl
              await user.save({transaction})
            
              transaction.commit()
              return res.status(200).json({
                status:"success",
                "message":"file uploaded",
                fileUrl: fileUrl
              })
          }catch(err){
            console.error(err)
            if (transaction) await transaction.rollback()
                return res.status(400).json({
                    status: "Bad Request",
                    message: "File upload failed",
                });
          }

    },
    //getAvatar
    getAvatar: async(req,res)=>{
       //get user id
       const {params:{id}} = req
       //extract avatar url from db using id
       const User = await dbInitialization
       try{
       const userAvatarUrl = await User.findOne({where:{userId:id},attributes:['avatarUrl']})
       if(!userAvatarUrl) return res.status(400).json('Avatar not found')
        return res.status(200).json({
                     status: 'success',
                     data:{
                        avatarUrl:userAvatarUrl
                     }
            }) 

       //return image 
       }catch(err){
        console.error('an error occurred: ',err)
        return res.status(401).json({
            staus:'Bad request',
            message:'operation failed'
        })
       }
    },
    confirmEmail:async (req,res)=>{
        
    }

}