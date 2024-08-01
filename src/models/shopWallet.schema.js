const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "ShopWallet";
const COLLECTION_NAME = "ShopWallets";

const shopWalletSchema = new Schema(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    day: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
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
  ShopWallet: model(DOCUMENT_NAME, shopWalletSchema),
};
