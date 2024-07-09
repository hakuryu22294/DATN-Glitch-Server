const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

//init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//init mongodb
require("./dbs/init.mongodb");
const { checkOverloadConect } = require("./helpers/check.connect");
const router = require("./routes");
checkOverloadConect();
//init routes
app.use("/api/v1", router);

//handling errors

module.exports = app;
