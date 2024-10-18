const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "Review";
const COLLECTION_NAME = "Reviews";

const reviewSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    customerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Customer",
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },

    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    review: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

reviewSchema.index({ userId: 1, productId: 1, orderId: 1 }, { unique: true });

module.exports = {
  Review: model(DOCUMENT_NAME, reviewSchema),
};
