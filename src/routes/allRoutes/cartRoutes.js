const { Router } = require("express");
const cartRouter = Router();
const { asyncHandler } = require("../../helpers/asyncHandler");
const CartController = require("../../controllers/cart.controller");

cartRouter.get("/", asyncHandler(CartController.get_producst_on_cart));
cartRouter.post("/ad-to-cart", asyncHandler(CartController.add_to_cart));
cartRouter.put(
  "/quantity-inc/:cartId",
  asyncHandler(CartController.quantity_inc)
);
cartRouter.put(
  "/quantity-dec/:cartId",
  asyncHandler(CartController.quantity_dec)
);
cartRouter.delete(
  "/delete-cart/:cartId",
  asyncHandler(CartController.delete_cart)
);

module.exports = cartRouter;
