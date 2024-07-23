const { Router } = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const CustomerController = require("../../controllers/customer.controller");
const { authentication } = require("../../auth/authUtils");

const customerRouter = Router();

customerRouter.post(
  "/customer-register",
  asyncHandler(CustomerController.register_ctm)
);

customerRouter.post(
  "/customer-login",
  asyncHandler(CustomerController.login_ctm)
);
customerRouter.use(authentication);
customerRouter.get(
  "/customer-logout",
  asyncHandler(CustomerController.logout_ctm)
);

module.exports = customerRouter;
