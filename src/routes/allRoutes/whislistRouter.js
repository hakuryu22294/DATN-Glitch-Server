const { Router } = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const CartController = require("../../controllers/cart.controller");
const { authentication } = require("../../auth/authUtils");
const whistListRouter = Router();

whistListRouter.get(
  "/",
  authentication,
  asyncHandler(CartController.get_whishlist)
);

whistListRouter.post(
  "/",
  authentication,
  asyncHandler(CartController.add_whishlist)
);

whistListRouter.delete(
  "/",
  authentication,
  asyncHandler(CartController.remove_whishlist)
);

module.exports = whistListRouter;
