const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";
const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    products: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  Cart: model(DOCUMENT_NAME, cartSchema),
};
