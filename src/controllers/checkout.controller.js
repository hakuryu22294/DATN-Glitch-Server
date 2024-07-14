const CheckOutService = require("../services/checkout.service");

class CheckoutController {
  checkoutReview = async (res, req, next) => {
    new SuccessResponse({
      message: "Get checkout review successfully",
      metadata: await CheckOutService.checkoutReview(req.body),
    }).send(res);
  };
}

module.exports = new CheckoutController();
