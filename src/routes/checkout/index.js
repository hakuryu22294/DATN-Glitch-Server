const { Router } = require("express");
const CheckoutController = require("../../controllers/checkout.controller");
const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler");
const checkoutRouter = Router();
checkoutRouter.post("/review", asyncHandler(CheckoutController.checkoutReview));
module.exports = checkoutRouter;
