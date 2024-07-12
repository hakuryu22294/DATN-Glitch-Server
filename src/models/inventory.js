const { model, Schema, Types } = require("mongoose");
const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

const inventorySchema = new Schema(
  {
    product: {
      type: Types.ObjectId,
      ref: "Product",
    },
    location: {
      type: String,
      default: "unknow",
      stock: {
        type: Number,
        required: true,
      },
    },
    shop: {
      type: Types.ObjectId,
      ref: "Shop",
    },
    reservations: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  Inventory: model(DOCUMENT_NAME, inventorySchema),
};
