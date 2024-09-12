const { Schema, model } = require("mongoose");
const slugify = require("slugify");
const DOCUMENT_NAME = "Subcategory";
const COLLECTION_NAME = "Subcategories";

const subcategorySchema = new Schema(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Seller",
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

subcategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

subcategorySchema.index({ name: "text" });

module.exports = {
  Subcategory: model(DOCUMENT_NAME, subcategorySchema),
};
