const { Router } = require("express");
const ShippingController = require("../../controllers/shipping.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

const shippingRouter = Router();

shippingRouter.post(
  "/add-shipping-info",
  authentication,
  asyncHandler(ShippingController.add_shipping_info)
);

module.exports = shippingRouter;
