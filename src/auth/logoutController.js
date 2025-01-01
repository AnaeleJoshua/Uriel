const dbInitialization = require("../models/modelInit");
const getSequelizeInstance = require('../../config/db');
//requirement
//clear refresh token from db
//clear refresh token from cookie
//

const logOut = async (req,res) => {
    try{
        const {User} = await dbInitialization
        const {cookies:{jwt},user:{userId}} = req //destruct jwt and userId from req object
        console.log(userId)
        if (!jwt){
            return res.status(400).json({status:'failed',
                'message':'invalid request'
            })
        }
        const [updateRow] = await User.update({refreshToken:''},{where:{userId}})
        // Set the refresh token as an HTTP-only cookie
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.status(200).json({status:'success',
        message:'Logout Successful'
      })

    }catch(err){
        console.error(err)
        res.status(500).json({
            status:'failed',
            message:'logout failed'
        })
    }
    
}

module.exports = logOut