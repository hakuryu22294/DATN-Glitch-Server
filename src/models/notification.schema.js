const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";

const notificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["order", "product"],
    },
    senderId: {
      type: Number,
      required: true,
    },
    receivedId: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  Notification: model(DOCUMENT_NAME, notificationSchema),
};
