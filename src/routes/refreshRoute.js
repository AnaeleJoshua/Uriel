const router = require("express").Router();

// Controller Imports
const refresh = require("../auth/refreshController");

// Middleware Imports
// const SchemaValidationMiddleware = require("../middlewares/SchemaValidationMiddleware");



router.post("/", refresh);

  

module.exports = router