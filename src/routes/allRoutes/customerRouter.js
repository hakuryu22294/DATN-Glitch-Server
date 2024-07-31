const { Router } = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const CustomerController = require("../../controllers/customer.controller");
const { authentication } = require("../../auth/authUtils");

const customerRouter = Router();

customerRouter.post("/register", asyncHandler(CustomerController.register_ctm));

customerRouter.post("/login", asyncHandler(CustomerController.login_ctm));
customerRouter.get(
  "/logout",
  authentication,
  asyncHandler(CustomerController.logout_ctm)
);

module.exports = customerRouter;
