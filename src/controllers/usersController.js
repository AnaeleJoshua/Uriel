const dbInitialization = require("../models/modelInit");
const getSequelizeInstance = require('../../config/db');

module.exports = {
    getUserById : async (req,res)=>{
        const {User} = await dbInitialization
        const {
            params: { id }
          } = req;
    console.log(`userId: ${id}`)
    const sequelize = await getSequelizeInstance()
    const transaction = await sequelize.transaction()
        let user = await User.findUser({userId:id},{transaction})
        if(!user){
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
            "phone":user.phone
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
          try{
            const sequelize = await getSequelizeInstance()
            const transaction = await sequelize.transaction()
          const user = await User.updateUser({userId:id},{payload},{transaction})
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

    }

}