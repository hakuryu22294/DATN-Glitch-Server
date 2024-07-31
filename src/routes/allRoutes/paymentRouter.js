const { Router } = require("express");

const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication, checkPermisson } = require("../../auth/authUtils");
const PaymentController = require("../../controllers/payment.controller");
const paymentRouter = Router();
paymentRouter.post(
  "/create-payment",
  authentication,
  asyncHandler(PaymentController.createPayment)
);
module.exports = paymentRouter;
