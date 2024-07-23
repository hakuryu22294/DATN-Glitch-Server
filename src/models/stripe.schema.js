const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Stripe";
const COLLECTION_NAME = "Stripes";

const stripeSchema = new Schema(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Seller",
    },
    stripeId: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  Stripe: model(DOCUMENT_NAME, stripeSchema),
};
