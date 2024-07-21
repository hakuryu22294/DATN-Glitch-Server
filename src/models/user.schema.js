const { model, Schema } = require("mongoose");
const { validate } = require("./shop.schema");
const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

const userSchema = new Schema(
  {
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
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    phone: {
      type: String,
      default: "",
    },
    sex: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    dob: {
      type: Date,
      default: "",
    },
    role: {
      type: String,
      default: "user",
    },
    status: {
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
