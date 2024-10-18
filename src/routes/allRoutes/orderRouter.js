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
  "/get-orders/:userId/:status",
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
  authentication,
  checkPermisson("admin"),
  asyncHandler(OrderController.get_admin_orders)
);
orderRouter.get(
  "/admin/order/:orderId",
  asyncHandler(OrderController.get_admin_order)
);
orderRouter.put(
  "/admin/order-status/update/:orderId",
  OrderController.admin_order_status_update
);

orderRouter.get(
  "/seller/confirm-order/:orderId/:paymentMethod",
  asyncHandler(OrderController.order_confirm)
);

orderRouter.get(
  "/seller/orders/:sellerId",
  authentication,
  checkPermisson("seller"),
  asyncHandler(OrderController.get_seller_orders)
);
orderRouter.get(
  "/seller/order/:orderId",
  asyncHandler(OrderController.get_seller_order)
);

orderRouter.post(
  "/admin/hand-over",
  authentication,
  checkPermisson("seller"),
  asyncHandler(OrderController.hand_over_orders_to_shipper)
);
orderRouter.put(
  "/handle-cancel/:orderId",
  authentication,
  checkPermisson("user", "seller"),
  asyncHandler(OrderController.cancel_order)
);
orderRouter.put(
  "/handle-received/:orderId",
  authentication,
  checkPermisson("user", "seller"),
  asyncHandler(OrderController.received_order)
);
orderRouter.put(
  "/handle-accept",
  authentication,
  checkPermisson("seller"),
  asyncHandler(OrderController.accept_orders)
);

module.exports = orderRouter;
