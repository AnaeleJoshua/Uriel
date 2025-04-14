const router = require("express").Router();

// Controller Imports
const register = require("../auth/RegController");

// Middleware Imports
const SchemaValidationMiddleware = require("../middlewares/SchemaValidationMiddleware");
// // JSON Schema Imports for payload verification
const registerPayload = require("../schemas/registerPayload");



router.post(
    "/",
    [SchemaValidationMiddleware.verify(registerPayload)],register
  );
  

  

module.exports = router