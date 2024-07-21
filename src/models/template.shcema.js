const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Template";
const COLLECTION_NAME = "Templates";

const templateSchema = new Schema(
  {
    tempId: { type: String, required: true },
    tempName: { type: String, required: true },
    tempStatus: {
      type: String,
      default: "active",
      enum: ["active", "inactive"],
    },
    tempHTML: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  Template: model(DOCUMENT_NAME, templateSchema),
};
