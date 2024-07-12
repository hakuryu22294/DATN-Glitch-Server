const { model, Schema, Types } = require("mongoose");
const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

const discountSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "fixed_amount",
    },
    value: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    maxUses: {
      type: Number,
      required: true,
    },
    usesCount: {
      type: Number,
      required: true,
    },
    userUsed: {
      type: Array,
      default: [],
    },
    maxUsesPerUser: {
      type: Number,
      required: true,
    },
    minOrderValue: {
      type: Number,
      required: true,
    },
    shop: {
      type: Types.ObjectId,
      ref: "Shop",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicabeProducts: {
      type: Array,
      default: [],
    },
    appliesTo: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  Discount: model(DOCUMENT_NAME, discountSchema),
};
