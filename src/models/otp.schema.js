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
    },
    otpStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "active", "token"],
    },
    expireAt: {
      type: Date,
      default: Date.now(),
      expires: 60 * 5,
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
