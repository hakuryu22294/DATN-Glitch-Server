const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "PlatformWallet";
const COLLECTION_NAME = "PlatformWallets";

const platformWalletSchema = new Schema(
  {
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
  PlatformWallet: model(DOCUMENT_NAME, platformWalletSchema),
};
