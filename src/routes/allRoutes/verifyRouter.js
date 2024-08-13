const { Router } = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const ShipperController = require("../../controllers/shipper.controller");

const verifyRouter = Router();

verifyRouter.get("/shipper/:token", asyncHandler(ShipperController.verify_otp));

module.exports = verifyRouter;
