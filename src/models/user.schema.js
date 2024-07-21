const { model, Schema } = require("mongoose");
const { validate } = require("./shop.schema");
const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

const userSchema = new Schema(
  {
    userId: { type: Number, required: true },
    userSlug: { type: String, required: true },
    username: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid username!`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    userSalf: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    userPhone: {
      type: String,
      default: "",
      validate: {
        validator: function (v) {
          return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
            v
          );
        },
        message: (props) => `${props.value} is not a valid phone!`,
      },
    },
    userSex: {
      type: String,
      default: "",
    },
    userAvatar: {
      type: String,
      default: "",
    },
    userDoB: {
      type: Date,
      default: "",
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },
    userStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "active", "inactive"],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  User: model(DOCUMENT_NAME, userSchema),
};
