const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const orderSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    products: {
      type: Array,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
      required: true,
    },
    shippingInfo: {
      type: Object,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "completed",
        "cancelled",
        "waiting_receive",
      ],
      default: "pending",
    },
    deliveryStatus: {
      type: String,
      enum: ["not_assigned", "assigned", "delivered", "cancelled"],
      default: "not_assigned",
    },
    orderDate: {
      type: Date,
      required: true,
    },
    shipperId: {
      type: Schema.Types.ObjectId,
      ref: "Shipper",
    },
    assignedDate: {
      type: Date,
    },
    completeDeliveryDate: {
      type: Date,
    },
    cancelDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  Order: model(DOCUMENT_NAME, orderSchema),
};
