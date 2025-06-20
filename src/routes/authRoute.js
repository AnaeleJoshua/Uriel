const path = require('path');
const router = require("express").Router();
const loginRoute = require('./loginRoute')
const newAccessToken = require('./accessTokenRoute')
const registrationRoute = require('./regRoute')
const logoutRoute = require('./logoutRoute')
const confirmEmail = require('../auth/confirm-email')
const {sendPasswordResetMail,confirmPassword} = require('../auth/passwordConfirmation')

// Combine individual routes under /auth
router.use("/login", loginRoute);
router.use("/register", registrationRoute);
router.use("/new-access-token", newAccessToken);
router.use("/logout", logoutRoute);
router.post("/reset-password", sendPasswordResetMail);
router.post("/reset-password/confirm", confirmPassword);
router.get('/confirm-email',confirmEmail)

module.exports = router;