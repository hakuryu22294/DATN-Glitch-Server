const { Router } = require("express");
const cartRouter = Router();
const { asyncHandler } = require("../../helpers/asyncHandler");
const CartController = require("../../controllers/cart.controller");
const { authentication } = require("../../auth/authUtils");

cartRouter.get(
  "/:userId",
  authentication,
  asyncHandler(CartController.get_producst_on_cart)
);
cartRouter.post(
  "/add-to-cart",
  authentication,
  asyncHandler(CartController.add_to_cart)
);
cartRouter.put(
  "/quantity-inc/:cartId",
  authentication,
  asyncHandler(CartController.quantity_inc)
);
cartRouter.put(
  "/quantity-dec/:cartId",
  authentication,
  asyncHandler(CartController.quantity_dec)
);
cartRouter.delete(
  "/delete-cart/:cartId",
  authentication,
  asyncHandler(CartController.delete_cart)
);
cartRouter.post(
  "/check-pre-order",
  asyncHandler(CartController.check_cart_before_buy)
);
module.exports = cartRouter;
