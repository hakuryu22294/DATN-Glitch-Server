const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "Withdraw";
const COLLECTION_NAME = "Withdraws";

const withdrawSchema = new Schema(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Seller",
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  Withdraw: model(DOCUMENT_NAME, withdrawSchema),
};
