const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Wishlist";
const COLLECTION_NAME = "Wishlists";

const wishlistSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    rating: {
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
  Wishlist: model(DOCUMENT_NAME, wishlistSchema),
};
