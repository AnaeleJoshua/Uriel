const router = require("express").Router();
const loginRoute = require('./loginRoute')
const refreshRoute = require('./accessTokenRoute')
const registrationRoute = require('./regRoute')

// Combine individual routes under /auth
router.use("/login", loginRoute);
router.use("/register", registrationRoute);
router.use("/accessToken", refreshRoute);

module.exports = router;