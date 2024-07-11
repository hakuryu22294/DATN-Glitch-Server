const express = require("express");
const router = express.Router();
const accessRouter = require("./access");
const { apiKey, checkPermissionApiKey } = require("../auth/checkAuth");
const productRouter = require("./product");
router.use(apiKey);
router.use(checkPermissionApiKey("0000"));
router.use("/access", accessRouter);
router.use("/product", productRouter);

module.exports = router;
