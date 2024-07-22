const { Router } = require("express");
const productRouter = require("./allRoutes/productRouter");
const router = Router();

router.use("/product", productRouter);

module.exports = router;
