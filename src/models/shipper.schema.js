const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Shipper";
const COLLECTION_NAME = "Shippers";

const shipperSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "shipper",
    },
    assignedOrder: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    verify: {
      type: Boolean,
      default: false, 
    },
    status: {
      type: String,
      enum: ["pending", "active", "deactive"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  Shipper: model(DOCUMENT_NAME, shipperSchema),
};
