const { Router } = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const SellerController = require("../../controllers/seller.controller");

const sellerRouter = Router();

sellerRouter.get("/", asyncHandler(SellerController.get_all_seller));

sellerRouter.get("/:sellerId", asyncHandler(SellerController.get_seller));

sellerRouter.patch(
  "/update/:sellerId",
  asyncHandler(SellerController.seller_status_update)
);

module.exports = sellerRouter;
