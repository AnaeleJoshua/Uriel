const router = require("express").Router();
const loginRoute = require('./loginRoute')
const refreshRoute = require('./refreshRoute')
const registrationRoute = require('./regRoute')
const logoutRoute = require('./logoutRoute')

// Combine individual routes under /auth
router.use("/login", loginRoute);
router.use("/register", registrationRoute);
router.use("/refresh", refreshRoute);
router.use("/logout", logoutRoute);

module.exports = router;