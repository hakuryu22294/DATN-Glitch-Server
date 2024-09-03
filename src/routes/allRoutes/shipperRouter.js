const { Router } = require("express");
const shipperRouter = Router();
const ShipperController = require("../../controllers/shipper.controller");
const { authentication, checkPermisson } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler");

shipperRouter.get(
  "/dashboard",
  asyncHandler(ShipperController.get_shipper_dashboard)
);
shipperRouter.get(
  "/",
  authentication,
  checkPermisson("admin"),
  asyncHandler(ShipperController.get_all_shippers)
);
shipperRouter.post("/login", asyncHandler(ShipperController.login_shipper));
shipperRouter.get(
  "/info",
  authentication,
  asyncHandler(ShipperController.get_shipper_info)
);
shipperRouter.post(
  "/register",
  authentication,
  checkPermisson("admin"),
  asyncHandler(ShipperController.create_shipper)
);
shipperRouter.get(
  "/orders/:shipperId",
  authentication,
  checkPermisson("shipper"),
  asyncHandler(ShipperController.get_all_orders)
);
module.exports = shipperRouter;
