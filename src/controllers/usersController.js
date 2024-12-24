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
    updateUser: async(req,res)=>{
        const {User} = await dbInitialization
        const {
            params: { id }
          } = req;
          const payload = req.body
        //   console.log(payload)
        //   console.log(id) 
        const sequelize = await getSequelizeInstance()
            const transaction = await sequelize.transaction()
          try{
            
          const user = await User.update({payload},{where:{userId:id}},{transaction})
          console.log(user)
          transaction.commit()
          return res.status(200).json({
            status:"success",
            "message":"record updated"
          })
          }catch(err){
            if (transaction){
                try{
                    await transaction.rollback()
                }catch(rollbackError){
                    console.error(`transaction rollback error ${rollbackError}`)
                }
            }
            return res.status(401).json({
                "message":`record not updated`,
                "status":"bad request"
            })
          }

    },
    upload:async (req,res)=>{
            const userId = req.params
          try{
            const sequelize = await getSequelizeInstance()
            const transaction = await sequelize.transaction()
            if (!req.file) {
                // No file was uploaded
                return res.status(400).json({ error: "No file uploaded" });
              }
              // File upload successful
              const fileUrl = req.file.path; // URL of the uploaded file in Cloudinary
              console.log(fileUrl)
              // Perform any additional logic or save the file URL to a database
            
              res.status(200).json({ success: true, fileUrl: fileUrl });
              const user = await User.findOne({where:{userId}},{transaction})
              user.avatarUrl = fileUrl
              await user.save()
              
              transaction.commit()
              return res.status(200).json({
                status:"success",
                "message":"record updated"
              })
          }catch(err){
            if (transaction){
                try{
                    await transaction.rollback()
                }catch(rollbackError){
                    console.error(`transaction rollback error ${rollbackError}`)
                }
          }

    }

    }}