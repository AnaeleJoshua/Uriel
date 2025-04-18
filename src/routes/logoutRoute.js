const router = require("express").Router();
const isAuthenticated = require('../middlewares/IsAuthenticatedMiddleware')
// Controller Imports
const logout = require("../auth/logoutController");

  // [SchemaValidationMiddleware.verify(loginPayload)]
  router.post(
    "/",[isAuthenticated.check],logout
  );

module.exports = router