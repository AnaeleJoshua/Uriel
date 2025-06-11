const dbInitialization = require("../models/modelInit");
const path = require("path");

async function confirmEmail(req, res) {
  const { models } = await dbInitialization;
  const { User } = models;

  console.log("confirm email");
  console.log("req.query", req.query);

  const { token } = req.query;
  console.log("returned token", token);

  const user = await User.findOne({ where: { confirmationCode: token } });

  if (!user) return res.status(400).send("Invalid token");

  if (new Date() > user.confirmationExpires)
    return res.status(400).send("Token has expired");

  user.isVerified = true;
  user.confirmationCode = null;
  user.confirmationExpires = null;
  await user.save();

  res.sendFile(path.join(__dirname, "../../public", "email-confirmation-success.html"));
}

module.exports = confirmEmail;
