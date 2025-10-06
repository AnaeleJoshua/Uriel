const dbInitialization = require("../models/modelInit");
const { generateAccessToken, generateRefreshToken } = require('../../utils/utility');
const bcrypt = require('bcryptjs');

const handleLogIn = async (req, res) => {
  try {
    // destructure models and sequelize properly from dbInitialization
    const { models, sequelize } = await dbInitialization;
    const { User } = models;

    const { email, password } = req.body;
    const loweredEmail = email ? email.toLowerCase() : null;
    if (!loweredEmail || !password) {
      return res.status(400).json({
        status: "Bad request",
        message: "Email and password are required",
        statusCode: 400,
      });
    }

    const user = await User.findOne({ where: { loweredEmail } });
    if (!user) {
      return res.status(404).json({
        status: "Not found",
        message: "User not found",
        statusCode: 404,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "Unauthorized",
        message: "Invalid credentials",
        statusCode: 401,
      });
    }

    const accessToken = generateAccessToken(user.email, user.userId);
    const refreshToken = generateRefreshToken(user.email, user.userId);
    user.refreshToken = refreshToken;
    await user.save();

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: isProduction,
      maxAge: 24 * 60 * 60 * 1000,
    });

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
