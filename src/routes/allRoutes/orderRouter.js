const { Router } = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const OrderController = require("../../controllers/order.controller");
const { checkPermisson, authentication } = require("../../auth/authUtils");

const orderRouter = Router();
orderRouter.use(authentication);
orderRouter.post("/place-order", asyncHandler(OrderController.place_order));
orderRouter.get(
  "/get-dashboard-data/:userId",
  asyncHandler(OrderController.get_customer_dashboard)
);
orderRouter.get(
  "/get-orders/:customerId/:status",
  asyncHandler(OrderController.get_orders)
);

orderRouter.get(
  "/get-order-details/:orderId",
  asyncHandler(OrderController.get_order_details)
);

orderRouter.use(checkPermisson("admin"));
orderRouter.get("/admin/orders", OrderController.get_admin_orders);
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
