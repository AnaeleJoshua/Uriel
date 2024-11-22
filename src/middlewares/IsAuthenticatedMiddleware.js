const jwt = require('jsonwebtoken')
const  dotenv = require('dotenv')
dotenv.config()
module.exports = {
    check:(req,res,next)=>{
        const authHeader = req.headers['authorization']
        console.log(authHeader)
        // IF no auth headers are provided
    // THEN return 401 Unauthorized error
        if(!authHeader){
            return res.status(401).json({
                "status": 'Bad request',
                "message": 'Auth failed',
                "statusCode":401,
              });
        }
         // IF bearer auth header is not provided
    // THEN return 401 Unauthorized error
    if (!authHeader.startsWith('Bearer')){
        return res.status(401).json({
            "Status":'Bad request',
            "Message":'Unauthorised',
            "statusCode": 401
        })
    }
    const token = authHeader.split(' ')[1];
    // console.log(`token : ${token}\n`)
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

    const verified = jwt.verify(token,process.env.JWT_SECRET,{algorithms:['HS256']},(err,user)=>{
       
      if (err) {
            return res.status(403).json({
              status: false,
              error: 'Invalid access token provided, please login again.',
              err:err
            });
          }
    
          req.user = user // Save the user object for further use
        // console.log(user)
          next();
    })
    // console.log(verified)
    
    }
}