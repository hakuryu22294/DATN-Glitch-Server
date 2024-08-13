const { Router } = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const ShopController = require("../../controllers/shop.controller");

const shopRouter = Router();

shopRouter.get("/:sellerId", asyncHandler(ShopController.get_products));
shopRouter.get(
  "/:sellerId/average-rating",
  asyncHandler(ShopController.get_average_rating)
);

shopRouter.get(
  "/shop-info/:sellerId",
  asyncHandler(ShopController.get_shop_info)
);

module.exports = shopRouter;
