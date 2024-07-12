const { Inventory } = require("../inventory");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknow",
}) => {
  return await Inventory.create({
    product: productId,
    shop: shopId,
    stock,
    location,
  });
};

module.exports = {
  insertInventory,
};
