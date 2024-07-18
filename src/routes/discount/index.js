const DiscountController = require("../../controllers/discount.controller");
const { Router } = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

const discountRouter = Router();

discountRouter.post(
  "/amount",
  asyncHandler(DiscountController.getDiscountAmount)
);
discountRouter.get(
  "/list-product-code",
  asyncHandler(DiscountController.getAllDiscountCodesWithProduct)
);

discountRouter.use(authentication);

discountRouter.post("/", asyncHandler(DiscountController.createDiscountCode));
discountRouter.get("/", asyncHandler(DiscountController.getAllDiscountCode));

module.exports = discountRouter;
