const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

//init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
//init mongodb
require("./dbs/init.mongodb");
const { checkOverloadConect } = require("./helpers/check.connect");
checkOverloadConect();
//init routes
app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello World",
  });
});

//handling errors

module.exports = app;
