const { Router } = require("express");
const CartController = require("../../controllers/cart.controller");
const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler");
const cartRouter = Router();

cartRouter.use(authentication);
cartRouter.post("/", asyncHandler(CartController.addToCart));
cartRouter.patch("/update", asyncHandler(CartController.updateCart));
cartRouter.get("/list", asyncHandler(CartController.listToCart));
cartRouter.delete("/delete", asyncHandler(CartController.deleteToCart));
module.exports = cartRouter;
