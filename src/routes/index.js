const { Router } = require("express");
const productRouter = require("./allRoutes/productRouter");
const categoryRouter = require("./allRoutes/categoryRouter");
const sellerRouter = require("./allRoutes/sellerRouter");
const whistListRouter = require("./allRoutes/whislistRouter");
const cartRouter = require("./allRoutes/cartRoutes");
const homeRouter = require("./allRoutes/homeRouter");
const managerAuthRouter = require("./allRoutes/managerAuthRouter");
const paymentRouter = require("./allRoutes/paymentRouter");
const orderRouter = require("./allRoutes/orderRouter");
const dashboardRouter = require("./allRoutes/dashboardRouter");
const customerRouter = require("./allRoutes/customerRouter");
const router = Router();

router.use("/customer", customerRouter);
router.use("/product", productRouter);
router.use("/category", categoryRouter);
router.use("/seller", sellerRouter);
router.use("/wishlist", whistListRouter);
router.use("/cart", cartRouter);
router.use("/home", homeRouter);
router.use("/manager", managerAuthRouter);
router.use("/payment", paymentRouter);
router.use("/order", orderRouter);
router.use("/dashboard", dashboardRouter);

module.exports = router;
