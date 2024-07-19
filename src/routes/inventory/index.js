const { Router } = require("express");
const inventoryRouter = Router();
const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler");
const InventoryController = require("../../controllers/inevntory.controller");

inventoryRouter.use(authentication);
inventoryRouter.post("/stock", asyncHandler(InventoryController.addStock));
module.exports = inventoryRouter;
