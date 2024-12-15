const dbInitialization = require("../models/modelInit");
const { generateAccessToken, encryptPassword } = require('../../utils/utility');
const bcrypt = require('bcryptjs')

const handleLogIn = async (req, res) => {
  try {
    // Ensure models are properly initialized
    const { User } = await dbInitialization;

    // Extract login credentials from the request body
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: "Bad request",
        message: "Email and password are required",
        statusCode: 400,
      });
    }

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        status: "Not found",
        message: "User not found",
        statusCode: 404,
      });
    }

    // Encrypt the input password and compare with stored password
    const encryptedPassword = await bcrypt.compare(password,user.password);
    // const encryptedPassword = await encryptPassword(password);
    console.log("userPass",user.password)
    console.log("EncryptPass",encryptedPassword)
    if ( !encryptedPassword) {
      return res.status(401).json({
        status: "Unauthorized",
        message: "Invalid credentials",
        statusCode: 401,
      });
    }

    // Generate an access token
    const accessToken = generateAccessToken(user.email, user.userId);

    // Respond with success and access token
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        accessToken,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    // Log and handle unexpected errors
    console.error("Login error:", error.message);
    return res.status(500).json({
      status: "error",
      message: "An error occurred during login",
      statusCode: 500,
      error: error.message,
      stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
    });
  }
};

module.exports = handleLogIn;
