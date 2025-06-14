const dbInitialization = require("../models/modelInit");
const redisClient = require('../../config/redisClient')
const jwt = require('jsonwebtoken');

const logOut = async (req, res) => {
  try {
    const { models } = await dbInitialization;
    const { User } = models;

    const refreshToken = req.cookies?.["refresh-token"];
    const userId = req.user?.userId;

     const token = req.user.accessToken;
    if (!token) return res.status(400).json({ message: 'No token found' });

    if (!refreshToken || !userId || !token) {
      return res.status(400).json({
        status: 'failed',
        message: 'Invalid request',
      });
    }
const redisClient = require('../../config/redisClient');
const jwt = require('jsonwebtoken');

const logOut = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(400).json({ message: 'No token found' });

    const decoded = jwt.decode(token);
    const exp = decoded?.exp;

    if (exp) {
      const ttl = exp - Math.floor(Date.now() / 1000); // time until expiry in seconds
      await redisClient.setEx(`bl_${token}`, ttl, 'blacklisted');
    }

    // clear refresh-token cookie, and handle DB if needed
    res.clearCookie('refresh-token', {
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    });

    return res.json({ message: 'Logged out successfully' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Logout failed' });
  }
};
    const decoded = jwt.decode(token);
    const exp = decoded?.exp;

     if (exp) {
      const ttl = exp - Math.floor(Date.now() / 1000); // time until expiry in seconds
      await redisClient.setEx(`bl_${token}`, ttl, 'blacklisted');
    }

    const user = await User.findByPk(userId);
    if (user && user.refreshToken === refreshToken) {
      user.refreshToken = "";
      await user.save();
    }

    res.clearCookie("refresh-token", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    return res.status(200).json({
      status: 'success',
      message: 'Logout successful',
    });

  } catch (err) {
    console.error("Logout error:", err.message);
    res.status(500).json({
      status: 'failed',
      message: 'Logout failed',
    });
  }
};

module.exports = logOut;
