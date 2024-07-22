const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Seller";
const COLLECTION_NAME = "Sellers";

const sellerSchema = new Schema(
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
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dw3h0r5jy/image/upload/v1633355639/avatars/avatar-1.png",
    },
    role: {
      type: String,
      default: "seller",
    },
    status: {
      type: String,
      default: "inactive",
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
