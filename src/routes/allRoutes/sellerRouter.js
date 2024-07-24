const { Router } = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const SellerController = require("../../controllers/seller.controller");
const { authentication, checkPermisson } = require("../../auth/authUtils");

const sellerRouter = Router();

sellerRouter.use(authentication);

sellerRouter.use(checkPermisson("admin", "seller"));
sellerRouter.get("/", asyncHandler(SellerController.get_all_seller));

sellerRouter.get("/:sellerId", asyncHandler(SellerController.get_seller));
sellerRouter.patch(
  "/update/:sellerId",
  asyncHandler(SellerController.seller_status_update)
);

module.exports = sellerRouter;
