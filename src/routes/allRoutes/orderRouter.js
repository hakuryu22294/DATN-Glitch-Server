const { Router } = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const OrderController = require("../../controllers/order.controller");

const orderRouter = Router();

orderRouter.get(
  "/payment-check/:id",
  asyncHandler(OrderController.payment_check)
);

orderRouter.post("/place-order", asyncHandler(OrderController.place_order));
