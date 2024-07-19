const crypto = require("crypto");
const apiKeySchema = require("../models/apiKey.schema");
const findById = async (key) => {
  // const newKey = await apiKeySchema.create({
  //   key: crypto.randomBytes(64).toString("hex"),
  //   permissions: ["0000"],
  // });
  // console.log(newKey);
  const objKey = await apiKeySchema.findOne({ key, status: true }).lean();
  return objKey;
};

module.exports = { findById };
