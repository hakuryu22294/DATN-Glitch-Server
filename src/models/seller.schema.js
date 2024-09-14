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
    avatar: {
      type: String,
    },

    status: {
      type: String,
      default: "pending",
      enum: ["pending", "active", "deactive"],
    },
    subCategories: {
      type: [String],
      default: [],
    },
    shopInfo: {
      type: Object,
      default: {},
    },
    activeAt: {
      type: Date,
    },
    shopRatting: {
      type: Number,
      default: 0,
      max: 5,
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
