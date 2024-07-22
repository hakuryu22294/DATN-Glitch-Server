const { Router } = require("express");
const productRouter = require("./allRoutes/productRouter");
const categoryRouter = require("./allRoutes/categoryRouter");
const sellerRouter = require("./allRoutes/sellerRouter");
const whistListRouter = require("./allRoutes/whislistRouter");
const cartRouter = require("./allRoutes/cartRoutes");
const router = Router();

router.use("/product", productRouter);
router.use("/category", categoryRouter);
router.use("/seller", sellerRouter);
router.use("wishlist", whistListRouter);
router.use("cart", cartRouter);
module.exports = router;
