const router = require("express").Router();

// Controller Imports
const accessToken = require("../auth/refreshController");

// Middleware Imports
// const SchemaValidationMiddleware = require("../middlewares/SchemaValidationMiddleware");



router.post("/", accessToken);

  

module.exports = router