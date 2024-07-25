const { Router } = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const SellerController = require("../../controllers/seller.controller");
const { authentication, checkPermisson } = require("../../auth/authUtils");

const sellerRouter = Router();

sellerRouter.get(
  "/",
  authentication,
  checkPermisson("admin"),
  asyncHandler(SellerController.get_all_seller)
);

sellerRouter.get(
  "/:sellerId",
  authentication,
  checkPermisson("admin", "seller"),
  asyncHandler(SellerController.get_seller)
);
sellerRouter.patch(
  "/update/:sellerId",
  authentication,
  checkPermisson("admin"),
  asyncHandler(SellerController.seller_status_update)
);

module.exports = sellerRouter;
