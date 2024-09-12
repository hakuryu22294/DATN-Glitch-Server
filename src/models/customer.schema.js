const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Customer";
const COLLECTION_NAME = "Customers";

// Define the schema for shipping information
const shippingInfoSchema = new Schema(
  {
    name: String,
    address: String,
    phone: String,
    province: String,
    district: String,
    ward: String,
  },
  { _id: false }
);

const customerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "active",
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "seller"],
    },

    shippingInfo: {
      type: [shippingInfoSchema],
      validate: [arrayLimit, "Exceeds the limit of 3 shipping addresses"],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

function arrayLimit(val) {
  return val.length <= 2;
}

module.exports = {
  Customer: model(DOCUMENT_NAME, customerSchema),
};
