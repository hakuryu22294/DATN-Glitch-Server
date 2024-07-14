const { SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");
class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Create discount code successfully",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shop: req.user.userId,
      }),
    });
  };
  getAllDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all discount code successfully",
      metadata: await DiscountService.getAllDiscountByShop({
        ...req.query,
        shop: req.user.userId,
      }),
    });
  };
  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: "Get discount amount successfully",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    });
  };
  getAllDiscountCodesWithProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all discount code successfully",
      metadata: await DiscountService.getAllDisCountCodesWithProduct({
        ...req.query,
      }),
    });
  };
}

module.exports = new DiscountController();
