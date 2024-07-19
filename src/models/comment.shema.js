const { model, Schema } = require("mongoose");
const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "Comments";
const commentSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      default: "text",
    },
    commentLeft: {
      type: Number,
      default: 0,
    },
    commentRight: {
      type: Number,
      default: 0,
    },
    commentParentId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAME,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
module.exports = {
  Comment: model(DOCUMENT_NAME, commentSchema),
};
