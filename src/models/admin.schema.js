const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "Admin";
const COLLECTION_NAME = "Admins";
const adminSchema = new Schema(
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
      default: "admin",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  Admin: model(DOCUMENT_NAME, adminSchema),
};
