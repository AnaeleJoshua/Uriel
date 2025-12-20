const dbInitialization = require("../models/modelInit");
const { generateAccessToken, generateRefreshToken } = require("../utils/utility");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const handleRefresh = async (req, res) => {
  try {
    const { models } = await dbInitialization;
    const { User } = models;

    const tokenFromCookie = req.cookies?.["refresh-token"] || null;
    console.log(tokenFromCookie)
    if (!tokenFromCookie) {
      return res.status(401).json({
        status: "Unauthorized",
        message: "No refresh token provided",
      });
    }

    let decoded;
    try {
      decoded = await promisify(jwt.verify)(tokenFromCookie, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(403).json({
        status: "Forbidden",
        message: "Invalid or expired refresh token",
      });
    }

    const user = await User.findOne({ where: { userId: decoded.userId } });

    if (!user || user.refreshToken !== tokenFromCookie) {
      return res.status(403).json({
        status: "Forbidden",
        message: "User not found or refresh token mismatch",
      });
    }

    // 🌀 ROTATE: generate new refresh token and update DB
    const newRefreshToken = generateRefreshToken(user.email, user.userId);
    await user.update({ refreshToken: newRefreshToken });

    // Set new refresh token in cookie
    res.cookie("refresh-token", newRefreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Generate new access token
    const accessToken = generateAccessToken(user.email, user.userId);

    return res.status(200).json({
      status: "success",
      message: "Access token refreshed successfully",
      data: {
        accessToken,
      },
    });

  } catch (error) {
    console.error("Error in handleRefresh:", error.message);
    return res.status(500).json({
      status: "Internal Server Error",
      message: "An unexpected error occurred",
      error: process.env.NODE_ENV === "production" ? undefined : error.stack,
    });
  }
};

module.exports = handleRefresh;
