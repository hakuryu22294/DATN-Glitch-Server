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

  asyncHandler(SellerController.get_seller)
);
sellerRouter.put(
  "/update/:sellerId",
  authentication,
  checkPermisson("admin"),
  asyncHandler(SellerController.seller_status_update)
);
sellerRouter.get(
  "/pending/get-pending-seller",
  authentication,
  checkPermisson("admin"),
  asyncHandler(SellerController.get_pending_seller)
);
sellerRouter.post(
  "/add-subcategory",
  authentication,
  checkPermisson("seller"),
  asyncHandler(SellerController.add_sub_category)
);
module.exports = sellerRouter;
