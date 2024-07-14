const express = require("express");
const router = express.Router();
const accessRouter = require("./access");
const { apiKey, checkPermissionApiKey } = require("../auth/checkAuth");
const productRouter = require("./product");
const discountRouter = require("./discount");
const checkoutRouter = require("./checkout");
const inventoryRouter = require("./inventory");
router.use(apiKey);
router.use(checkPermissionApiKey("0000"));
router.use("/access", accessRouter);
router.use("/product", productRouter);
router.use("/discount", discountRouter);
router.use("/checkout", checkoutRouter);
router.use("/inventory", inventoryRouter);

module.exports = router;
