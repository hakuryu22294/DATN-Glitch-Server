const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "Otp";
const COLLECTION_NAME = "Otps";
const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expireAt: {
      type: Date,
      default: Date.now(),
      expire: 300,
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
