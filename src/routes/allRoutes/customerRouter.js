const { Router } = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const CustomerController = require("../../controllers/customer.controller");
const { authentication } = require("../../auth/authUtils");

const customerRouter = Router();

customerRouter.post("/register", asyncHandler(CustomerController.register_ctm));
customerRouter.get(
  "/reset-token",
  authentication,
  asyncHandler(CustomerController.reset_token)
);
customerRouter.post("/login", asyncHandler(CustomerController.login_ctm));
customerRouter.get(
  "/logout",
  authentication,
  asyncHandler(CustomerController.logout_ctm)
);

customerRouter.get(
  "/get-shop-info",
  authentication,
  asyncHandler(CustomerController.get_seller_by_userId)
);

module.exports = customerRouter;
