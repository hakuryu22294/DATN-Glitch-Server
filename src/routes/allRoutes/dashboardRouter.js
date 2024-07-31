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

module.exports = dashboardRouter;
