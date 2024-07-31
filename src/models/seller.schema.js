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
      default: "active",
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

sellerSchema.index({
  name: "text",
  email: "text",
}),
  {
    weights: {
      name: 5,
      email: 4,
    },
  };

module.exports = {
  Seller: model(DOCUMENT_NAME, sellerSchema),
};
