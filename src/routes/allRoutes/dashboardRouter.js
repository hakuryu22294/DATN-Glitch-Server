const { Router } = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const DashboardController = require("../../controllers/dashboard.controller");
const { authentication, checkPermisson } = require("../../auth/authUtils");

const dashboardRouter = Router();

dashboardRouter.get(
  "/seller",
  checkPermisson("admin", "seller"),
  asyncHandler(DashboardController.get_seller_dashboard_data)
);

dashboardRouter.get(
  "/admin",
  checkPermisson("admin"),
  asyncHandler(DashboardController.get_admin_dashboard_data)
);

module.exports = dashboardRouter;
