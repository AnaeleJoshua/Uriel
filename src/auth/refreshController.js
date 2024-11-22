const dbInitialization = require("../models/modelInit");
const { generateAccessToken } = require("../../utils/utility");
const jwt = require("jsonwebtoken");

const handleRefresh = async (req, res) => {
  try {
    const { User } = await dbInitialization;

    // Check for cookies containing the JWT
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return res.status(401).json({
        status: "Unauthorized",
        message: "No refresh token provided",
      });
    }

    const refreshToken = cookies.jwt;

    // Find user with the provided refresh token
    const foundUser = await User.findUser({ refreshToken });
    if (!foundUser) {
      return res.status(403).json({
        status: "Forbidden",
        message: "Invalid refresh token",
      });
    }

    // Verify the refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || foundUser.userId !== decoded.userId) {
          return res.status(403).json({
            status: "Forbidden",
            message: "Invalid or expired refresh token",
          });
        }

        // Generate a new access token
        const accessToken = generateAccessToken(decoded.email, decoded.userId);

        return res.status(200).json({
          status: "success",
          message: "Access token refreshed successfully",
          data: {
            accessToken,
          },
        });
      }
    );
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
