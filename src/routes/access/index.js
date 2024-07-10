const { Router } = require("express");
const AccessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const accessRouter = Router();

accessRouter.post("/shop/sign-up", asyncHandler(AccessController.signUp));
accessRouter.post("/shop/sign-in", asyncHandler(AccessController.signIn));
//authentication
accessRouter.use(authentication);
accessRouter.post("/shop/sign-out", asyncHandler(AccessController.logout));
module.exports = accessRouter;
