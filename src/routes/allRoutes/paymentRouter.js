const { Router } = require("express");
const PaymentController = require("../../controllers/payment.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication, checkPermisson } = require("../../auth/authUtils");

const paymentRouter = Router();
paymentRouter.use(authentication);
paymentRouter.get("/request", PaymentController.get_payments_request);
paymentRouter.post(
  "/request-confirm",
  PaymentController.payment_request_confirm
);
paymentRouter.get(
  "/create-stripe-connect-account",
  asyncHandler(PaymentController.create_stripe_connect_acc)
);
paymentRouter.put(
  "/active-stripe-connect-account/:activeCode",
  asyncHandler(PaymentController.active_stripe_connect_acc)
);
paymentRouter.use(checkPermisson("seller"));
paymentRouter.get(
  "/seller-payment-details/:sellerId",
  asyncHandler(PaymentController.get_seller_payment_details)
);
paymentRouter.post("/withdraw-request", PaymentController.withdraw_request);

module.exports = paymentRouter;
