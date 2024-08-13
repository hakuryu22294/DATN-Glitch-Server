const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Seller";
const COLLECTION_NAME = "Sellers";

const sellerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Customer",
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "active", "deactive"],
    },
    shopInfo: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  Seller: model(DOCUMENT_NAME, sellerSchema),
};
