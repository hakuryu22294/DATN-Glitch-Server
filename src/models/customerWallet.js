const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "UserWallet";
const COLLECTION_NAME = "UserWallets";
const customerWalletSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
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
  CustomerWallet: model(DOCUMENT_NAME, customerWalletSchema),
};
