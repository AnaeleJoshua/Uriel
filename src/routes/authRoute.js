const router = require("express").Router();
const loginRoute = require('./loginRoute')
const refreshRoute = require('./refreshRoute')
const registrationRoute = require('./regRoute')
const logoutRoute = require('./logoutRoute')
const confirmEmail = require('../auth/confirm-email')

// Combine individual routes under /auth
router.use("/login", loginRoute);
router.use("/register", registrationRoute);
router.use("/refresh", refreshRoute);
router.use("/logout", logoutRoute);
router.get('/confirmation-email',confirmEmail)

module.exports = router;