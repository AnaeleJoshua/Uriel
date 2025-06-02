const dbInitialization = require("../models/modelInit");
const { generateAccessToken } = require("../../utils/utility");
const jwt = require("jsonwebtoken");

const handleRefresh = async (req, res) => {
  try {
    const { User } = await dbInitialization;
    // Check for cookies containing the JWT
    const tokenFromCookie = req.cookies?.["refresh-token"] || null;

    console.log("Token from cookie:", tokenFromCookie);
    if (!tokenFromCookie) {
      return res.status(401).json({
        status: "Unauthorized",
        message: "No refresh token provided",
      });
    }
    // Verify the refresh token
    jwt.verify(
      tokenFromCookie,
      process.env.REFRESH_TOKEN_SECRET,
     async (err, decoded) => {
        if (err) {
          return res.status(403).json({
            status: "Forbidden",
            message: "Invalid or expired refresh token",
          });
        }
        const user = await User.findOne({ where: { userId: decoded.userId } });
        if (!user || user.refreshToken !== tokenFromCookie) {
          // If the user is not found or the refresh token doesn't match  
          return res.status(403).json({
            status: "Forbidden",
            message: "User not found",
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
