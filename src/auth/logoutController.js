const dbInitialization = require("../models/modelInit");

const logOut = async (req, res) => {
  try {
    const { User } = await dbInitialization;
    const { cookies: { ['refresh-token']: refreshToken }, user: { userId } } = req;

    console.log("userId", userId);
    console.log("refreshToken", refreshToken);

    if (!refreshToken || !userId) {
      console.log("No refresh token or userId found in request");
      return res.status(400).json({
        status: 'failed',
        message: 'Invalid request'
      });
    }

    const user = await User.findByPk(userId);
    if (user) {
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
      message: 'Logout Successful'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'failed',
      message: 'Logout failed'
    });
  }
};

module.exports = logOut;
