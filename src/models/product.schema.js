const { min } = require("lodash");
const { model, Schema, Types } = require("mongoose");
const slugify = require("slugify");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    thumb: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    slug: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Electronic", "Clothing", "Book", "Toy", "Funiture", "Others"],
      shop: String,
    },
    variations: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
    shop: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    ratingAverage: {
      type: Number,
      default: 1,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//create index
productSchema.index({ name: "text", description: "text" });

//Document Middleware
productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//definde the product type = clothing
const clothingSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: String,
    material: String,
  },
  {
    collation: "Clothes",
    timestamps: true,
  }
);
const bookSchema = new Schema({
  author: {
    type: String,
    required: true,
  },
  publisher: String,
  year: Number,
});

const toySchema = new Schema({
  brand: {
    type: String,
    required: true,
  },
  dimension: String,
  weight: String,
  color: String,
});

const electronicSchema = new Schema(
  {
    manufacturer: {
      type: String,
      required: true,
    },
    model: String,
    color: String,
  },
  {
    collation: "Clothes",
    timestamps: true,
  }
);

const furnitureSchema = new Schema({
  brand: {
    type: String,
    required: true,
  },
  dimension: String,
  material: String,
  color: String,
});

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model("Clothing", clothingSchema),
  electronic: model("Electronic", electronicSchema),
  book: model("Book", bookSchema),
  toy: model("Toy", toySchema),
  furniture: model("Furniture", furnitureSchema),
};
