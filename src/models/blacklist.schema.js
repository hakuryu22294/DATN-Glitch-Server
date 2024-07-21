const { Types, Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Blacklist";
const COLLECTION_NAME = "Blacklists";

const blacklistSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  Blacklist: model(DOCUMENT_NAME, blacklistSchema),
};
