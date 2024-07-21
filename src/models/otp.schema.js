const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Otp";
const COLLECTION_NAME = "Otps";

const otpSchema = new Schema(
  {
    otpToken: {
      type: String,
      required: true,
    },
    otpEmail: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    otpStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "active", "token"],
    },
    optPassword: {
      type: String,
    },
    expireAt: {
      type: Date,
      expires: 1000 * 60 * 5,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  Otp: model(DOCUMENT_NAME, otpSchema),
};
