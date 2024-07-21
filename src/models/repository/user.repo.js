const { BadRequestError } = require("../../core/error.response");
const { User } = require("../user.schema");

const findUserByEmailWithLogin = async ({ email }) => {
  const user = await User.findOne({ email }).lean();
  return user;
};

const createUser = async ({ email, username, password, status }) => {
  const user = await User.create({
    email,
    password,
    username,
    status,
  });
  return user;
};

module.exports = {
  createUser,
  findUserByEmailWithLogin,
};
