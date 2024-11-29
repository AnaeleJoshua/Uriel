const router = require("express").Router();

// Controller Imports
const login = require("../auth/logInController");

// Middleware Imports
const SchemaValidationMiddleware = require("../middlewares/SchemaValidationMiddleware");
// // JSON Schema Imports for payload verification
const loginPayload = require("../schemas/loginPayload");


  // [SchemaValidationMiddleware.verify(loginPayload)]
  router.post(
    "/",[SchemaValidationMiddleware.verify(loginPayload)],login
  );

module.exports = router