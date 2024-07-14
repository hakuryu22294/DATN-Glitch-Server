const { model, Types, Schema } = require("mongoose");
const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const orderSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    checkout: {
      type: Object,
      default: {},
    },
    shipping: {
      type: Object,
      default: {},
    },
    payment: {
      type: Object,
      default: {},
    },
    products: {
      type: Array,
      default: [],
      required: true,
    },
    trackingNumber: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "cancelled", "delivered"],
      default: "pending",
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: "createOn",
      updatedAt: "updateOn",
    },
  }
);

module.exports = {
  Order: model(DOCUMENT_NAME, orderSchema),
};
