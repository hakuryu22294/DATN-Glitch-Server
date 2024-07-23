const { Router } = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const CustomerController = require("../../controllers/customer.controller");

const customerAuthRouter = Router();
customerAuthRouter.post("/register", CustomerController.register_ctm);
customerAuthRouter.post("/login", CustomerController.login_ctm);
customerAuthRouter.use(authentication);

customerAuthRouter.get("/logout", CustomerController.logout_ctm);

module.exports = customerAuthRouter;
