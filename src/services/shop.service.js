const shopSchema = require("../models/shop.schema");

const findByEmail = async ({
  email,
  select = {
    email: 1,
    password: 1,
    name: 1,
    status: 1,
    role: 1,
  },
}) => {
  return await shopSchema.findOne({ email }).select(select).lean();
};
module.exports = { findByEmail };
