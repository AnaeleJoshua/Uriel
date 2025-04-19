const path = require('path');
const router = require("express").Router();
const loginRoute = require('./loginRoute')
const refreshRoute = require('./accessTokenRoute')
const registrationRoute = require('./regRoute')
const logoutRoute = require('./logoutRoute')
const confirmEmail = require('../auth/confirm-email')
const {sendPasswordResetMail,confirmPassword} = require('../auth/passwordConfirmation')

// Combine individual routes under /auth
router.use("/login", loginRoute);
router.use("/register", registrationRoute);
router.use("/refresh", refreshRoute);
router.use("/logout", logoutRoute);
router.post("/reset-password", sendPasswordResetMail);
router.get("/reset-password/confirm", confirmPassword);
router.get('/confirmation-email',confirmEmail)

module.exports = router;