const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const corsOptions = require('./config/corsOptions');
const morgan = require("morgan");
// const swaggerUI = require('swagger-ui-express');
// const YAML = require('yamljs');
const getSequelizeInstance = require('./config/db');
const { logger } = require('./src/middlewares/logEvents');
const credentials = require('./src/middlewares/credentials');
const cookieParser = require('cookie-parser');
const path = require('path')

// Create swaggerDocs file
// const swaggerJsDocs = YAML.load('./api.yaml');

// Middleware import
const errorHandler = require('./src/middlewares/errorHandler');

// Custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS and fetch cookies credentials requirement
app.use(credentials);

app.use(morgan("tiny"));
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Allow preflight requests for all routes


// Middleware that parses the body payloads as JSON to be consumed by the next set of middlewares and controllers
app.use(express.json());

// Middleware to handle cookies
app.use(cookieParser());

// Async function to initialize database connection and start server
(async () => {
  try {
    const databaseConn = await getSequelizeInstance();
    console.log("Database connection established.");

    // Syncing the models with the database
    await databaseConn.sync();
    console.log("Database synchronized.");

    // Routes
    app.get("/api/v1/", (req, res) =>  res.sendFile(path.join(__dirname,'index.html')));
    // app.use("/v1/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));
    app.use("/api/v1/auth", require('./src/routes/authRoute'));
    app.use("/api/v1/users", require("./src/routes/userRoutes"));
    app.use("/api/v1/organisations", require("./src/routes/organisationsRoutes"));
    app.get("/", (req, res) =>  res.send('welcome to Uriel'));
    app.get("/avatar", (req, res) =>  res.sendFile(path.join(__dirname,'index.html')));
    // app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));
    app.use("/auth", require('./src/routes/authRoute'));
    app.use("/api/users", require("./src/routes/userRoutes"));
    app.use("/api/organisations", require("./src/routes/organisationsRoutes"));

    // Error handler middleware
    app.use(errorHandler);

    // Start server
    app.listen(port, () => console.log(`Server ready on port: ${port}`));
  } catch (err) {
    console.error('Error initializing application:', err);
  }
})();
