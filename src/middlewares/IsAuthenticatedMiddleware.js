const jwt = require('jsonwebtoken')
const  dotenv = require('dotenv')
// const redisClient = require('../../config/redisClient')
dotenv.config()
module.exports = {
    check:async (req,res,next)=>{
        const authHeader = req.headers['authorization']
        console.log("authHeader:",authHeader)
        // IF no auth headers are provided
    // THEN return 401 Unauthorized error
        if(!authHeader?.startsWith('Bearer')){
            return res.status(401).json({
                "status": 'Bad request',
                "message": 'Auth failed',
                "statusCode":401,
              });
        }
         // IF bearer auth header is not provided
    // THEN return 401 Unauthorized error
    // if (!authHeader.startsWith('Bearer')){
    //     return res.status(401).json({
    //         "Status":'Bad request',
    //         "Message":'Unauthorised',
    //         "statusCode": 401
    //     })
    // }
    const token = authHeader.split(' ')[1];
    console.log(`token : ${token}\n`)
    // console.log(`jwt : ${jwtSecret}\n`)


    // IF bearer auth header is provided, but token is not provided
    // THEN return 401 Unauthorized error
    if (!token) {
      return res.status(401).json({
        status: false,
        error: {
          message: 'Bearer token missing in the authorization headers.'
        }
      })
    }
    // Check Redis blacklist
  // const isBlacklisted = await redisClient.get(`bl_${token}`);
  // if (isBlacklisted) {
  //   return res.status(403).json({ message: 'Invalid login. Please login again.' });
  // }

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,{algorithms:['HS256'],clockTolerance: 5},(err,user)=>{
       
      if (err) {
            return res.status(403).json({
              status: false,
              error: 'Invalid access token provided, please login again.',
              err:err
            });
          }
          user.accessToken = token
          req.user = user // Save the user object for further use
        console.log(user)
          next();
    })
    // console.log(verified)
    
    }
}