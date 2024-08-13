const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "ShipperWallet";
const COLLECTION_NAME = "ShipperWallets";

const shipperWalletSchema = new Schema(
  {
    shipperId: {
      type: Schema.Types.ObjectId,
      ref: "Shipper",
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
  ShipperWallet: model(DOCUMENT_NAME, shipperWalletSchema),
};
