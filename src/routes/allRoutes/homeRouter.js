const HomeController = require("../../controllers/home.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { Router } = require("express");

const homeRouter = Router();
homeRouter.get("/get-categoriess", HomeController.get_categories);
homeRouter.get("/get-products", HomeController.get_products);
homeRouter.get(
  "/price-range-latest-product",
  HomeController.price_range_product
);
homeRouter.get("/query-products", HomeController.query_products);
homeRouter.get("/product-details/:slug", HomeController.product_details);

homeRouter.post("/customer/submit-review", HomeController.submit_review);
homeRouter.get("/customer/get-reviews/:productId", HomeController.get_reviews);

module.exports = homeRouter;
