const { Router } = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const DashboardController = require("../../controllers/dashboard.controller");
const { authentication, checkPermisson } = require("../../auth/authUtils");

const dashboardRouter = Router();

dashboardRouter.get(
  "/seller",
  authentication,
  checkPermisson("admin", "seller"),
  asyncHandler(DashboardController.get_seller_dashboard_data)
);

dashboardRouter.get(
  "/get-sold/:sellerId",
  authentication,
  checkPermisson("admin", "seller"),
  asyncHandler(DashboardController.get_sold_product_quantities)
);

dashboardRouter.get(
  "/admin",
  authentication,
  checkPermisson("admin"),
  asyncHandler(DashboardController.get_admin_dashboard_data)
);

dashboardRouter.get(
  "/get-stats",
  authentication,
  checkPermisson("admin", "seller"),
  asyncHandler(DashboardController.get_daily_orders_stats)
);

dashboardRouter.get(
  "/get-top/:sellerId",
  authentication,
  checkPermisson("admin", "seller"),
  asyncHandler(DashboardController.get_top_products)
);

dashboardRouter.get(
  "/get-wallet-stats",
  authentication,
  checkPermisson("admin"),
  asyncHandler(DashboardController.get_daily_platform_wallet_stats)
);

module.exports = dashboardRouter;
