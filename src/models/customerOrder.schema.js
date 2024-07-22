const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "CustomerOrder";
const COLLECTION_NAME = "CustomerOrders";

const customerOrderSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Customer",
    },
    products: {
      type: Array,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
    },
    shippingInfo: {
      type: Object,
      required: true,
    },
    deliveryStatus: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  CustomerOrder: model(DOCUMENT_NAME, customerOrderSchema),
};
