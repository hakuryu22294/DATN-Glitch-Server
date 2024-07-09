const apiKeySchema = require("../models/apiKey.schema");
const findById = async (key) => {
  const newKey = await apiKeySchema.create({
    key: crypto.randomBytes(64).toString("hex"),
    permissions: ["0000"],
  });
  const objKey = await apiKeySchema.findOne({ key, status: true }).lean();
  return objKey;
};

module.exports = { findById };
