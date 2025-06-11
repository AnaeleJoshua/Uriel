const dbInitialization = require("../models/modelInit");

const logOut = async (req, res) => {
  try {
    const { models } = await dbInitialization;
    const { User } = models;

    const refreshToken = req.cookies?.["refresh-token"];
    const userId = req.user?.userId;

    console.log("userId", userId);
    console.log("refreshToken", refreshToken);

    if (!refreshToken || !userId) {
      return res.status(400).json({
        status: 'failed',
        message: 'Invalid request',
      });
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
