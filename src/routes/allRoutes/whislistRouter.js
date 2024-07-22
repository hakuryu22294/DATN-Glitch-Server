const { Router } = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const CartController = require("../../controllers/cart.controller");
const whistListRouter = Router();

whistListRouter.get("/", asyncHandler(CartController.get_whishlist));

whistListRouter.post("/", asyncHandler(CartController.add_whishlist));

whistListRouter.delete("/", asyncHandler(CartController.remove_whishlist));

module.exports = whistListRouter;
