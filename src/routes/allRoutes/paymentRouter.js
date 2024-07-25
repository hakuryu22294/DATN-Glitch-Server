const { Router } = require("express");
// const PaymentController = require("../../controllers/payment.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication, checkPermisson } = require("../../auth/authUtils");

const paymentRouter = Router();

module.exports = paymentRouter;
