const { Router } = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const CartController = require("../../controllers/cart.controller");
const { authentication } = require("../../auth/authUtils");
const whistListRouter = Router();

whistListRouter.get(
  "/:userId",
  authentication,
  asyncHandler(CartController.get_whishlist)
);

whistListRouter.post(
  "/:userId",
  authentication,
  asyncHandler(CartController.add_whishlist)
);

whistListRouter.delete(
  "/:whislistId",
  authentication,
  asyncHandler(CartController.remove_whishlist)
);

module.exports = whistListRouter;
