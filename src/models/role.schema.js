const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Role";
const COLLECTION_NAME = "Roles";

// const grantList = [
//   {
//     role: "admin",
//     resource: "profile",
//     action: "update:any",
//     attributes: "*",
//   },
//   {
//     role: "admin",
//     resource: "balance",
//     action: "update:any",
//     attributes: "*, !mount",
//   },
//   {
//     role: "shop",
//     resource: "profile",
//     action: "update:own",
//     attributes: "*, !mount",
//   },
//   {
//     role: "shop",
//     resource: "balance",
//     action: "update:own",
//     attributes: "*, !mount",
//   },
//   {
//     role: "user",
//     resource: "profile",
//     action: "update:own",
//     attributes: "*",
//   },
//   {
//     role: "admin",
//     resource: "profile",
//     action: "read:own",
//     attributes: "*",
//   },
// ];
const roleSchema = new Schema(
  {
    roleName: {
      type: String,
      default: "user",
    },
    roleSlug: {
      type: String,
      required: true,
    },
    roleStatus: {
      type: String,
      default: "active",
      enum: ["active", "block", "pending"],
    },
    roleDescription: {
      type: String,
      default: "",
    },
    roleGrants: [
      {
        resource: {
          type: Schema.Types.ObjectId,
          ref: "Resource",
          required: true,
        },
        actions: [
          {
            type: String,
            required: true,
          },
        ],
        attributes: {
          type: String,
          default: "*",
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  Role: model(DOCUMENT_NAME, roleSchema),
};
