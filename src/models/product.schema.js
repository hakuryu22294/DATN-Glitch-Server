const { model, Schema, Types } = require("mongoose");

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
    shop: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
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
