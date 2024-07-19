const { SuccessResponse } = require("../core/success.response");
const InventoryService = require("../services/inventory.service");

class InventoryController {
  addStock = async (req, res, next) => {
    new SuccessResponse({
      message: "Add stock successfully",
      metadata: await InventoryService.addStockToInventory(req.body),
    });
  };
}

module.exports = new InventoryController();
