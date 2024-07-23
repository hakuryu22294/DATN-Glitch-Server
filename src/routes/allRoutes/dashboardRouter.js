const { Router } = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const DashboardController = require("../../controllers/dashboard.controller");
const { authentication, checkPermisson } = require("../../auth/authUtils");

const dashboardRouter = Router();

dashboardRouter.use(authentication);
dashboardRouter.use(checkPermisson("admin", "seller"));
dashboardRouter.get(
  "/seller",
  asyncHandler(DashboardController.get_seller_dashboard_data)
);
dashboardRouter.use(checkPermisson("admin"));
dashboardRouter.get(
  "/admin",
  asyncHandler(DashboardController.get_admin_dashboard_data)
);

module.exports = dashboardRouter;
