const { Schema, model } = require("mongoose");
const slugify = require("slugify");
const DOCUMENT_NAME = "Category";
const COLLECTION_NAME = "Categories";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    subcategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subcategory",
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

categorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  if (this.subcategories) {
    this.subcategories.forEach((sub) => {
      sub.slug = slugify(sub.name, { lower: true });
    });
  }
  next();
});

categorySchema.index({ name: "text" });

module.exports = {
  Category: model(DOCUMENT_NAME, categorySchema),
};
