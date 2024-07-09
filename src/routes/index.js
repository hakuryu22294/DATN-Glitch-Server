const express = require("express");
const router = express.Router();
const accessRouter = require("./access");
const { apiKey, checkPermissionApiKey } = require("../auth/checkAuth");
router.use(apiKey);
router.use(checkPermissionApiKey("0000"));
router.use("/access", accessRouter);

module.exports = router;
