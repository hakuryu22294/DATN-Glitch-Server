const { BadRequestError } = require("../core/error.response");
const { Inventory } = require("../models/inventory.shema");
const { getProductById } = require("../models/repository/product.repo");

class InventoryService {
  static async addStockToInventory({ stock, productId, shopId, localtion }) {
    const product = await getProductById(productId);
    if (!product) {
      throw new BadRequestError("Product not exists");
    }
    const query = { shop: shopId, product: productId },
      updateSet = {
        $inc: {
          stock: stock,
        },
        $set: {
          location: localtion,
        },
      },
      options = { upsert: true, new: true };
    return await Inventory.findOneAndUpdate(query, updateSet, options);
  }
}
module.exports = InventoryService;
