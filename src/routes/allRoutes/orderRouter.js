const { Router } = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const OrderController = require("../../controllers/order.controller");
const { checkPermisson, authentication } = require("../../auth/authUtils");

const orderRouter = Router();
orderRouter.post(
  "/place-order",
  authentication,
  asyncHandler(OrderController.place_order)
);
orderRouter.get(
  "/get-dashboard-data/:userId",
  authentication,
  asyncHandler(OrderController.get_customer_dashboard)
);
orderRouter.get(
  "/get-orders/:customerId/:status",
  authentication,
  asyncHandler(OrderController.get_orders)
);

orderRouter.get(
  "/get-order-details/:orderId",
  authentication,
  asyncHandler(OrderController.get_order_details)
);

orderRouter.get(
  "/admin/orders",
  checkPermisson("admin"),
  OrderController.get_admin_orders
);
orderRouter.get("/admin/order/:orderId", OrderController.get_admin_order);
orderRouter.put(
  "/admin/order-status/update/:orderId",
  OrderController.admin_order_status_update
);

orderRouter.use(checkPermisson("seller"));
orderRouter.get("/seller/orders/:sellerId", OrderController.get_seller_orders);
orderRouter.get("/seller/order/:orderId", OrderController.get_seller_order);
orderRouter.put(
  "/seller/order-status/update/:orderId",
  OrderController.admin_order_status_update
);

module.exports = orderRouter;
