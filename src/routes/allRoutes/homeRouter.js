const HomeController = require("../../controllers/home.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { Router } = require("express");

const homeRouter = Router();
homeRouter.get("/get-categories", asyncHandler(HomeController.get_categories));
homeRouter.get("/get-products", asyncHandler(HomeController.get_products));
homeRouter.get(
  "/price-range-latest-product",
  HomeController.price_range_product
);
homeRouter.get("/query-products", asyncHandler(HomeController.query_products));
homeRouter.get(
  "/product-details/:slug",
  asyncHandler(HomeController.product_details)
);

homeRouter.post(
  "/customer/submit-review",
  asyncHandler(HomeController.submit_review)
);
homeRouter.get(
  "/customer/get-reviews/:productId",
  asyncHandler(HomeController.get_reviews)
);
homeRouter.get(
  "/shop-page/get-data/:sellerId",
  asyncHandler(HomeController.get_shop_data)
);

module.exports = homeRouter;
