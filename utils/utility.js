const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


const genrateToken = (payload,secret,expiresIn) => {
  return jwt.sign(payload,secret,{expiresIn})
}
// Generates an Access Token using username and userId for the user's authentication
const generateAccessToken = (email, userId) => {
    const payload = {email,userId}
    const secret =process.env.ACCESS_TOKEN_SECRET;
    const expiration = process.env.JWT_ACCESS_EXPIRATION || '30s'
    return genrateToken(payload,secret,expiration) 
  };
// Generates an refresh Token using username and userId for the user's authentication
const generateRefreshToken = (email, userId) => {
    const payload = {email,userId}
    const secret =process.env.REFRESH_TOKEN_SECRET;
    const expiration = process.env.JWT_REFRESH_EXPIRATION || '2d'
    return genrateToken(payload,secret,expiration) 
  };


  // Encrypts the password using SHA256 Algorithm, for enhanced security of the password
const encryptPassword = (password) => {
    // We will hash the password using SHA256 Algorithm before storing in the DB
    // // Creating SHA-256 hash object
    // const hash = crypto.createHash("sha256");
    // // Update the hash object with the string to be encrypted
    // hash.update(password);
    // // Get the encrypted value in hexadecimal format
    // return hash.digest("hex");

    const hashedPass = bcrypt.hash(password,10);
    return hashedPass
  };

  module.exports = {encryptPassword,generateAccessToken,generateRefreshToken}